import { useUpdateStaffMutation } from '@/App/store/apis/staff-list.api';
import { staffDataValidator } from '@/App/schemas/staff.schema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import Modal from '@/Core/components/common/Modal';
import HttpStatusCode from '@/Core/constants/httpStatus';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

const UpdateStaffModal = ({ userData, onOpenStateChange, openState, users }) => {
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(staffDataValidator),
		context: { users, userData },
		defaultValues: userData
	});

	useEffect(() => {
		if (!openState) reset();
		if (userData) {
			reset({
				name: userData?.name,
				email: userData?.email
			});
		}
	}, [userData, openState]);

	const [handleUpdateStaff, { isLoading }] = useUpdateStaffMutation();

	const onUpdateSubmit = async (data) => {
		try {
			const { error } = await handleUpdateStaff({ id: userData._id, payload: data });
			if (error) {
				onOpenStateChange(!openState);
				reset();
				if (error?.status === HttpStatusCode.BAD_REQUEST) toast.error('Dữ liệu tải lên không hợp lệ !');
				else toast.error('Đã có lỗi xảy ra !');
				return;
			}
			onOpenStateChange(!openState);
			reset();
			toast.success('Sửa nhân viên thành công !');
		} catch (error) {
			toast.error('Đã có lỗi xảy ra !');
		}
	};

	return (
		<Modal openState={openState} onOpenStateChange={onOpenStateChange} title={'Sửa nhân viên'}>
			<Modal.Form onSubmit={handleSubmit(onUpdateSubmit)}>
				<InputFieldControl name='name' control={control} label='Tên nhân viên' />
				<InputFieldControl name='email' control={control} label='Email nhân viên' />
				<Button type='submit' size='md' variant='primary' disabled={isLoading} loading={isLoading}>
					Cập nhật
				</Button>
			</Modal.Form>
		</Modal>
	);
};

Modal.Form = tw.form`flex flex-col gap-6 min-w-[384px] max-w-full items-stretch`;

export default UpdateStaffModal;
