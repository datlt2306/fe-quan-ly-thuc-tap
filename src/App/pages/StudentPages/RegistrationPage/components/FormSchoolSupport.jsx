/* eslint-disable react/prop-types */
<<<<<<< HEAD
import { useUploadCvMutation } from '@/App/providers/apis/registerInternAPI';
=======

>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec
import { formSignUpSchoolSupportSchema } from '@/App/schemas/formSignUpInterShipSchema';
import Button from '@/Core/components/common/Button';
import FileUploadFieldControl from '@/Core/components/common/FormControl/FileUploadFieldControl';
import SelectFieldControl from '@/Core/components/common/FormControl/SelectFieldControl';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
<<<<<<< HEAD
import { useSelector } from 'react-redux';
=======
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import FormRow from '../components/FormRow';
import { WrapButton } from './FormSelfFinding';
<<<<<<< HEAD
=======
import { useUploadCvMutation } from '@/App/providers/apis/internRegistrationApi';
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec

const FormSchoolSupport = ({ fields, business, selectedOption, user }) => {
	const navigate = useNavigate();
	const [hanldeUploadCvMutation, { isLoading }] = useUploadCvMutation();
	const { control, handleSubmit } = useForm({
		resolver: yupResolver(formSignUpSchoolSupportSchema),
		defaultValues: formSignUpSchoolSupportSchema.getDefault()
	});

	const formSchoolSupport = [
		...fields(control),
		{
			content: <FileUploadFieldControl label='Upload CV(PDF)' className='mt-1 w-96' control={control} name='CV' />
		},
		{
			content: (
				<SelectFieldControl
					label='Đơn vị thực tập'
					initialValue='Chọn doanh nghiệp'
					control={control}
					name='business'
<<<<<<< HEAD
					options={Array.isArray(business?.list) ? business.list.map((item) => ({ value: item._id, label: item.name })) : []}
=======
					options={
						Array.isArray(business?.list)
							? business.list.map((item) => ({ value: item._id, label: item.name }))
							: []
					}
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec
				/>
			)
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
		// const response = await uploadDriveMutation(formData);
		const res = await hanldeUploadCvMutation(formData);
		if (res?.error) {
			toast.error('Đã có lỗi xảy ra');
			return;
		}
		toast.success('Đăng ký thành công');
		navigate('/thong-tin-sinh-vien');
	};
<<<<<<< HEAD
	console.log(isLoading);
=======
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec
	return (
		<>
			<Form onSubmit={handleSubmit(handleFormSchoolSupport)}>
				<FormRow>
					{formSchoolSupport.map((row, index) => (
						<Fragment key={index}>{row.content}</Fragment>
					))}
				</FormRow>
				<WrapButton>
					<Button type='submit' variant='primary' className='mt-2' disabled={isLoading}>
						{isLoading && <LoadingSpinner size='sm' variant='primary' />}
						Đăng ký
					</Button>
				</WrapButton>
			</Form>
		</>
	);
};

<<<<<<< HEAD
export const Form = tw.form` pb-4`;
=======
export const Form = tw.form`pb-4`;
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec

export default FormSchoolSupport;
