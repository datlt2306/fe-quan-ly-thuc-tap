import { studentColumnAccessors } from '@/App/constants/studentColumnAccessors';
import { InternSupportType, StudentStatusEnum, StudentStatusGroupEnum } from '@/App/constants/studentStatus';
import { useExportToExcel } from '@/App/hooks/useExcel';
import Badge from '@/Core/components/common/Badge';
import Button from '@/Core/components/common/Button';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { InputColumnFilter, SelectColumnFilter } from '@/Core/components/common/Table/ReactTableFilters';
import IndeterminateCheckbox from '@/Core/components/common/Table/RowSelectionCheckbox';
import Typography from '@/Core/components/common/Text/Typography';
import { convertToExcelData } from '@/Core/utils/excelDataHandler';
import formatDate from '@/Core/utils/formatDate';
import { ArrowDownIcon, ChatBubbleLeftEllipsisIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Fragment, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import UpdateReviewModal from './components/UpdateReviewModal';
import { useGetStudentReviewCVQuery } from '@/App/providers/apis/studentApi';

const handleGetInternStatusStyle = (value) => {
	const style = Object.keys(StudentStatusGroupEnum).find((k) => StudentStatusGroupEnum[k].includes(value));
	return style;
};

const ReviewCvPage = () => {
	const { data: studentsListData, isLoading: isLoadingData, isError } = useGetStudentReviewCVQuery();
	const [selectedStudents, setSelectedStudents] = useState([]);
	const [open, setOpen] = useState(false);
	const { handleExportFile } = useExportToExcel();

	const tableData = useMemo(() => {
		return Array.isArray(studentsListData)
			? studentsListData.map((student, index) => {
					const companyStudentApplyFor =
						student.support === 1
							? {
									nameCompany: student.business?.name,
									taxCode: student.business?.tax_code,
									addressCompany: student.business?.address
							  }
							: student.support === 0
							? {
									nameCompany: student?.nameCompany,
									taxCode: student?.taxCode,
									addressCompany: student?.addressCompany
							  }
							: null;

					return {
						...student,
						index: index + 1,
						createdAt: formatDate(student.createdAt),
						statusCheck: StudentStatusEnum[student.statusCheck],
						support: InternSupportType[student.support],
						statusStudent: student.statusStudent.trim(),
						...companyStudentApplyFor
					};
			  })
			: [];
	}, [studentsListData]);

	// Define columns of table
	const columnsData = useMemo(
		() => [
			{
				Header: ({ getToggleAllPageRowsSelectedProps }) => (
					<IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
				),
				accessor: '_id',
				Cell: ({ row }) => {
					const isDisabled = !(!!row.original?.CV || !!row.original?.form || !!row.original?.report);
					return <IndeterminateCheckbox disabled={isDisabled} {...row.getToggleRowSelectedProps()} />;
				}
			},
			{
				Header: studentColumnAccessors.index,
				accessor: 'index',
				sortable: true
			},
			{
				Header: studentColumnAccessors.name,
				accessor: 'name',
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true
			},
			{
				Header: studentColumnAccessors.mssv,
				accessor: 'mssv', // object key
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
				Cell: ({ value }) => <span className='font-semibold uppercase'>{value}</span>
			},
			{
				Header: studentColumnAccessors.majorCode,
				accessor: 'majorCode',
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true
			},
			{
				Header: studentColumnAccessors.phoneNumber,
				accessor: 'phoneNumber',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: studentColumnAccessors.email,
				accessor: 'email',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: studentColumnAccessors.support,
				accessor: 'support',
				Filter: SelectColumnFilter,
				filterable: true
			},
			{
				Header: studentColumnAccessors.statusCheck,
				accessor: 'statusCheck',
				Filter: ({ column: { filterValue, setFilter, preFilteredRows, id } }) => (
					<SelectColumnFilter
						column={{ filterValue, setFilter, preFilteredRows, id }}
						customOptions={StudentStatusEnum}
					/>
				),
				filterable: true,
				Cell: ({ value }) => <Badge variant={handleGetInternStatusStyle(value)}>{value}</Badge>
			},

			{
				Header: studentColumnAccessors.nameCompany,
				accessors: 'nameCompany',
				Filter: InputColumnFilter,
				filterable: true,
				Aggregated: ({ value }) => value,
				Cell: ({ row }) =>
					row.original?.nameCompany && (
						<ul tw='flex flex-col gap-2'>
							<li>
								<strong>{row.original?.nameCompany}</strong>
							</li>
							<li>
								<i>Mã số thuế: </i>
								{row.original?.taxCode}
							</li>
						</ul>
					)
			},
			{
				Header: studentColumnAccessors.dream,
				accessor: 'dream',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: studentColumnAccessors.CV,
				accessor: 'CV',
				Filter: InputColumnFilter,
				filterable: false,
				sortable: false,
				Cell: ({ value }) => (
					<Button
						as='a'
						href={value}
						target='_blank'
						variant={value ? 'ghost' : 'disabled'}
						shape='square'
						size='sm'
						disabled={!!value}>
						{value ? <EyeIcon className='h-4 w-4' /> : <EyeSlashIcon className='h-4 w-4' />}
					</Button>
				)
			},
			{
				Header: studentColumnAccessors.reviewer,
				accessor: 'reviewer',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: studentColumnAccessors.statusStudent,
				accessor: 'statusStudent',
				Filter: SelectColumnFilter,
				filterable: true,
				Cell: ({ value }) => <span className='font-semibold'>{value}</span>
			},

			{
				Header: studentColumnAccessors.createdAt,
				accessor: 'createdAt',
				Filter: InputColumnFilter,
				filterable: true,
				Cell: ({ value }) => <span>{formatDate(value)}</span>
			},
			{
				Header: studentColumnAccessors.note,
				accessor: 'note',
				filterable: false,
				sortable: false
			}
		],
		[]
	);

	const reviewStatusOptions = useMemo(() => {
		const studentStatusMap = new Map();
		Object.keys(StudentStatusEnum).forEach((key) => studentStatusMap.set(key, StudentStatusEnum[key]));
		return [
			{ label: studentStatusMap.get('1'), value: 1 },
			{ label: studentStatusMap.get('2'), value: 2 }
		];
	}, []);
	// Export data from table to excel file
	const handleExportDataToExcel = (data) => {
		if (!data.length) {
			toast.warn('Chưa có dữ liệu để xuất file !');
			return;
		}
		const exportedData = convertToExcelData({ data: data, columnKeysAccessor: studentColumnAccessors });
		if (!exportedData) {
			toast.error('Export dữ liệu thất bại !');
			return;
		}
		handleExportFile({ data: exportedData, fileName: 'Danh sách sinh viên' });
	};

	return (
		<Fragment>
			<UpdateReviewModal
				openState={open}
				onOpenStateChange={setOpen}
				selectedStudents={selectedStudents}
				statusOptions={reviewStatusOptions}
			/>
			<Container>
				<Box>
					<Typography level={5} fontWeight='semibold'>
						Review CV
					</Typography>
					<ButtonList>
						{!!selectedStudents.length && (
							<Button variant='secondary' size='sm' onClick={() => setOpen(!open)}>
								<ChatBubbleLeftEllipsisIcon className='h-5 w-5' /> Review
							</Button>
						)}
						<Button variant='success' size='sm' onClick={() => handleExportDataToExcel(tableData)}>
							<ArrowDownIcon className='h-4 w-4' /> Export file excel
						</Button>
					</ButtonList>
				</Box>
				<ReactTable
					data={tableData}
					columns={columnsData}
					loading={isLoadingData}
					onGetSelectedRows={setSelectedStudents}
				/>
			</Container>
		</Fragment>
	);
};

const Container = tw.div`flex flex-col gap-6`;
const Box = tw.div`flex justify-between items-center py-4 h-[3rem]`;
const ButtonList = tw.div`flex items-stretch gap-1`;

export default ReviewCvPage;
