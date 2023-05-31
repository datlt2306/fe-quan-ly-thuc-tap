import { useGetSetTimeQuery } from '@/App/providers/apis/configTimesApi';
import { useUploadFormMutation } from '@/App/providers/apis/reportApi';
import { useGetOneStudentQuery } from '@/App/providers/apis/studentApi';
import { recordSchema } from '@/App/schemas/recordSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import Typography from '@/Core/components/common/Text/Typography';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import EmptyStateSection from '../Shared/EmptyStateSection';
import SuccessStateSection from '../Shared/SuccessStateSection';
import LoadingData from '../Shared/LoadingData';
const RecordPage = () => {
	const { data: times, isLoading: getTimeLoading } = useGetSetTimeQuery(
		{ typeNumber: 2 },
		{ refetchOnMountOrArgChange: true }
	);
	const deadlineCheck =
		times && times?.time?.endTime > new Date().getTime() && times?.time?.startTime < new Date().getTime();
	const navigate = useNavigate();

	const { user } = useSelector((state) => state.auth);
	const { data, isLoading: getUserLoading } = useGetOneStudentQuery(user?.id);

	const [selectFile, setSelectFile] = useState(null);
	const [validateFile, setValidateFile] = useState('');

	const [handleSubmitForm, { isLoading }] = useUploadFormMutation();

	const fileInputRef = useRef(null);

	const { handleSubmit, control } = useForm({
		resolver: yupResolver(recordSchema)
	});

	const handleChange = (e) => {
		const file = e.target.files[0];
		const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
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
		const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
		const fileName = file.name;
		const fileExtension = fileName.split('.').pop().toLowerCase();
		if (!allowedExtensions.includes(fileExtension)) {
			return;
		}
		const formData = new FormData();
		formData.append('file', selectFile);
		formData.append('nameCompany', data?.support === 1 ? data?.business?.name : data?.nameCompany);
		formData.append('internshipTime', value.date);
		formData.append('mssv', data.mssv);
		formData.append('email', data.email);
		formData.append('_id', data._id);
		formData.append('typeNumber', 2);
		const result = await handleSubmitForm(formData);
		if (result?.error) {
			toast.error('Nộp biên bản thất bại!');
			navigate('/');
			return;
		}
		toast.success('Nộp biên bản thành công');
		navigate('/');
	};
	if (getTimeLoading) {
		return <LoadingData />;
	}
	return (
		<div>
			{deadlineCheck ? (
				[2, 5, 11].includes(data?.statusCheck) ? (
					<Container>
						<Typography level={4} color='text-primary'>
							Nộp biên bản
						</Typography>
						<Form onSubmit={handleSubmit(handleSubmitRecord)}>
							<Info>
								Mã sinh viên: <Span>{data && data?.mssv}</Span>
							</Info>
							<Info>
								Họ và tên: <Span>{data && data?.name}</Span>
							</Info>
							<Info>
								Tên công ty:{' '}
								<Span>{data && data?.support === 1 ? data?.business?.name : data?.nameCompany}</Span>
							</Info>
							<InputFieldControl label='Thời gian bắt đầu thực tập' control={control} name='date' type='date' />
							<InputFieldControl
								ref={fileInputRef}
								label='Upload (Image, PDF)'
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
				) : data?.form ? (
					<SuccessStateSection title={'Bạn đã nộp biên bản thành công!'} />
				) : (
					<EmptyStateSection title={'Bạn chưa đủ điều kiện nộp biên bản'} />
				)
			) : (
				<EmptyStateSection
					title={'Thời gian đăng ký form biên bản chưa mở, sinh viên vui lòng chờ thông báo từ phòng QHDN'}
				/>
			)}
		</div>
	);
};

const Form = tw.form`flex flex-col gap-6 mt-4`;
const Container = tw.div`container w-[512px]`;
const Info = tw.div``;
const Error = tw.div`text-error`;
const Span = tw.span`font-bold text-base-content`;

export default RecordPage;
