/* eslint-disable react/prop-types */
import { useUpdateMajorMutation } from '@/App/providers/apis/majorApi';
import { majorSchema } from '@/App/schemas/majorSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import SlideOver from '@/Core/components/common/SlideOver';
import capitalizeString from '@/Core/utils/capitalizeString';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

const UpdateMajorSlideOver = ({ major, onOpen, open, panelTitle, majors }) => {
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(majorSchema),
		values: {
			name: major?.name,
			majorCode: major?.majorCode
		}
	});
	const [handleUpdateMajor, { isLoading }] = useUpdateMajorMutation();

	const onUpdateSubmit = async (data) => {
		const majorCode = data?.majorCode.toUpperCase();
		const name = capitalizeString(data?.name);

		const checkMajorsDuplicate = majors?.some(
			(item) =>
				(item._id !== major._id && item.majorCode === majorCode) || (item._id !== major._id && item.name == name)
		);
		if (checkMajorsDuplicate) {
			toast.error('Mã và Tên chuyên ngành không được trùng với dữ liệu đã có');
			onOpen();
			return;
		}
		const result = await handleUpdateMajor({ data: { name, majorCode }, id: major?._id });
		if (result?.error) {
			onOpen();
			toast.error('Sửa chuyên ngành không thành công!');
			return;
		}
		onOpen();
		reset();
		toast.success('Sửa chuyên ngành thành công!');
	};

	return (
		<SlideOver open={open} onOpen={onOpen} panelTitle={panelTitle}>
			<Form onSubmit={handleSubmit(onUpdateSubmit)}>
				<InputFieldControl name='name' control={control} label='Tên chuyên ngành' />
				<InputFieldControl name='majorCode' control={control} label='Mã chuyên ngành' />
				<Button type='submit' size='md' variant={isLoading ? 'disabled' : 'primary'}>
					Sửa
				</Button>
			</Form>
		</SlideOver>
	);
};

const Form = tw.form`flex flex-col gap-6`;

export default UpdateMajorSlideOver;
