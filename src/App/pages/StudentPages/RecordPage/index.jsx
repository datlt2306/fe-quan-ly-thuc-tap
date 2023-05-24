import { useUploadFormMutation } from '@/App/providers/apis/reportApi';
import { useGetOneStudentQuery } from '@/App/providers/apis/studentApi';
import { recordSchema } from '@/App/schemas/recordSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

const RecordPage = () => {
	const navigate = useNavigate();

	const { user } = useSelector((state) => state.auth);
	const {data} = useGetOneStudentQuery(user?.id);

	const [selectFile, setSelectFile] = useState(null);
	const [validateFile, setValidateFile] = useState('');

	const [handleSubmitForm, { isLoading }] = useUploadFormMutation();

	const fileInputRef = useRef(null);

	const { handleSubmit, control } = useForm({
		resolver: yupResolver(recordSchema)
	});

	const handleChange = (e) => {
		const file = e.target.files[0];
		const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx'];
		if (!file) {
			setValidateFile('Không có file được chọn');
			return;
		}
		// Get the file extension
		const fileName = file.name;
		const fileExtension = fileName.split('.').pop().toLowerCase();

		if (!allowedExtensions.includes(fileExtension)) {
			setValidateFile('File không đúng định dạng');
			return;
		} else {
			setValidateFile('');
			setSelectFile(e.target.files[0]);
		}
	};
	const handleSubmitRecord = async (value) => {
		const file = selectFile;
		const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx'];
		const fileName = file.name;
		const fileExtension = fileName.split('.').pop().toLowerCase();
		if (!allowedExtensions.includes(fileExtension)) {
			return;
		}
		const formData = new FormData();
		formData.append('file', selectFile);
		formData.append('nameCompany', value.nameCompany);
		formData.append('internshipTime', value.date);
		formData.append('mssv', data.mssv);
		formData.append('email', data.email);
		formData.append('_id', data._id);
		formData.append('typeNumber', 2);
		const result = await handleSubmitForm(formData);
		if (result?.error) {
			toast.error("Nộp biên bản thất bại!");
			navigate('/');
			return;
		}
		toast.success("Nộp biên bản thành công");
		navigate('/');
	};
	return (
		<Container>
			<Title>Nộp biên bản</Title>
			<Form onSubmit={handleSubmit(handleSubmitRecord)}>
				<Info>
					Mã sinh viên: <Span>{data && data?.mssv}</Span>
				</Info>
				<Info>
					Họ và tên: <Span>{data && data?.name}</Span>
				</Info>
				<InputFieldControl label='Tên doanh nghiệp' placeholder='Tên doanh nghiệp ...' control={control} name='nameCompany' />
				<InputFieldControl label='Thời gian bắt đầu thực tập' control={control} name='date' type='date' />
				<InputFieldControl
					ref={fileInputRef}
					label='Upload (Image, PDF hoặc Docx)'
					control={control}
					name='form'
					type='file'
					onChange={handleChange}
				/>
				<Error>{validateFile}</Error>
				<Button variant='primary' type='submit' disabled={isLoading}>
					{isLoading && <LoadingSpinner size='sm' variant='primary' />} Nộp biên bản
				</Button>
			</Form>
		</Container>
	);
};

const Form = tw.form`grid gap-8`;
const Title = tw.div`mb-8 text-primary text-xl font-bold`;
const Container = tw.div`container mx-auto w-[512px]`;
const Info = tw.div``;
const Error = tw.div`text-error`;
const Span = tw.span`font-bold`;

export default RecordPage;
