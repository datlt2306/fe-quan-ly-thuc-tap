/* eslint-disable react/prop-types */
import { useUpdateSemesterMutation } from '@/App/providers/apis/semesterApi';
import { semesterDataValidator } from '@/App/schemas/semesterSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import Modal from '@/Core/components/common/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
const UpdateSemesterModal = ({ semesterData, onOpenStateChange, openState }) => {
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(semesterDataValidator),
		defaultValues: semesterData
	});

	useEffect(() => {
		if (semesterData) {
			reset({
				name: semesterData?.name,
				startTime: moment(semesterData?.start_time).format('YYYY-MM-DD'),
				endTime: moment(semesterData?.end_time).format('YYYY-MM-DD')
			});
		}
	}, [semesterData]);

	const [handleUpdateSemester, { isLoading }] = useUpdateSemesterMutation();

	const onUpdateSubmit = async (values) => {
		const data = {
			...values,
			start_time: moment(values.startTime).valueOf(),
			end_time: moment(values.endTime).valueOf()
		};
		const { error } = await handleUpdateSemester({ id: semesterData._id, payload: data });
		if (error) {
			onOpenStateChange(!openState);
			toast.error(error?.data?.message);
			return;
		}
		onOpenStateChange(!openState);
		toast.success('Sửa kì học thành công!');
	};

	return (
		<Modal openState={openState} onOpenStateChange={onOpenStateChange} title={'Sửa kì học'}>
			<Form onSubmit={handleSubmit(onUpdateSubmit)}>
				<InputFieldControl name='name' control={control} label='Tên kì học' />
				<InputFieldControl type='date' control={control} name='startTime' label='Ngày bắt đầu' />
				<InputFieldControl type='date' control={control} name='endTime' label='Ngày kết thúc' />
				<Button type='submit' size='md' variant='primary' disabled={isLoading}>
					{isLoading && <LoadingSpinner size='sm' variant='primary' />}
					Cập nhật
				</Button>
			</Form>
		</Modal>
	);
};

const Form = tw.form`flex flex-col gap-6`;

export default UpdateSemesterModal;
