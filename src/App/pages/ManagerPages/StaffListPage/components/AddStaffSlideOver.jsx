/* eslint-disable react/prop-types */
import { RoleStaffEnum } from '@/App/constants/userRoles';
import { useAddStaffMutation } from '@/App/providers/apis/staffListApi';
import { staffDataValidator } from '@/App/schemas/staffSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import SelectFieldControl from '@/Core/components/common/FormControl/SelectFieldControl';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import SlideOver from '@/Core/components/common/SlideOver';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

const AddStaffSlideOver = ({ onOpen, open }) => {
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(staffDataValidator),
		defaultValue: staffDataValidator.getDefault()
	});

	const [handleAddNewStaff, { isLoading }] = useAddStaffMutation();

	const onAddSubmit = async (data) => {
		const { error } = await handleAddNewStaff(data);
		if (error) {
			onOpen(!open);
			reset();
			toast.error(error?.data?.message);
			return;
		}
		onOpen(!open);
		reset();
		toast.success('Thêm nhân viên thành công!');
	};

	useEffect(() => {
		if (!open) reset();
	}, [open]);
	return (
		<SlideOver open={open} onOpen={onOpen} panelTitle={'Thêm nhân viên'}>
			<Form onSubmit={handleSubmit(onAddSubmit)}>
				<InputFieldControl name='name' control={control} label='Tên nhân viên' />
				<InputFieldControl name='email' control={control} label='Email nhân viên' />
				<SelectFieldControl
					label='Quyền hạn nhân viên'
					control={control}
					name='role'
					options={Object.keys(RoleStaffEnum).map((role) => ({
						label: RoleStaffEnum[role],
						value: role.toString()
					}))}
				/>
				<Button type='submit' variant={isLoading ? 'disabled' : 'primary'} size='md'>
					{isLoading && <LoadingSpinner size='sm' variant='primary' />}
					Thêm
				</Button>
			</Form>
		</SlideOver>
	);
};

const Form = tw.form`flex flex-col gap-6`;

export default AddStaffSlideOver;
