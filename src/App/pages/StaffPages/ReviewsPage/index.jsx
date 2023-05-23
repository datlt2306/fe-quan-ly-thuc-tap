import ReactTable from '@/Core/components/common/Table/ReactTable';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { columnAccessors } from '../StudentListPage/constants';
import { InputColumnFilter, SelectColumnFilter } from '@/Core/components/common/Table/ReactTableFilters';
import IndeterminateCheckbox from '@/Core/components/common/Table/RowSelectionCheckbox';
import { useGetStudentsQuery } from '@/App/providers/apis/studentApi';
import { useSelector } from 'react-redux';
import formatDate from '@/Core/utils/formatDate';
import Badge from '@/Core/components/common/Badge';
import Button from '@/Core/components/common/Button';
import { CheckCircleIcon, ExclamationTriangleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { InternSupportType, StudentStatusEnum, StudentStatusGroupEnum } from '@/App/constants/studentStatus';
import tw from 'twin.macro';
import Typography from '@/Core/components/common/Text/Typography';
import Modal from '@/Core/components/common/Modal';
import Text from '@/Core/components/common/Text/Text';

const handleGetInternStatusStyle = (value) => {
	const style = Object.keys(StudentStatusGroupEnum).find((k) => StudentStatusGroupEnum[k].includes(value));
	return style;
};

const ReviewPage = () => {
	const { defaultSemester } = useSelector((state) => state.semester);
	const { data: studentsListData, isLoading, isError } = useGetStudentsQuery({ semester: defaultSemester }, { refetchOnMountOrArgChange: true });
	const [selectedStudents, setSelectedStudents] = useState([]);
	const [open, setOpen] = useState(false);
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
	}, [studentsListData, isLoading]);

	useEffect(() => {
		console.log(selectedStudents);
	});

	// Define columns of table
	const columnsData = useMemo(
		() => [
			{
				Header: ({ getToggleAllPageRowsSelectedProps }) => <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />,
				accessor: '_id',
				Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
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
					<SelectColumnFilter column={{ filterValue, setFilter, preFilteredRows, id }} customOptions={StudentStatusEnum} />
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
				Header: columnAccessors.position,
				accessor: 'position',
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
					<Button as='a' href={value} target='_blank' variant={value ? 'ghost' : 'disabled'} shape='square' size='sm' disabled={!!value}>
						{value ? <EyeIcon className='h-4 w-4' /> : <EyeSlashIcon className='h-4 w-4' />}
					</Button>
				)
			},
			{
				Header: columnAccessors.report,
				accessor: 'report',
				Cell: ({ value }) => !!value && <Badge variant='info'>Đã nộp</Badge>
			},
			{
				Header: columnAccessors.form,
				accessor: 'form',
				Cell: ({ value }) => !!value && <Badge variant='info'>Đã nộp</Badge>
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

	return (
		<Fragment>
			<Modal openState={open} onOpenStateChange={setOpen} title='Cập nhật trạng thái sinh viên'>
				<Modal.Box>
					<ExclamationTriangleIcon className='h-10 w-10 text-warning' />
					<Modal.Content>
						<Text>Xác nhận ?</Text>
						<Modal.Actions>
							<Button variant='primary' size='sm'>
								Review CV
							</Button>
							<Button variant='success' size='sm'>
								Review biên bản
							</Button>
							<Button variant='info' size='sm'>
								Review báo cáo
							</Button>
						</Modal.Actions>
					</Modal.Content>
				</Modal.Box>
			</Modal>
			<Container>
				<Box>
					<Typography level={5} fontWeight='semibold'>
						Review CV
					</Typography>
					{!!selectedStudents.length && (
						<Button variant='success' onClick={() => setOpen(!open)}>
							<CheckCircleIcon className='h-5 w-5' /> Xác nhận
						</Button>
					)}
				</Box>
				<ReactTable data={tableData} columns={columnsData} loading={isLoading} onGetSelectedRows={setSelectedStudents} />
			</Container>
		</Fragment>
	);
};

const Container = tw.div`flex flex-col gap-6`;
const Box = tw.div`flex justify-between items-center p-2`;
Modal.Box = ({ ...props }) => (
	<div {...props} className='flex items-start gap-6'>
		{props.children}
	</div>
);
Modal.Content = ({ ...props }) => (
	<div {...props} className='flex flex-col gap-3'>
		{props.children}
	</div>
);
Modal.Actions = ({ ...props }) => (
	<div {...props} className='flex items-center justify-end gap-1'>
		{props.children}
	</div>
);

export default ReviewPage;
