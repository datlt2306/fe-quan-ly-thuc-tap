import { useUpdateReviewMutation } from '@/App/store/apis/student.api';
import { reviewSchema } from '@/App/schemas/student.schema';
import Button from '@/Core/components/common/Button';
import SelectFieldControl from '@/Core/components/common/FormControl/SelectFieldControl';
import TextareaFieldControl from '@/Core/components/common/FormControl/TextareaFieldControl';
import Modal from '@/Core/components/common/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

const UpdateReviewModal = ({
	openState,
	onOpenStateChange: handleOpenStateChange,
	selectedStudents,
	statusOptions
}) => {
	const [updateStatus, { isLoading, isSuccess }] = useUpdateReviewMutation();
	const { email: reviewerEmail } = useSelector((state) => state.auth?.user);
	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(reviewSchema)
	});

	useEffect(() => {
		reset();
	}, [openState]);

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
				reviewerEmail
			};

			const { error } = await updateStatus(data);
			if (error) {
				toast.error('Đã xảy ra lỗi !');
				handleOpenStateChange(!openState);
				return;
			}
			handleOpenStateChange(!openState);
			toast.success('Xác nhận review thành công !');
		} catch (error) {
			toast.error(error.message);
		}
	};

	return (
		<Modal openState={openState} onOpenStateChange={handleOpenStateChange} title='Cập nhật trạng thái sinh viên'>
			<Modal.Form onSubmit={handleSubmit(handleReview)}>
				<SelectFieldControl control={control} name='status' options={statusOptions} label='Trạng thái' />
				<TextareaFieldControl
					control={control}
					name='textNote'
					resizable={false}
					rows={3}
					label='Ghi chú'
					placeholder='Ghi chú cho sinh viên ...'
				/>
				<Button type='submit' variant='primary' size='md' disabled={isLoading} loading={isLoading}>
					Xác nhận
				</Button>
			</Modal.Form>
		</Modal>
	);
};

Modal.Form = tw.form`flex min-w-[384px] flex-col items-stretch gap-6`;
Modal.Actions = tw.div`flex items-center justify-end gap-1`;

export default UpdateReviewModal;
