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

	const formSelfFinding = [
		...SharedFields(control, user),
		{
			content: (
				<InputFieldControl
					label='Đơn vị thực tập'
					control={control}
					name='nameCompany'
					placeholder='Đơn vị thực tập/Tên doanh nghiệp'
				/>
			)
		},
		{
			content: (
				<InputFieldControl
					label='Địa chỉ thực tập'
					control={control}
					name='addressCompany'
					placeholder='Địa chỉ đơn vị thực tập'
				/>
			)
		},
		{
			content: <InputFieldControl label='Mã số thuế' control={control} name='taxCode' placeholder='Mã số thuế' />
		},
		{
			content: (
				<InputFieldControl
					label='Chức vụ người tiếp nhận'
					control={control}
					name='position'
					placeholder='Chức vụ người tiếp nhận'
				/>
			)
		},
		{
			content: (
				<InputFieldControl
					label='Số điện thoại doanh nghiệp'
					control={control}
					name='phoneNumberCompany'
					placeholder='Số điện thoại doanh nghiệp'
				/>
			)
		},
		{
			content: (
				<InputFieldControl
					label='Email người tiếp nhận'
					control={control}
					name='emailEnterprise'
					placeholder='Email người tiếp nhận'
				/>
			)
		}
	];

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
					{formSelfFinding.map((row, index) => (
						<Fragment key={index}>{row.content}</Fragment>
					))}
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
