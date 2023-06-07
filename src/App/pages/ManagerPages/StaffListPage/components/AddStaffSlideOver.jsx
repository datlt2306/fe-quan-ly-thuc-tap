/* eslint-disable react/prop-types */
import { useAddStaffMutation } from '@/App/providers/apis/staffListApi';
import { staffDataValidator } from '@/App/schemas/staffSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import SlideOver from '@/Core/components/common/SlideOver';
import { PlusIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

const AddStaffSlideOver = ({ onOpenStateChange: handleOpenStateChange, openState, formContext }) => {
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(staffDataValidator),
		context: { users: formContext },
		defaultValue: staffDataValidator.getDefault()
	});

	const [handleAddNewStaff, { isLoading }] = useAddStaffMutation();

	const onAddSubmit = async (data) => {
		const { error } = await handleAddNewStaff({ ...data, role: 1 });
		if (error) {
			handleOpenStateChange(!openState);
			reset();
			toast.error(error?.data?.message);
			return;
		}
		handleOpenStateChange(!openState);
		reset();
		toast.success('Thêm nhân viên thành công!');
	};

	useEffect(() => {
		if (!openState) reset();
	}, [openState]);
	return (
		<SlideOver open={openState} onOpen={handleOpenStateChange} panelTitle={'Thêm nhân viên'}>
			<Form onSubmit={handleSubmit(onAddSubmit)}>
				<InputFieldControl name='name' control={control} label='Tên nhân viên' />
				<InputFieldControl name='email' control={control} label='Email nhân viên' />
				<Button type='submit' variant='primary' size='md' disabled={isLoading} loading={isLoading} icon={PlusIcon}>
					Thêm
				</Button>
			</Form>
		</SlideOver>
	);
};

const Form = tw.form`flex flex-col gap-6`;

export default AddStaffSlideOver;
