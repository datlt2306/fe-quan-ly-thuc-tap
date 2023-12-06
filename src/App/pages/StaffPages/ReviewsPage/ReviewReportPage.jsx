import { StudentColumnAccessors, StudentReviewTypeEnum, StudentStatusEnum } from '@/App/constants/studentConstants';
import { useGetStudentsToReviewQuery, useUpdateStudentMutation } from '@/App/store/apis/student.api';
import { studentScoreSchema } from '@/App/schemas/student.schema';
import Button from '@/Core/components/common/Button';
import EditableCell from '@/Core/components/common/Table/components/EditableCell';
import DataTable from '@/Core/components/common/Table/DataTable';
import Typography from '@/Core/components/common/Text/Typography';
import { ArrowPathIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { Fragment, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import InstanceStudentColumns from '../Shared/InstanceStudentColumns';
import UpdateReviewModal from './components/UpdateReviewModal';

const ReviewReportPage = () => {
	const {
		data: studentsListData,
		isLoading: isLoadingData,
		isFetching,
		refetch
	} = useGetStudentsToReviewQuery({ type: StudentReviewTypeEnum.REVIEW_REPORT });
	const [selectedStudents, setSelectedStudents] = useState([]);
	const [open, setOpen] = useState(false);
	const [handleUpdate, { isLoading }] = useUpdateStudentMutation();
	const tableData = useMemo(() => studentsListData ?? [], [studentsListData]);

	// Define columns of table
	const columnsData = useMemo(
		() =>
			InstanceStudentColumns.filter((column) => {
				const excludeColumns = ['CV', 'form'];
				return !excludeColumns.includes(column?.accessor);
			}).concat([
				{
					Header: StudentColumnAccessors.attitudePoint,
					accessor: 'attitudePoint',
					sortable: true,
					Cell: ({ row, column, value }) => {
						return (
							<EditableCell
								value={value}
								row={row}
								column={column}
								original={row?.original}
								onConfirmChange={handleUpdateStudentScore}
							/>
						);
					}
				},
				{
					Header: StudentColumnAccessors.resultScore,
					accessor: 'resultScore',
					sortable: true,
					Cell: ({ row, column, value }) => (
						<EditableCell
							value={value}
							row={row}
							column={column}
							original={row?.original}
							onConfirmChange={handleUpdateStudentScore}
						/>
					)
				}
			]),
		[]
	);

	const reviewStatusOptions = useMemo(() => {
		return [
			{ label: StudentStatusEnum[8], value: 8 },
			{ label: StudentStatusEnum[9], value: 9 }
		];
	}, []);

	const handleUpdateStudentScore = async (field, value, student) => {
		try {
			const requestBody = { [field]: value };
			const data = await studentScoreSchema(field).validate(requestBody);
			const { error } = handleUpdate({ id: student._id, payload: data });
			if (error) {
				toast.error('Đã xảy ra lỗi');
				return;
			}
			toast.success('Đã cập nhật điểm của sinh viên');
		} catch (error) {
			toast.error(error.message);
			return;
		}
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
					<Typography level={6}>Review báo cáo sinh viên</Typography>

					{!!selectedStudents.length && (
						<Button
							variant='secondary'
							size='sm'
							onClick={() => setOpen(!open)}
							icon={ChatBubbleLeftEllipsisIcon}>
							Review
						</Button>
					)}
				</Box>

				<DataTable
					data={tableData}
					columns={columnsData}
					loading={isLoadingData || isFetching}
					stickyColumn
					onHandleRefetch={refetch}
					onGetSelectedRows={setSelectedStudents}
					// onUpdateData={updateTableData}
					// skipPageReset={skipResetPage}
				/>
			</Container>
		</Fragment>
	);
};

const Container = tw.div`flex flex-col gap-6`;
const Box = tw.div`flex justify-between items-center py-4 h-[3rem]`;

export default ReviewReportPage;
