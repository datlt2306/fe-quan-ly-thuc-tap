/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { useAddCampusMutation } from '@/App/providers/apis/campusApi';
import { campusDataValidator } from '@/App/schemas/campusSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import SlideOver from '@/Core/components/common/SlideOver';
import HttpStatusCode from '@/Core/constants/httpStatus';
import { PlusIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

const AddCampusSlideOver = ({ onOpen: handleOpenStateChange, open, curCampus }) => {
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(campusDataValidator),
		defaultValue: campusDataValidator.getDefault()
	});

	const [handleAddNewCampus, { isLoading }] = useAddCampusMutation();

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

	const onAddSubmit = async (data) => {
		try {
			if (isDuplicatedCampus(data)) {
				toast.warn('Cơ sở đã tồn tại !');
				return;
			}
			const { error } = await handleAddNewCampus(data);
			if (error) {
				handleOpenStateChange(!open);
				reset();
				if (error.status === HttpStatusCode.CONFLICT) {
					toast.warn('Cơ sở đã tồn tại !');
					return;
				}
				throw new Error('Thêm cơ sở không thành công!');
			}
			handleOpenStateChange(!open);
			reset();
			toast.success('Thêm cơ sở thành công!');
		} catch (error) {
			toast.error(error.message);
		}
	};

	useEffect(() => {
		if (!open) reset();
	}, [open]);
	return (
		<SlideOver open={open} onOpen={handleOpenStateChange} panelTitle={'Thêm cơ sở'}>
			<Form onSubmit={handleSubmit(onAddSubmit)}>
				<InputFieldControl name='name' control={control} label='Tên cơ sở' placeholder='Cơ sở X ...' />

				<Button type='submit' variant='primary' size='md' disabled={isLoading} loading={isLoading} icon={PlusIcon}>
					Thêm
				</Button>
			</Form>
		</SlideOver>
	);
};

const Form = tw.form`flex flex-col gap-6`;

export default AddCampusSlideOver;
