import { formSignUpSchoolSupportSchema } from '@/App/schemas/signup-internship.schema';
import Button from '@/Core/components/common/Button';
import FileUploadFieldControl from '@/Core/components/common/FormControl/FileUploadFieldControl';
import { useGetAllCompanyQuery } from '@/App/store/apis/business.api';
import { useUploadCvMutation } from '@/App/store/apis/intern-registration.api';
import ComboBoxFieldControl from '@/Core/components/common/FormControl/ComboBoxFieldControl';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import SharedFields from './SharedFields';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

const FormSchoolSupport = ({ selectedOption, user }) => {
	const navigate = useNavigate();
	const currentSemester = useSelector((state) => state.semester?.defaultSemester);
	const { data: business, isLoading: loadingBusiness } = useGetAllCompanyQuery({ semester_id: currentSemester?._id });

	const [hanldeUploadCvMutation, { isLoading }] = useUploadCvMutation();

	const { control, handleSubmit } = useForm({
		resolver: yupResolver(formSignUpSchoolSupportSchema),
		defaultValues: formSignUpSchoolSupportSchema.getDefault(),
		values: user?.support == 1 &&
			user?.statusCheck == 1 && {
				phoneNumber: user?.phoneNumber,
				address: user?.address,
				dream: user?.dream,
				business: user?.business?._id
			}
	});

	const handleFormSchoolSupport = async (data) => {
		const file = data.CV;
		const handleData = {
			...data,
			typeNumber: selectedOption,
			support: selectedOption,
			_id: user?._id,
			CV: '',
			majorCode: user?.majorCode
		};
		const formData = new FormData();
		Object.entries(handleData).forEach(([key, value]) => {
			formData.append(key, value);
		});
		formData.append('file', file);
		const res = await hanldeUploadCvMutation(formData);
		if (res?.error) {
			toast.error('Đã có lỗi xảy ra');
			return;
		}
		toast.success('Đăng ký thành công');
		navigate('/thong-tin-sinh-vien');
	};
	return (
		<Form onSubmit={handleSubmit(handleFormSchoolSupport)}>
			<Form.Group>
				<SharedFields control={control} student={user} />
				<ComboBoxFieldControl
					loading={loadingBusiness}
					placeholder='Chọn doanh nghiệp'
					control={control}
					name='business'
					label='Đơn vị thực tập'
					options={Array.isArray(business) ? business.map((item) => ({ value: item._id, label: item.name })) : []}
				/>
				<FileUploadFieldControl label='Upload CV (PDF)' className='w-full' control={control} name='CV' />
			</Form.Group>
			<Button
				type='submit'
				variant='primary'
				icon={PaperAirplaneIcon}
				text='Đăng ký'
				className='w-fit'
				disabled={isLoading}
				loading={isLoading}
			/>
		</Form>
	);
};

const Form = tw.form`flex flex-col gap-6`;
Form.Group = tw.form`grid-cols-2 grid gap-6`;

export default FormSchoolSupport;
