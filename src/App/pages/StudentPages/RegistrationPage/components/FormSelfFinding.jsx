import { useUploadCvMutation } from '@/App/providers/apis/internRegistrationApi';
import { formSignUpSelfFindingSchema } from '@/App/schemas/formSignUpInterShipSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormRow from './FormRow';
import { Form } from './FormSchoolSupport';
import SharedFields, { SharedDefaultValues } from './SharedFields';

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
		defaultValues: formSignUpSelfFindingSchema.getDefault(),
		values: user?.support == 0 &&
			user?.statusCheck == 1 && {
				...SharedDefaultValues({ user }),
				business: user?.nameCompany,
				addressCompany: user?.addressCompany,
				phoneNumberCompany: user?.phoneNumberCompany,
				taxCode: user?.taxCode,
				emailEnterprise: user?.emailEnterprise,
				position: user?.position,
				nameCompany: user?.nameCompany
			}
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
		<>
			<Form onSubmit={handleSubmit(handleFormSelfFinding)}>
				<FormRow className='grid-cols-3 sm:grid-cols-1 md:grid-cols-2'>
					<SharedFields control={control} student={user} inputFields={FieldsFormSelfFinding} />
				</FormRow>
				<Button type='submit' variant='primary' disabled={isLoading}>
					{isLoading && <LoadingSpinner size='sm' variant='primary' />}
					Đăng ký
				</Button>
			</Form>
		</>
	);
};
export default FormSelfFinding;
