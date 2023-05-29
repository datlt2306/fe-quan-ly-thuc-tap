/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import SlideOver from '@/Core/components/common/SlideOver';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import { campusDataValidator } from '@/App/schemas/campusSchema';
import { useAddCampusMutation } from '@/App/providers/apis/campusApi';

const AddCampusSlideOver = ({ onOpen, open, curCampus }) => {
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(campusDataValidator),
		defaultValue: campusDataValidator.getDefault()
	});

	const [handleAddNewCampus, { isLoading }] = useAddCampusMutation();

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

	const onAddSubmit = async (data) => {
		if (isCampusDuplicate(data).length === 0) {
			try {
				const {
					data: { success, message }
				} = await handleAddNewCampus(data);

				if (success) {
					onOpen(!open);
					reset();
					toast.success('Thêm cơ sở thành công!');
				} else {
					onOpen(!open);
					reset();
					toast.error(message);
				}
			} catch (error) {
				toast.error('Thêm cơ sở không thành công!');
			}
		} else {
			onOpen(!open);
			reset();
			toast.error('Cơ sở đã tồn tại !');
		}
	};

	useEffect(() => {
		if (!open) reset();
	}, [open]);
	return (
		<SlideOver open={open} onOpen={onOpen} panelTitle={'Thêm cơ sở'}>
			<Form onSubmit={handleSubmit(onAddSubmit)}>
				<InputFieldControl name='name' control={control} label='Tên cơ sở' />

				<Button type='submit' variant='primary' size='md' disabled={isLoading}>
					{isLoading && <LoadingSpinner size='sm' variant='primary' />}
					Thêm
				</Button>
			</Form>
		</SlideOver>
	);
};

const Form = tw.form`flex flex-col gap-6`;

export default AddCampusSlideOver;
