import { useUpdateReviewMutation } from '@/App/providers/apis/studentApi';
import Button from '@/Core/components/common/Button';
import SelectFieldControl from '@/Core/components/common/FormControl/SelectFieldControl';
import TextareaFieldControl from '@/Core/components/common/FormControl/TextareaFieldControl';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import Modal from '@/Core/components/common/Modal';
import { StaffPaths } from '@/Core/constants/routePaths';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateReviewModal = ({
	openState,
	onOpenStateChange: handleOpenStateChange,
	selectedStudents,
	statusOptions
}) => {
	const [updateStatus, { isLoading, isSuccess }] = useUpdateReviewMutation();
	const { email: reviewerEmail } = useSelector((state) => state.auth?.user);
	const toastId = useRef(null);
	const { control, handleSubmit } = useForm();
	const navigate = useNavigate();
	const handleReview = async (data) => {
		try {
			if (!selectedStudents.length) {
				toast.error('Chưa có sinh viên nào được chọn !');
				return;
			}

			const listIdStudent = selectedStudents.map((student) => student._id);
			const listEmailStudent = selectedStudents.map((student) => student.email);
			data = {
				...data,
				listIdStudent,
				listEmailStudent,
				reviewerEmail,
				status: data.status.toString()
			};

			toastId.current = toast.loading('Đang cập nhật ...');

			const { error } = updateStatus(data);
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
			<Modal.Form onSubmit={handleSubmit(handleReview)}>
				<SelectFieldControl
					control={control}
					name='status'
					options={statusOptions}
					label='Trạng thái'
					rules={[{ required: { value: true, message: 'Vui lòng chọn trạng thái cập nhật cho sinh viên' } }]}
				/>
				<TextareaFieldControl
					control={control}
					name='textNote'
					resizable={false}
					rows={3}
					label='Ghi chú'
					placeholder='Ghi chú cho sinh viên ...'
				/>
				<Button type='submit' variant='primary' size='md' disabled={isLoading}>
					{isLoading && <LoadingSpinner size='sm' />}
					{isSuccess && <CheckCircleIcon className='h-4 w-4' />}
					Review CV
				</Button>
			</Modal.Form>
		</Modal>
	);
};

Modal.Form = ({ ...props }) => (
	<form {...props} className='flex w-[320px] flex-col items-stretch gap-6'>
		{props.children}
	</form>
);
Modal.Actions = ({ ...props }) => (
	<div {...props} className='flex items-center justify-end gap-1'>
		{props.children}
	</div>
);

export default UpdateReviewModal;
