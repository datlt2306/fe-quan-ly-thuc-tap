import { formSignUpSelfFindingSchema } from '@/App/schemas/signup-internship.schema';
import { useUploadCvMutation } from '@/App/store/apis/intern-registration.api';
import Button from '@/Core/components/common/Button';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import SharedFields from './SharedFields';

const FieldsFormSelfFinding = [
	{
		label: 'Đơn vị thực tập',
		name: 'nameCompany',
		placeholder: 'Đơn vị thực tập/Tên doanh nghiệp'
	},
	{
		label: 'Địa chỉ thực tập',
		name: 'addressCompany',
		placeholder: 'Địa chỉ đơn vị thực tập'
	},
	{
		label: 'Mã số thuế',
		name: 'taxCode',
		placeholder: 'Mã số thuế'
	},
	{
		label: 'Tên người tiếp nhận',
		name: 'employer',
		placeholder: 'Tên người tiếp nhận'
	},
	{
		label: 'Chức vụ người tiếp nhận',
		name: 'position',
		placeholder: 'Chức vụ người tiếp nhận'
	},
	{
		label: 'Số điện thoại doanh nghiệp',
		name: 'phoneNumberCompany',
		placeholder: 'Số điện thoại doanh nghiệp'
	},
	{
		label: 'Email người tiếp nhận',
		name: 'emailEnterprise',
		placeholder: 'Email người tiếp nhận'
	}
];

const FormSelfFinding = ({ selectedOption, user }) => {
	const navigate = useNavigate();

	const { control, handleSubmit } = useForm({
		resolver: yupResolver(formSignUpSelfFindingSchema),
		defaultValues: formSignUpSelfFindingSchema.getDefault()
	});
	const [hanldeUploadCvMutation, { isLoading }] = useUploadCvMutation();

	const handleFormSelfFinding = async (data) => {
		const res = await hanldeUploadCvMutation({
			...data,
			typeNumber: selectedOption,
			support: selectedOption,
			_id: user?._id,
			CV: 'NO-CV',
			majorCode: user?.majorCode
		});
		if (res?.error) {
			toast.error('Đã có lỗi xảy ra');
			return;
		}
		toast.success('Đăng ký thành công');
		navigate('/thong-tin-sinh-vien');
	};
	return (
		<Form onSubmit={handleSubmit(handleFormSelfFinding)}>
			<Form.Group>
				<SharedFields control={control} student={user} inputFields={FieldsFormSelfFinding} />
			</Form.Group>

			<Button
				type='submit'
				variant='primary'
				loading={isLoading}
				icon={PaperAirplaneIcon}
				disabled={isLoading}
				className='w-fit'
				text='Đăng ký'
			/>
		</Form>
	);
};

const Form = tw.form`flex flex-col gap-6`;
Form.Group = tw.form`grid-cols-3 sm:grid-cols-1 md:grid-cols-2 grid gap-6`;

export default FormSelfFinding;
