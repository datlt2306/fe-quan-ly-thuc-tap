/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { useAddSemesterMutation } from '@/App/providers/apis/semesterApi';
import { semesterDataValidator } from '@/App/schemas/semesterSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import SlideOver from '@/Core/components/common/SlideOver';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

const AddSemesterSlideOver = ({ onOpen, open }) => {
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(semesterDataValidator),
		defaultValue: semesterDataValidator.getDefault()
	});
	const { currentCampus } = useSelector((state) => state.campus);
	const [handleAddNewSemester, { isLoading }] = useAddSemesterMutation();

	const onAddSubmit = async (data) => {
		const { error } = await handleAddNewSemester({
			...data,
			campus_id: currentCampus._id
		});
		if (error) {
			onOpen(!open);
			reset();
			toast.error(error?.data?.message);
			return;
		}
		onOpen(!open);
		reset();
		toast.success('Thêm kì học thành công!');
	};

	useEffect(() => {
		if (!open) reset();
	}, [open]);
	return (
		<SlideOver open={open} onOpen={onOpen} panelTitle={'Thêm kì học'}>
			<Form onSubmit={handleSubmit(onAddSubmit)}>
				<InputFieldControl name='name' control={control} label='Tên kì học' />
				<InputFieldControl
					type='date'
					control={control}
					name='start_time'
					min={moment().format('YYYY-MM-DD')}
					label='Ngày bắt đầu'
				/>
				<InputFieldControl
					type='date'
					control={control}
					name='end_time'
					min={moment().format('YYYY-MM-DD')}
					label='Ngày kết thúc'
				/>
				<Button type='submit' variant='primary' size='md' disabled={isLoading} loading={isLoading}>
					Thêm
				</Button>
			</Form>
		</SlideOver>
	);
};

const Form = tw.form`flex flex-col gap-6`;

export default AddSemesterSlideOver;
