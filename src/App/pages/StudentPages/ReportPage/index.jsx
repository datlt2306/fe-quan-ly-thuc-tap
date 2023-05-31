import { useGetSetTimeQuery } from '@/App/providers/apis/configTimesApi';
import { useUploadReportMutation } from '@/App/providers/apis/reportApi';
import { useGetOneStudentQuery } from '@/App/providers/apis/studentApi';
import { reportSchema } from '@/App/schemas/reportSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import RadioFieldControl from '@/Core/components/common/FormControl/RadioFieldControl';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import Typography from '@/Core/components/common/Text/Typography';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import EmptyStateSection from '../Shared/EmptyStateSection';
import SuccessStateSection from '../Shared/SuccessStateSection';
import LoadingData from '../Shared/LoadingData';

const ReportPage = () => {
	// check the student's status to open the form
	const statusCheck = [6, 8];

	const { data: times, isLoading: getTimeLoading } = useGetSetTimeQuery(
		{ typeNumber: 3 },
		{ refetchOnMountOrArgChange: true }
	);
	const deadlineCheck =
		times && times?.time?.endTime > new Date().getTime() && times?.time?.startTime < new Date().getTime();

	const convertTime = (date) => {
		if (typeof date !== 'string') return '';
		return date ? moment(date.substring(0, 10), 'YYYY-MM-DD').format('DD/MM/YYYY') : '';
	};

	const navigate = useNavigate();

	const { user } = useSelector((state) => state.auth);
	const { data, isLoading: getUserLoading } = useGetOneStudentQuery(user?.id);

	const [selectFile, setSelectFile] = useState(null);
	const [validateFile, setValidateFile] = useState('');

	const [handleSubmitForm, { isLoading }] = useUploadReportMutation();

	const fileInputRef = useRef(null);

	const { handleSubmit, control } = useForm({
		resolver: yupResolver(reportSchema)
	});

	const handleChange = (e) => {
		const file = e.target.files[0];
		const allowedExtensions = ['pdf'];
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
		const file = selectFile;
		const allowedExtensions = ['pdf'];
		const fileName = file.name;
		const fileExtension = fileName.split('.').pop().toLowerCase();
		if (!allowedExtensions.includes(fileExtension)) {
			return;
		}
		const formData = new FormData();
		formData.append('file', selectFile);
		formData.append('endInternShipTime', value.endInternShipTime);
		formData.append('resultScore', value.resultScore);
		formData.append('attitudePoint', value.attitudePoint);
		formData.append('signTheContract', value.signTheContract);
		formData.append('_id', data._id);
		formData.append('mssv', data.mssv);
		formData.append('email', data.email);
		formData.append('nameCompany', data?.support === 1 ? data?.business?.name : data?.nameCompany);
		formData.append('typeNumber', 3);
		const result = await handleSubmitForm(formData);
		if (result?.error) {
			toast.error('Nộp báo cáo thất bại!');
			navigate('/');
			return;
		}
		toast.success('Nộp báo cáo thành công');
		navigate('/');
	};
	if (getTimeLoading) {
		return <LoadingData />;
	}
	return (
		<div>
			{deadlineCheck ? (
				statusCheck.includes(data?.statusCheck) ? (
					<Container>
						<Typography level={4} color='text-primary'>
							Nộp báo cáo
						</Typography>
						<Form onSubmit={handleSubmit(onSubmit)}>
							<Info>
								Mã sinh viên: <Span>{data && data?.mssv}</Span>
							</Info>
							<Info>
								Họ và tên: <Span>{data && data?.name}</Span>
							</Info>
							<Info>
								Tên doanh nghiệp:{' '}
								<Span>{data && data?.support === 1 ? data?.business?.name : data?.nameCompany}</Span>
							</Info>

							<InputFieldControl
								label='Điểm kết quả'
								placeholder='Nhập điểm kết quả thực tập'
								control={control}
								name='resultScore'
							/>

							<InputFieldControl
								label='Điểm thái độ'
								placeholder='Nhập điểm thái độ thực tập'
								control={control}
								name='attitudePoint'
							/>

							<div>
								<div className='mb-2'>Đề xuất ký HĐLĐ với doanh nghiệp</div>
								<RadioFieldControl
									control={control}
									name='signTheContract'
									options={[
										{ label: 'Có', value: 0 },
										{ label: 'Không', value: 1 },
										{ label: 'Không nhận lời', value: 2 }
									]}
								/>
							</div>

							<Info>
								Thời gian bắt đầu thực tập: <Span>{data && convertTime(data?.internshipTime)}</Span>
							</Info>
							<InputFieldControl
								label='Thời gian kết thúc thực tập'
								control={control}
								name='endInternShipTime'
								type='date'
							/>
							<InputFieldControl
								ref={fileInputRef}
								label='Upload báo cáo (PDF)'
								control={control}
								name='file'
								type='file'
								onChange={handleChange}
							/>
							<Error>{validateFile}</Error>
							<Button variant='primary' type='submit' disabled={isLoading}>
								{isLoading && <LoadingSpinner size='sm' variant='primary' />} Nộp báo cáo
							</Button>
						</Form>
					</Container>
				) : data?.report ? (
					<SuccessStateSection title={'Bạn đã nộp báo cáo thành công!'} />
				) : (
					<EmptyStateSection title={'Bạn chưa đủ điều kiện nộp báo cáo'} />
				)
			) : (
				<EmptyStateSection
					title={'Thời gian đăng ký form báo cáo chưa mở, sinh viên vui lòng chờ thông báo từ phòng QHDN'}
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

export default ReportPage;
