import { StaffPaths } from '@/App/configs/route-paths.config';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import Typography from '@/Core/components/common/Text/Typography';
import { ArrowTopRightOnSquareIcon, CheckIcon, LinkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import tw from 'twin.macro';

const SettingPage = () => {
	const { handleSubmit, control } = useForm();

	return (
		<Container>
			<Typography level={5} textAlign='center' className='mb-10'>
				Cài đặt mật khẩu ứng dụng
			</Typography>
			<Form>
				<InputFieldControl
					label='Mật khẩu ứng dụng'
					placeholder='xxxx xxxx xxxx xxxx'
					control={control}
					name='applicationPassword'
				/>
				<Button type='submit' text='Lưu' variant='primary' icon={CheckIcon} />
			</Form>
			<Link
				to={StaffPaths.TUTORIALS + '#step-1'}
				className='inline-flex items-center gap-2 text-center text-sm text-disabled underline-offset-4 duration-200 hover:text-base-content hover:underline'>
				<LinkIcon className='h-4 w-4' />
				Xem hướng lấy mật khẩu ứng dụng
			</Link>
		</Container>
	);
};

const Container = tw.div`flex flex-col items-center justify-center gap-6 h-full`;
const Form = tw.form`flex flex-col gap-6 max-w-xl w-full mx-auto mb-6`;

export default SettingPage;
