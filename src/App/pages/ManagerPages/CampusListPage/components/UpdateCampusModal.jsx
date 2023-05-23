/* eslint-disable react/prop-types */
import { useUpdateCampusMutation } from '@/App/providers/apis/campusApi';
import { campusDataValidator } from '@/App/schemas/campusSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import Modal from '@/Core/components/common/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
const UpdateCampusModal = ({ campusData, onOpenStateChange, openState }) => {
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(campusDataValidator),
		defaultValues: campusData
	});

	useEffect(() => {
		if (campusData) {
			reset({
				name: campusData?.name
			});
		}
	}, [campusData]);

	const [handleUpdateCampus, { isLoading }] = useUpdateCampusMutation();

	const onUpdateSubmit = async (data) => {
		const { error } = await handleUpdateCampus({ id: campusData._id, payload: data });
		if (error) {
			toast.error('Sửa cở sở không thành công!');
			return;
		}
		onOpenStateChange(!openState);
		toast.success('Sửa cơ sở thành công!');
	};

	return (
		<Modal openState={openState} onOpenStateChange={onOpenStateChange} title={'Sửa cơ sở'}>
			<Form onSubmit={handleSubmit(onUpdateSubmit)}>
				<InputFieldControl name='name' control={control} label='Tên cơ sở' />

				<Button type='submit' size='md' variant='primary' disabled={isLoading}>
					{isLoading && <LoadingSpinner size='sm' variant='primary' />}
					Cập nhật
				</Button>
			</Form>
		</Modal>
	);
};

const Form = tw.form`flex flex-col gap-6`;

export default UpdateCampusModal;
