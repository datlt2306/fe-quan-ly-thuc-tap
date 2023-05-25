import {
	InternSupportType,
	StudentReviewTypeEnum,
	StudentStatusEnum,
	StudentStatusGroupEnum
} from '@/App/constants/studentConstants';
import { useExportToExcel } from '@/App/hooks/useExcel';
import { useGetStudentsToReviewQuery } from '@/App/providers/apis/studentApi';
import Button from '@/Core/components/common/Button';
import ReactTable from '@/Core/components/common/Table/ReactTable';
import formatDate from '@/Core/utils/formatDate';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { Fragment, useMemo, useState } from 'react';
import tw from 'twin.macro';
import InstanceStudentColumns from '../Shared/InstanceStudentColumns';
import UpdateReviewModal from './components/UpdateReviewModal';

const handleGetInternStatusStyle = (value) => {
	const style = Object.keys(StudentStatusGroupEnum).find((k) => StudentStatusGroupEnum[k].includes(value));
	return style;
};

const ReviewCvPage = () => {
	const {
		data: studentsListData,
		isLoading: isLoadingData,
		isError
	} = useGetStudentsToReviewQuery({ type: StudentReviewTypeEnum.REVIEW_CV });
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
		() =>
			InstanceStudentColumns.filter((column) => {
				const excludeColumns = ['report', 'form'];
				return !excludeColumns.includes(column?.accessor);
			}),
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

	return (
		<Fragment>
			<UpdateReviewModal
				openState={open}
				onOpenStateChange={setOpen}
				selectedStudents={selectedStudents}
				statusOptions={reviewStatusOptions}
			/>
			<Container>
				{!!selectedStudents.length && (
					<Button variant='secondary' size='sm' onClick={() => setOpen(!open)}>
						<ChatBubbleLeftEllipsisIcon className='h-5 w-5' /> Review
					</Button>
				)}

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
