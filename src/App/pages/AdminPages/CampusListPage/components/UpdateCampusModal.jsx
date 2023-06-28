/* eslint-disable react/prop-types */
import { useUpdateCampusMutation } from '@/App/store/apis/campusApi';
import { campusDataValidator } from '@/App/schemas/campusSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import Modal from '@/Core/components/common/Modal';
import HttpStatusCode from '@/Core/constants/httpStatus';
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

	const isDuplicatedCampus = (data) => {
		const newCampus = data.name
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/đ/g, 'd')
			.replace(/Đ/g, 'D');
		return curCampus
			.map((item) =>
				item.name
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/đ/g, 'd')
					.replace(/Đ/g, 'D')
			)
			.includes(newCampus);
	};

	const onUpdateSubmit = async (data) => {
		try {
			if (isDuplicatedCampus(data)) {
				toast.warn('Cơ sở đã tồn tại !');
				return;
			}
			const { error } = await handleUpdateCampus({ id: campusData._id, payload: data });
			if (error) {
				if (error.status === HttpStatusCode.CONFLICT) {
					toast.warn('Cơ sở đã tồn tại !');
					return;
				}
				throw new Error('Thêm cơ sở không thành công!');
			}

			onOpenStateChange(!openState);
			toast.success('Cập nhật cơ sở thành công!');
		} catch (error) {
			toast.error(error.message);
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

Modal.Form = tw.form`flex flex-col gap-6 min-w-[384px]`;

export default UpdateCampusModal;
