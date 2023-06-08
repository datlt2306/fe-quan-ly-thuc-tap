import { StudentReviewTypeEnum, StudentStatusEnum } from '@/App/constants/studentConstants';
import { useGetStudentsToReviewQuery } from '@/App/providers/apis/studentApi';
import Button from '@/Core/components/common/Button';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import Typography from '@/Core/components/common/Text/Typography';
import { ArrowPathIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { Fragment, useMemo, useState } from 'react';
import tw from 'twin.macro';
import InstanceStudentColumns from '../Shared/InstanceStudentColumns';
import UpdateReviewModal from './components/UpdateReviewModal';
import classNames from 'classnames';

const ReviewCvPage = () => {
	const {
		data: studentsListData,
		isLoading: isLoadingData,
		isFetching,
		refetch
	} = useGetStudentsToReviewQuery({ type: StudentReviewTypeEnum.REVIEW_CV });
	const [selectedStudents, setSelectedStudents] = useState([]);
	const [open, setOpen] = useState(false);

	const tableData = useMemo(() => studentsListData ?? [], [studentsListData]);

	// Define columns of table
	const columnsData = useMemo(
		() =>
			InstanceStudentColumns.filter((column) => {
				const excludeColumns = ['report', 'form'];
				return !excludeColumns.includes(column?.accessor);
			}),
		[]
	);

	const reviewStatusOptions = useMemo(() => {
		return [
			{ label: StudentStatusEnum[1], value: 1 },
			{ label: StudentStatusEnum[2], value: 2 }
		];
	}, []);

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
					<Typography level={6} className='inline-flex items-center gap-3'>
						Review CV sinh viên
					</Typography>
					<ButtonList>
						{!!selectedStudents.length && (
							<Button
								variant='secondary'
								size='sm'
								onClick={() => setOpen(!open)}
								icon={ChatBubbleLeftEllipsisIcon}>
								Review
							</Button>
						)}
						<Button variant='primary' size='sm' icon={ArrowPathIcon} onClick={refetch} loading={isFetching}>
							Reload
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
const ButtonList = tw.div`flex items-center gap-1`;

export default ReviewCvPage;
