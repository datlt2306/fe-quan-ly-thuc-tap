/* eslint-disable react/prop-types */
import { useGetAllCampusQuery } from '@/App/providers/apis/campusApi';
import { useAddManagerMutation } from '@/App/providers/apis/staffListApi';
import { managerDataValidator } from '@/App/schemas/staffSchema';
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

const AddManagerSlideOver = ({ onOpen, open }) => {
	const { data: campus, isLoading: campusLoading } = useGetAllCampusQuery();
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(managerDataValidator),
		defaultValue: managerDataValidator.getDefault()
	});

	const [handleAddNewManager, { isLoading }] = useAddManagerMutation();

	const onAddSubmit = async (data) => {
		const { error } = await handleAddNewManager(data);
		if (error) {
			onOpen(!open);
			reset();
			toast.error(error?.data?.message);
			return;
		}
		onOpen(!open);
		reset();
		toast.success('Thêm quản lý thành công!');
	};

	useEffect(() => {
		if (!open) reset();
	}, [open]);
	return (
		<SlideOver open={open} onOpen={onOpen} panelTitle={'Thêm quản lý'}>
			<Form onSubmit={handleSubmit(onAddSubmit)}>
				<InputFieldControl name='name' control={control} label='Tên quản lý' />
				<InputFieldControl name='email' control={control} label='Email quản lý' />
				<SelectFieldControl
					label='Chọn cơ sở'
					control={control}
					name='campus_id'
					options={campus?.listCampus.map((item) => ({
						label: item.name,
						value: item._id
					}))}
				/>
				<Button type='submit' variant='primary' size='md' disabled={isLoading}>
					{isLoading && <LoadingSpinner size='sm' variant='primary' />}
					Thêm
				</Button>
			</Form>
		</SlideOver>
	);
};

const Form = tw.form`flex flex-col gap-6`;

export default AddManagerSlideOver;
