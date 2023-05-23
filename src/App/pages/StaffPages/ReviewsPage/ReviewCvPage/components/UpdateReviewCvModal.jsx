import { StudentStatusEnum } from '@/App/constants/studentStatus';
import { useUpdateReviewCvMutation } from '@/App/providers/apis/studentApi';
import { updateReviewCvData } from '@/App/schemas/studentSchema';
import Button from '@/Core/components/common/Button';
import SelectFieldControl from '@/Core/components/common/FormControl/SelectFieldControl';
import TextareaFieldControl from '@/Core/components/common/FormControl/TextareaFieldControl';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import Modal from '@/Core/components/common/Modal';
import Text from '@/Core/components/common/Text/Text';
import { StaffPaths } from '@/Core/constants/routePaths';
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import React, { useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateReviewCvModal = ({ openState, onOpenStateChange: handleOpenStateChange, selectedStudents }) => {
	const [updateReviewCV, { isLoading, isSuccess }] = useUpdateReviewCvMutation();
	const { email: reviewerEmail } = useSelector((state) => state.auth?.user);
	const toastId = useRef(null);
	const { control, handleSubmit } = useForm();
	const navigate = useNavigate();

	const reviewStatusOptions = useMemo(() => {
		const studentStatusMap = new Map();
		Object.keys(StudentStatusEnum).forEach((key) => studentStatusMap.set(key, StudentStatusEnum[key]));
		return [
			{ label: studentStatusMap.get('1'), value: 1 },
			{ label: studentStatusMap.get('2'), value: 2 }
		];
	}, []);

	const handleUpdateReviewCV = async (data) => {
		try {
			const listIdStudent = selectedStudents.map((student) => student._id);
			const listEmailStudent = selectedStudents.map((student) => student.email);
			data = { ...data, listIdStudent, listEmailStudent };
			toastId.current = toast.loading('Đang cập nhật ...');
			const { error } = updateReviewCV(data);
			if (error) {
				toast.update(toastId.current, {
					type: 'error',
					render: 'Đã xảy ra lỗi !',
					isLoading: false,
					closeButton: true,
					autoClose: 2000
				});
				handleOpenStateChange(!openState);
				return;
			}
			handleOpenStateChange(!openState);
			toast.update(toastId.current, {
				type: 'success',
				render: 'Xác nhận review CV thành công !',
				isLoading: false,
				closeButton: true,
				autoClose: 2000
			});
			navigate(StaffPaths.STUDENT_LIST);
		} catch (error) {
			handleOpenStateChange(!openState);
			toast.update(toastId.current, {
				type: 'error',
				render: error.message,
				isLoading: false,
				closeButton: true,
				autoClose: 2000
			});
		}
	};

	return (
		<Modal openState={openState} onOpenStateChange={handleOpenStateChange} title='Cập nhật trạng thái sinh viên'>
			<Modal.Form onSubmit={handleSubmit(handleUpdateReviewCV)}>
				<Text className='inline-flex items-start gap-2 whitespace-normal align-middle'>
					<InformationCircleIcon className='aspect-square w-5 text-info' /> Xác nhận review các CV của sinh viên đã
					chọn.
				</Text>
				<SelectFieldControl control={control} name='status' options={reviewStatusOptions} label='Trạng thái' />
				<TextareaFieldControl
					control={control}
					name='textNote'
					resizable={false}
					rows={3}
					label='Ghi chú'
					placeholder='Ghi chú cho sinh viên ...'
				/>
				<Button type='submit' variant='primary' size='md'>
					{isLoading && <LoadingSpinner size='sm' />}
					{isSuccess && <CheckCircleIcon className='h-4 w-4' />}
					Review CV
				</Button>
			</Modal.Form>
		</Modal>
	);
};

Modal.Form = ({ ...props }) => (
	<form {...props} className='flex flex-col items-stretch gap-6'>
		{props.children}
	</form>
);
Modal.Actions = ({ ...props }) => (
	<div {...props} className='flex items-center justify-end gap-1'>
		{props.children}
	</div>
);

export default UpdateReviewCvModal;
