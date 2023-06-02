import { useGetSetTimeQuery } from '@/App/providers/apis/configTimesApi';
import { useUploadFormMutation } from '@/App/providers/apis/reportApi';
import { useGetOneStudentQuery } from '@/App/providers/apis/studentApi';
import { recordSchema } from '@/App/schemas/recordSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import Typography from '@/Core/components/common/Text/Typography';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useRef, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import EmptyStateSection from '../Shared/EmptyStateSection';
import SuccessStateSection from '../Shared/SuccessStateSection';
import LoadingData from '../Shared/LoadingData';
const RecordPage = () => {
	const { data: times, isLoading: getTimeLoading } = useGetSetTimeQuery({ typeNumber: 2 });
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);
	const { data, isLoading: getUserLoading } = useGetOneStudentQuery(user?.id);
	const [file, setFile] = useState(null);
	const [handleSubmitForm, { isLoading }] = useUploadFormMutation();
	const fileInputRef = useRef(null);
	const { handleSubmit, control } = useForm({
		resolver: yupResolver(recordSchema)
	});

	/**
	 * * Check the student's status to open the form
	 * * 2: "Nhận CV", 5: "Sửa biên bản", 11: "Đã đăng ký"
	 */
	const statusCheck = [2, 5, 11];

	const deadlineCheck =
		times && times?.time?.endTime > new Date().getTime() && times?.time?.startTime < new Date().getTime();

	const handleSubmitRecord = async (value) => {
		const formData = new FormData();
		formData.append('file', file);
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
		<Fragment>
			{deadlineCheck ? (
				statusCheck.includes(data?.statusCheck) ? (
					<Container>
						<Typography level={4} color='text-primary'>
							Nộp biên bản
						</Typography>
						<List>
							<List.Item>
								Họ và tên: <Text className='font-medium'>{data && data?.name}</Text>
							</List.Item>
							<List.Item>
								Mã sinh viên: <Text className='font-medium'>{data && data?.mssv}</Text>
							</List.Item>
							<List.Item>
								Tên doanh nghiệp:
								<Text className='font-medium'>
									{data && data?.support === 1 ? data?.business?.name : data?.nameCompany}
								</Text>
							</List.Item>
						</List>
						<Form onSubmit={handleSubmit(handleSubmitRecord)}>
							<InputFieldControl label='Thời gian bắt đầu thực tập' control={control} name='date' type='date' />
							<InputFieldControl
								ref={fileInputRef}
								label='Upload (Image, PDF)'
								control={control}
								name='form'
								type='file'
								onChange={(e) => setFile(e.target.files[0])}
							/>
							<Button variant='primary' type='submit' disabled={isLoading} loading={isLoading}>
								Nộp biên bản
							</Button>
						</Form>
					</Container>
				) : data?.form ? (
					<SuccessStateSection title={'Bạn đã nộp biên bản thành công!'} />
				) : (
					<EmptyStateSection title={'Bạn chưa đủ điều kiện nộp biên bản'} className='h-full' />
				)
			) : (
				<EmptyStateSection
					title={'Thời gian đăng ký form biên bản chưa mở, sinh viên vui lòng chờ thông báo từ phòng QHDN'}
				/>
			)}
		</Fragment>
	);
};

const Form = tw.form`flex flex-col gap-6`;
const Container = tw.div`container w-[512px]`;
const List = tw.ol`flex flex-col gap-2 bg-gray-50 p-4 mb-6`;
List.Item = tw.li`whitespace-nowrap text-base-content inline-flex items-baseline gap-2`;

export default RecordPage;
