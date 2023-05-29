import { useState, useEffect } from 'react';
import { formSignUpSchoolSupportSchema } from '@/App/schemas/formSignUpInterShipSchema';
import Button from '@/Core/components/common/Button';
import FileUploadFieldControl from '@/Core/components/common/FormControl/FileUploadFieldControl';

import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import FormRow from '../components/FormRow';
import { useUploadCvMutation } from '@/App/providers/apis/internRegistrationApi';
import SharedFields from './SharedFields';
import ComboBoxFieldControl from '@/Core/components/common/FormControl/ComboBoxFieldControl';
import {  useLazyGetAllCompanyQuery } from '@/App/providers/apis/businessApi';
const FormSchoolSupport = ({ selectedOption, user }) => {
	const navigate = useNavigate();
	const [hanldeUploadCvMutation, { isLoading }] = useUploadCvMutation();
	const [getBusiness, { data: business, isLoading: loadingBusiness }] = useLazyGetAllCompanyQuery();
	const { control, handleSubmit } = useForm({
		resolver: yupResolver(formSignUpSchoolSupportSchema),
		defaultValues: formSignUpSchoolSupportSchema.getDefault()
	});
	const handleMajorChange = (majorCode) => {
		if (majorCode) {
			getBusiness({ limit: 100, majorCode });
		}
	};

	const formSchoolSupport = [
		...SharedFields(control, user, handleMajorChange),
		{
			content: (
				<ComboBoxFieldControl
					loading={loadingBusiness}
					placeholder='Chọn doanh nghiệp'
					control={control}
					name='business'
					label='Đơn vị thực tập'
					options={
						Array.isArray(business?.list)
							? business.list.map((item) => ({ value: item._id, label: item.name }))
							: []
					}
				/>
			)
		},
		{
			content: <FileUploadFieldControl label='Upload CV(PDF)' className='mt-1 w-96' control={control} name='CV' />
		}
	];

	const handleFormSchoolSupport = async (data) => {
		const file = data.CV;

		const isPDF = file.type === 'application/pdf';
		if (!isPDF) {
			toast.error(`Vui lòng chọn file PDF`);
			return;
		}
		const handleData = {
			...data,
			typeNumber: selectedOption,
			support: Number(selectedOption),
			mssv: user?.mssv,
			_id: user?._id,
			email: user?.email,
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
		<>
			<Form onSubmit={handleSubmit(handleFormSchoolSupport)}>
				<FormRow>
					{formSchoolSupport.map((row, index) => (
						<Fragment key={index}>{row.content}</Fragment>
					))}
				</FormRow>
				<Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>
					{isLoading && <LoadingSpinner size='sm' variant='primary' />}
					Đăng ký
				</Button>
			</Form>
		</>
	);
};

export const Form = tw.form`pb-4`;

export default FormSchoolSupport;
