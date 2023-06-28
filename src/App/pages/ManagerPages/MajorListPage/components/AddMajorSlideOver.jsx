/* eslint-disable react/prop-types */
import { useCreateMajorMutation } from '@/App/store/apis/majorApi';
import { majorSchema } from '@/App/schemas/majorSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import SlideOver from '@/Core/components/common/SlideOver';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import capitalizeString from '@/Core/utils/capitalizeString';
const AddMajorSlideOver = ({ onOpen, open, panelTitle, majors }) => {
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(majorSchema),
		values: majorSchema.getDefault()
	});

	const [handleAddNewMajor, { isLoading }] = useCreateMajorMutation();

	const onAddSubmit = async (data) => {
		const name = capitalizeString(data?.name);
		const checkDuplicate = majors?.some((item) => item.majorCode == data.majorCode || item.name == name);

		if (checkDuplicate) {
			toast.error('Mã và Tên chuyên ngành không được trùng với dữ liệu đã có');
			reset();
			onOpen();
			return;
		}
		const result = await handleAddNewMajor({
			name,
			majorCode: data?.majorCode.toUpperCase()
		});
		if (result?.error) {
			onOpen();
			reset();
			toast.error('Thêm chuyên ngành không thành công!');
			return;
		}
		onOpen();
		reset();
		toast.success('Thêm chuyên ngành thành công!');
	};

	return (
		<SlideOver open={open} onOpen={onOpen} panelTitle={panelTitle}>
			<Form onSubmit={handleSubmit(onAddSubmit)}>
				<InputFieldControl name='name' control={control} label='Tên chuyên ngành' />
				<InputFieldControl name='majorCode' control={control} label='Mã chuyên ngành' />

				<Button type='submit' variant='primary' size='md' disabled={isLoading} loading={isLoading}>
					Thêm
				</Button>
			</Form>
		</SlideOver>
	);
};

const Form = tw.form`flex flex-col gap-6`;

export default AddMajorSlideOver;
