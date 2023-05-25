/* eslint-disable react/prop-types */
import { useUpdateNarrowMutation } from '@/App/providers/apis/narrowSpecializationApi';
import { narrowSpecializationSchema } from '@/App/schemas/narrowSpecializationSchema';

import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import SelectFieldControl from '@/Core/components/common/FormControl/SelectFieldControl';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import SlideOver from '@/Core/components/common/SlideOver';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

const UpdateNarrowSlideOver = ({ narrow, onOpen, open, panelTitle, majors }) => {
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(narrowSpecializationSchema),
		values: {
			name: narrow?.name,
			id_majors: narrow?.id_majors?._id
		}
	});
	const [handleUpdateNarrow, { isLoading }] = useUpdateNarrowMutation();

	const onUpdateSubmit = async (data) => {
		const result = await handleUpdateNarrow({ data, id: narrow?._id });
		const error = result?.error;
		if (error) {
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
				<InputFieldControl name='name' control={control} label='Tên chuyên ngành hẹp' />
				<SelectFieldControl
					label='Chuyên ngành '
					initialValue='Chọn chuyên ngành '
					control={control}
					name='id_majors'
					options={Array.isArray(majors) ? majors.map((item) => ({ value: item._id, label: item.name })) : []}
				/>
				<Button type='submit' variant='primary' size='md' disabled={isLoading}>
					{isLoading && <LoadingSpinner size='sm' variant='primary' />}
					Sửa
				</Button>
			</Form>
		</SlideOver>
	);
};

const Form = tw.form`flex flex-col gap-6`;

export default UpdateNarrowSlideOver;
