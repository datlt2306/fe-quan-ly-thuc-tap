import { useRequestOfStudentMutation } from '@/App/providers/apis/requestStudentsApi';
import { requestOfStudentValidator } from '@/App/schemas/requestStudentSchema';
import Button from '@/Core/components/common/Button';
import TextareaFieldControl from '@/Core/components/common/FormControl/TextareaFieldControl';
import { EnvelopeIcon, PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
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
		<Form onSubmit={handleSubmit(onSubmit)}>
			{open ? (
				<Fragment>
					<TextareaFieldControl control={control} name='description' />
					<Form.Action>
						<Button
							variant='error'
							className='hover:bg-red-600'
							onClick={() => {
								setOpen(false);
								reset();
							}}
							icon={XMarkIcon}>
							Huỷ
						</Button>
						<Button
							type='submit'
							variant={isLoading ? 'disabled' : 'primary'}
							onClick={() => setOpen(true)}
							icon={PaperAirplaneIcon}>
							{isLoading && <LoadingSpinner size='sm' variant='primary' />}
							Gửi
						</Button>
					</Form.Action>
				</Fragment>
			) : (
				<Button variant='primary' className='mt-3 w-full' onClick={() => setOpen(true)} icon={EnvelopeIcon}>
					Gửi yêu cầu hỗ trợ
				</Button>
			)}
		</Form>
	);
};

const Form = tw.form`flex flex-col gap-3`;
Form.Action = tw.div`self-end flex items-center gap-1`;

export default FormRequestSupport;
