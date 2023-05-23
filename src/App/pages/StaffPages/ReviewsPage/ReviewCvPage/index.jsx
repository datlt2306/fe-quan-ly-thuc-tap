import { InternSupportType, StudentStatusEnum, StudentStatusGroupEnum } from '@/App/constants/studentStatus';
import { useGetStudentReviewCVQuery } from '@/App/providers/apis/studentApi';
import Badge from '@/Core/components/common/Badge';
import Button from '@/Core/components/common/Button';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { InputColumnFilter, SelectColumnFilter } from '@/Core/components/common/Table/ReactTableFilters';
import IndeterminateCheckbox from '@/Core/components/common/Table/RowSelectionCheckbox';
import Typography from '@/Core/components/common/Text/Typography';
import formatDate from '@/Core/utils/formatDate';
import {
	ArrowDownIcon,
	ChatBubbleLeftEllipsisIcon,
	CheckCircleIcon,
	EyeIcon,
	EyeSlashIcon
} from '@heroicons/react/24/outline';
import { Fragment, useMemo, useState } from 'react';
import tw from 'twin.macro';
import { columnAccessors } from '../../StudentListPage/constants';
import UpdateReviewCvModal from './components/UpdateReviewCvModal';
import { useExportToExcel } from '@/App/hooks/useExcel';
import { convertToExcelData } from '@/Core/utils/excelDataHandler';

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
			? studentsListData.map((student, index) => ({
					...student,
					index: index + 1,
					createdAt: formatDate(student.createdAt),
					statusCheck: StudentStatusEnum[student.statusCheck],
					support: InternSupportType[student.support],
					statusStudent: student.statusStudent.trim()
			  }))
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
				Header: columnAccessors.index,
				accessor: 'index',
				sortable: true
			},
			{
				Header: columnAccessors.name,
				accessor: 'name',
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true
			},
			{
				Header: columnAccessors.mssv,
				accessor: 'mssv', // object key
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
				Cell: ({ value }) => <span className='font-semibold uppercase'>{value}</span>
			},
			{
				Header: columnAccessors.majorCode,
				accessor: 'majorCode',
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true
			},
			{
				Header: columnAccessors.phoneNumber,
				accessor: 'phoneNumber',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: columnAccessors.email,
				accessor: 'email',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: columnAccessors.support,
				accessor: 'support',
				Filter: SelectColumnFilter,
				filterable: true
			},
			{
				Header: columnAccessors.statusCheck,
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
				Header: columnAccessors.nameCompany,
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
				Header: columnAccessors.dream,
				accessor: 'dream',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: columnAccessors.CV,
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
				Header: columnAccessors.reviewer,
				accessor: 'reviewer',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: columnAccessors.statusStudent,
				accessor: 'statusStudent',
				Filter: SelectColumnFilter,
				filterable: true,
				Cell: ({ value }) => <span className='font-semibold'>{value}</span>
			},

			{
				Header: columnAccessors.createdAt,
				accessor: 'createdAt',
				Filter: InputColumnFilter,
				filterable: true,
				Cell: ({ value }) => <span>{formatDate(value)}</span>
			},
			{
				Header: columnAccessors.note,
				accessor: 'note',
				filterable: false,
				sortable: false
			}
		],
		[]
	);

	// Export data from table to excel file
	const handleExportDataToExcel = (data) => {
		if (!data.length) {
			toast.warn('Chưa có dữ liệu để xuất file !');
			return;
		}
		const exportedData = convertToExcelData({ data: data, columnKeysAccessor: columnAccessors });
		if (!exportedData) {
			toast.error('Export dữ liệu thất bại !');
			return;
		}
		handleExportFile({ data: exportedData, fileName: 'Danh sách sinh viên' });
	};

	return (
		<Fragment>
			<UpdateReviewCvModal openState={open} onOpenStateChange={setOpen} selectedStudents={selectedStudents} />
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