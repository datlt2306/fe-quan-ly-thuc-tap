import { useState } from 'react';
import TextareaFieldControl from '@/Core/components/common/FormControl/TextareaFieldControl';
import Button from '@/Core/components/common/Button';
import { useForm } from 'react-hook-form';
import { requestOfStudentValidator } from '@/App/schemas/requestStudentSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import { useSelector } from 'react-redux';
import { useRequestOfStudentMutation } from '@/App/providers/apis/requestStudentsApi';
import { toast } from 'react-toastify';

const FormRequestSupport = ({ formType, setOpenState }) => {
	//xử lý gửi yêu cầu của hỗ trợ các form biên bản ,cv,báo cáo
	const user = useSelector((state) => state.auth?.user);
	const [requestOfStudentMutation, { isLoading }] = useRequestOfStudentMutation();

	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(requestOfStudentValidator)
	});
	const onSubmit = async ({ description }) => {
		const response = await requestOfStudentMutation({
			type: formType,
			description: description,
			user_id: user?.id
		});
		const error = response?.error;
		setOpenState(false);

		if (error) {
			toast.error(error?.data?.message || 'Đã có lỗi xảy ra');
			return;
		}
		toast.success('Gửi yêu cầu hỗ trợ thành công');
	};
	const [open, setOpen] = useState(false);
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{open && (
				<>
					<TextareaFieldControl control={control} name='description' />
					<div className='mt-3 flex justify-end gap-3'>
						<Button
							variant='error'
							className='hover:bg-red-600'
							onClick={() => {
								setOpen(false);
								reset();
							}}>
							Huỷ
						</Button>
						<Button type='submit' variant='primary' disabled={isLoading} onClick={() => setOpen(true)}>
							{isLoading && <LoadingSpinner size='sm' variant='primary' />}
							Gửi
						</Button>
					</div>
				</>
			)}

			{!open && (
				<Button variant='primary' className='mt-3 w-full' onClick={() => setOpen(true)}>
					Gửi yêu cầu hỗ trợ
				</Button>
			)}
		</form>
	);
};

export default FormRequestSupport;
