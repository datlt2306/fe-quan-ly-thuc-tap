/* eslint-disable react/prop-types */
import { useUpdateMajorMutation } from '@/App/store/apis/majorApi';
import { majorSchema } from '@/App/schemas/majorSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import Modal from '@/Core/components/common/Modal';
import capitalizeString from '@/Core/utils/capitalizeString';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

const UpdateMajorSlideOver = ({ major, onOpenStateChange: handleOpenStateChange, open, title, majors }) => {
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
			reset();
			handleOpenStateChange();
			return;
		}
		const result = await handleUpdateMajor({ data: { name, majorCode }, id: major?._id });
		if (result?.error) {
			handleOpenStateChange();
			reset();
			toast.error('Sửa chuyên ngành không thành công!');
			return;
		}
		handleOpenStateChange();
		reset();
		toast.success('Sửa chuyên ngành thành công!');
	};

	return (
		<Modal openState={open} onOpenStateChange={handleOpenStateChange} title={title}>
			<Modal.Form onSubmit={handleSubmit(onUpdateSubmit)}>
				<InputFieldControl name='name' control={control} label='Tên chuyên ngành' />
				<InputFieldControl name='majorCode' control={control} label='Mã chuyên ngành' />
				<Button type='submit' variant='primary' size='md' disabled={isLoading} loading={isLoading}>
					Sửa
				</Button>
			</Modal.Form>
		</Modal>
	);
};

Modal.Form = tw.form`flex flex-col gap-6 min-w-[320px] max-w-full`;

export default UpdateMajorSlideOver;
