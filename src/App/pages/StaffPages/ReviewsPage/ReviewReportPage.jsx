import { InternSupportType, StudentColumnAccessors, StudentStatusEnum } from '@/App/constants/studentConstants';
import { useGetStudentsQuery } from '@/App/providers/apis/studentApi';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { InputColumnFilter, SelectColumnFilter } from '@/Core/components/common/Table/ReactTableFilters';
import Typography from '@/Core/components/common/Text/Typography';
import formatDate from '@/Core/utils/formatDate';
import { useMemo, useRef, useState } from 'react';
import tw from 'twin.macro';

const ReviewReportPage = () => {
	const [currentSemester, setCurrentSemester] = useState();
	const toastId = useRef(null);
	const { data: studentsListData, isLoading } = useGetStudentsQuery({ semester: currentSemester });

	const tableData = useMemo(() => {
		return Array.isArray(studentsListData)
			? studentsListData
					.map((student, index) => ({
						...student,
						index: index + 1,
						createdAt: formatDate(student.createdAt),
						statusCheck: StudentStatusEnum[student.statusCheck],
						support: InternSupportType[student.support],
						statusStudent: student.statusStudent.trim()
					}))
					.filter((student) => !!student.report)
			: [];
	}, [studentsListData, currentSemester]);
	// Define columns of table
	const columnsData = useMemo(
		() => [
			{
				Header: StudentColumnAccessors.index,
				accessor: 'index',
				sortable: true
			},
			{
				Header: StudentColumnAccessors.name,
				accessor: 'name',
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true
			},
			{
				Header: StudentColumnAccessors.mssv,
				accessor: 'mssv', // object key
				Filter: InputColumnFilter,
				filterable: true,
				sortable: true,
				Cell: ({ value }) => <span className='font-semibold uppercase'>{value}</span>
			},
			{
				Header: StudentColumnAccessors.majorCode,
				accessor: 'majorCode',
				Filter: SelectColumnFilter,
				filterable: true,
				sortable: true
			},
			{
				Header: StudentColumnAccessors.phoneNumber,
				accessor: 'phoneNumber',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: StudentColumnAccessors.email,
				accessor: 'email',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: StudentColumnAccessors.support,
				accessor: 'support',
				Filter: SelectColumnFilter,
				filterable: true
			},
			{
				Header: StudentColumnAccessors.statusCheck,
				accessor: 'statusCheck',
				Filter: SelectColumnFilter,
				filterable: true,
				Cell: ({ value }) => <Badge variant={handleGetInternStatusStyle(value)}>{value}</Badge>
			},

			{
				Header: StudentColumnAccessors.nameCompany,
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
				Header: StudentColumnAccessors.dream,
				accessor: 'dream',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: StudentColumnAccessors.CV,
				accessor: 'CV',
				Filter: InputColumnFilter,
				filterable: false,
				sortable: false,
				Cell: ({ value }) => (
					<Button
						as='a'
						href={value}
						className='p-1'
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
				Header: StudentColumnAccessors.report,
				accessor: 'report',
				Cell: ({ value }) => !!value && <Badge variant='info'>Đã nộp</Badge>
			},

			{
				Header: StudentColumnAccessors.reviewer,
				accessor: 'reviewer',
				Filter: InputColumnFilter,
				filterable: true
			},
			{
				Header: StudentColumnAccessors.statusStudent,
				accessor: 'statusStudent',
				Filter: SelectColumnFilter,
				filterable: true,
				Cell: ({ value }) => <span className='font-semibold'>{value}</span>
			},

			{
				Header: StudentColumnAccessors.createdAt,
				accessor: 'createdAt',
				Filter: InputColumnFilter,
				filterable: true,
				Cell: ({ value }) => <span>{formatDate(value)}</span>
			},
			{
				Header: StudentColumnAccessors.note,
				accessor: 'note',
				filterable: false,
				sortable: false
			}
		],
		[]
	);
	return (
		<Container>
			<Box>
				<Typography level={6}>Review báo cáo</Typography>
			</Box>
			<ReactTable columns={columnsData} data={tableData} loading={isLoading} />;
		</Container>
	);
};

const Container = tw.div`flex flex-col gap-6`;
const Box = tw.div`flex items-center p-4`;

export default ReviewReportPage;
