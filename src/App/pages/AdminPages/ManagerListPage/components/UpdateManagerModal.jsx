import { useGetAllCampusQuery } from '@/App/store/apis/campus.api';
import { useUpdateManagerMutation, useUpdateStaffMutation } from '@/App/store/apis/staff-list.api';
import { managerDataValidator } from '@/App/schemas/staff.schema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import SelectFieldControl from '@/Core/components/common/FormControl/SelectFieldControl';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import Modal from '@/Core/components/common/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

const UpdateManagerModal = ({ userData, onOpenStateChange, openState, users }) => {
	const campusList = useSelector((state) => state.campus?.campusList);
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(managerDataValidator),
		defaultValues: userData
	});

	useEffect(() => {
		if (userData) {
			reset({
				name: userData?.name,
				email: userData?.email,
				campus_id: userData?.campus_id?._id
			});
		}
	}, [userData]);

	const [handleUpdateManager, { isLoading }] = useUpdateManagerMutation();

	const onUpdateSubmit = async (data) => {
		const checkManager = users.data.some((user) => user.email === data.email && user._id !== userData._id);
		if (checkManager) {
			onOpenStateChange(!openState);
			reset();
			toast.error('Email quản lý không được trùng');
			return;
		}
		const { error } = await handleUpdateManager({ id: userData._id, payload: data });
		if (error) {
			onOpenStateChange(!openState);
			reset();
			toast.error(error?.data?.message);
			return;
		}
		onOpenStateChange(!openState);
		reset();
		toast.success('Sửa quản lý thành công!');
	};

	return (
		<Modal openState={openState} onOpenStateChange={onOpenStateChange} title={'Sửa quản lý'}>
			<Form onSubmit={handleSubmit(onUpdateSubmit)}>
				<InputFieldControl name='name' control={control} label='Tên quản lý' />
				<InputFieldControl name='email' control={control} label='Email quản lý' />
				<SelectFieldControl
					label='Chọn cơ sở'
					control={control}
					name='campus_id'
					options={campusList.map((item) => ({
						label: item.name,
						value: item._id
					}))}
				/>
				<Button type='submit' size='md' variant='primary' disabled={isLoading}>
					{isLoading && <LoadingSpinner size='sm' variant='primary' />}
					Cập nhật
				</Button>
			</Form>
		</Modal>
	);
};

const Form = tw.form`flex flex-col gap-6 min-w-[320px] max-w-full items-stretch`;

export default UpdateManagerModal;
