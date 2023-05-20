import { useUploadFormFileMutation, useUploadFormMutation } from '@/App/providers/apis/reportApi';
import { recordSchema } from '@/App/schemas/recordSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import tw from 'twin.macro';

const RecordPage = () => {
	const navigate = useNavigate();

	const { user } = useSelector((state) => state.auth);

	const [selectFile, setSelectFile] = useState(null);
	const [validateFile, setValidateFile] = useState('');

	const [handleUpload] = useUploadFormFileMutation();
	const [handleSubmitForm] = useUploadFormMutation();

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
	const onSubmit = async (value) => {
		const formData = new FormData();
		formData.append('file', selectFile);
		const result_upload = await handleUpload(formData);
		console.log(result_upload.data.url);
		const data_upload = {
			nameCompany: value.nameCompany,
			internshipTime: value.date,
			form: result_upload?.data?.url,
			mssv: user.mssv,
			email: user.email,
			_id: user.id
		};
		console.log(data_upload);
		const result = await handleSubmitForm(data_upload);
		console.log(result);
		navigate('/');
	};
	return (
		<Container>
			<Title>Nộp biên bản</Title>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Info>
					Mã sinh viên: <Span>{user && user?.mssv}</Span>
				</Info>
				<Info>
					Họ và tên: <Span>{user && user?.displayName}</Span>
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
				<Button variant='primary' type='submit'>
					Nộp biên bản
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
