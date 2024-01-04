import { StaffPaths } from '@/App/configs/route-paths.config';
import { applicationPasswordValidator } from '@/App/schemas/staff.schema';
import { useUpdateManagerMutation, useUpdateStaffMutation } from '@/App/store/apis/staff-list.api';
import { registerAppPassword } from '@/App/store/slices/auth.slice';
import Box from '@/Core/components/common/Box';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import NotificationWithAction from '@/Core/components/common/Notification/NotificationWithAction';
import Typography from '@/Core/components/common/Text/Typography';
import { CheckCircleIcon, CheckIcon, LinkIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

const SettingPage = () => {
	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(applicationPasswordValidator)
	});
	const [mutateAsync, { isLoading }] = useUpdateStaffMutation();
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const { hasRegisteredAppPassword, user } = useSelector((state) => state.auth);
	const [disabled, setDisabled] = useState(hasRegisteredAppPassword);

	useEffect(() => {
		let timeout = null;
		timeout = setTimeout(() => setOpen(hasRegisteredAppPassword));
		return () => {
			clearTimeout(timeout);
		};
	}, []);

	const handleUpdateAppPassword = async (data) => {
		try {
			const response = await mutateAsync({ id: user.id, payload: data }).unwrap();
			dispatch(registerAppPassword(Boolean(response?.applicationPassword)));
			toast.success('Cập nhật mật khẩu ứng dụng thành công');
		} catch (error) {
			toast.error('Cập nhật mật khẩu ứng dụng thất bại');
		}
	};

	return (
		<>
			<Container>
				<Typography level={5} textAlign='center' className='mb-10'>
					Cài đặt mật khẩu ứng dụng
				</Typography>
				<Form onSubmit={handleSubmit(handleUpdateAppPassword)}>
					<Box className='relative'>
						<InputFieldControl
							label='Mật khẩu ứng dụng'
							placeholder='xxxx xxxx xxxx xxxx'
							control={control}
							disabled={disabled}
							type='password'
							name='applicationPassword'
							onChange={(e) => reset({ applicationPassword: e.target.value.replace(/\s/g, '') })}
						/>
					</Box>
					{disabled && (
						<Button type='button' text='Cập nhật' variant='outline' onClick={() => setDisabled(false)} />
					)}
					{!disabled && (
						<Button
							disabled={disabled}
							type='submit'
							text='Lưu'
							variant='primary'
							loading={isLoading}
							icon={CheckIcon}
						/>
					)}
				</Form>
				<Link
					to={StaffPaths.TUTORIALS + '#step-1'}
					className='inline-flex items-center gap-2 text-center text-sm text-disabled underline-offset-4 duration-200 hover:text-base-content hover:underline'>
					<LinkIcon className='h-4 w-4' />
					Xem hướng lấy mật khẩu ứng dụng
				</Link>
			</Container>
			<NotificationWithAction
				open={open}
				onOpenStateChange={setOpen}
				icon={StyledCheckIcon}
				title=''
				message='Bạn đã cài đặt mật khẩu ứng dụng. Bạn có muốn cập nhật mật khẩu ứng dụng mới không ?'
				okText='Đồng ý'
				dismissText='Để sau'
				onOk={() => setDisabled(false)}
			/>
		</>
	);
};

const Container = tw.div`flex flex-col items-center justify-center gap-6 h-full`;
const Form = tw.form`flex flex-col gap-6 max-w-xl w-full mx-auto mb-6`;
const StyledCheckIcon = tw(CheckCircleIcon)`!text-success`;

export default SettingPage;
