import { InternSupportType, StudentReviewTypeEnum, StudentStatusEnum } from '@/App/constants/studentConstants';
import { useGetStudentsToReviewQuery } from '@/App/providers/apis/studentApi';
import formatDate from '@/Core/utils/formatDate';
import React, { Fragment, useMemo, useState } from 'react';
import InstanceStudentColumns from '../Shared/InstanceStudentColumns';
import UpdateReviewModal from './components/UpdateReviewModal';
import tw from 'twin.macro';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import Button from '@/Core/components/common/Button';
import Typography from '@/Core/components/common/Text/Typography';

const ReviewRecordPage = () => {
	const {
		data: studentsListData,
		isLoading: isLoadingData,
		isError
	} = useGetStudentsToReviewQuery({ type: StudentReviewTypeEnum.REVIEW_RECORD });
	const [selectedStudents, setSelectedStudents] = useState([]);
	const [open, setOpen] = useState(false);

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
		() =>
			InstanceStudentColumns.filter((column) => {
				const excludeColumns = ['CV', 'report'];
				return !excludeColumns.includes(column?.accessor);
			}),
		[]
	);

	const reviewStatusOptions = useMemo(() => {
		return [
			{ label: StudentStatusEnum[5], value: 5 },
			{ label: StudentStatusEnum[6], value: 6 }
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
					<Typography level={6}>Review biên bản sinh viên</Typography>
					{!!selectedStudents.length && (
						<Button variant='secondary' size='md' className='w-auto' onClick={() => setOpen(!open)}>
							<ChatBubbleLeftEllipsisIcon className='h-5 w-5' /> Review
						</Button>
					)}
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

export default ReviewRecordPage;
