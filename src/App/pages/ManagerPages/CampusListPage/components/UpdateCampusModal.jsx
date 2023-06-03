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

const UpdateCampusModal = ({ campusData, onOpenStateChange, openState, curCampus }) => {
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

	const isCampusDuplicate = (data) => {
		const newCampus = data.name
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd')
			.replace(/Đ/g, 'D');
		const temp = [];
		curCampus.forEach((item) => {
			const campus = item.name
				.toLowerCase()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.replace(/đ/g, 'd')
				.replace(/Đ/g, 'D');

			if (campus.includes(newCampus)) {
				temp.push(item);
			}
		});
		return temp;
	};

	const onUpdateSubmit = async (data) => {
		if (isCampusDuplicate(data).length === 0) {
			try {
				const {
					data: { success, message }
				} = await handleUpdateCampus({ id: campusData._id, payload: data });
				if (success) {
					onOpenStateChange(!openState);
					toast.success('Sửa cơ sở thành công!');
				} else {
					onOpenStateChange(!openState);
					toast.error(message);
				}
			} catch (error) {
				toast.error('Sửa cở sở không thành công!');
			}
		} else {
			onOpenStateChange(!openState);
			toast.error('Cơ sở đã tồn tại !');
		}
	};

	return (
		<Modal openState={openState} onOpenStateChange={onOpenStateChange} title={'Sửa cơ sở'}>
			<Modal.Form onSubmit={handleSubmit(onUpdateSubmit)}>
				<InputFieldControl name='name' control={control} label='Tên cơ sở' />

				<Button type='submit' size='md' variant='primary' disabled={isLoading} loading={isLoading}>
					Cập nhật
				</Button>
			</Modal.Form>
		</Modal>
	);
};

Modal.Form = tw.form`flex flex-col gap-6 w-[320px]`;

export default UpdateCampusModal;
