import { useGetSetTimeQuery } from '@/App/store/apis/config-times.api';
import { useUploadReportMutation } from '@/App/store/apis/report.api';
import { useGetOneStudentQuery } from '@/App/store/apis/student.api';
import { reportSchema } from '@/App/schemas/report.schema';
import Button from '@/Core/components/common/Button';
import FormControl from '@/Core/components/common/FormControl/FormControl';
import InputFieldControl, { Input } from '@/Core/components/common/FormControl/InputFieldControl';
import RadioFieldControl from '@/Core/components/common/FormControl/RadioFieldControl';
import Text from '@/Core/components/common/Text/Text';
import Typography from '@/Core/components/common/Text/Typography';
import { formatDate } from '@/Core/utils/formatDate';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import EmptyStateSection from '../Shared/EmptyStateSection';
import LoadingData from '../Shared/LoadingData';
import SuccessStateSection from '../Shared/SuccessStateSection';

/**
 * @constant
 * @description Trạng thái sinh viên có thể mở form:
 * @kind 6: Đang thực tập
 * @kind 8: Sửa báo cáo
 */
const StatusToOpenTheForm = [6, 8];

/**
 * @constant
 * @description Trạng thái sinh viên đã hoàn thành thưc tập
 */
const InternCompletionStatus = 9;

const ReportPage = () => {
	const { data: times, isLoading: getTimeLoading } = useGetSetTimeQuery({ typeNumber: 3 });
	const deadlineCheck =
		times && times?.time?.endTime > new Date().getTime() && times?.time?.startTime < new Date().getTime();
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.auth);
	const { data: student } = useGetOneStudentQuery(user?.id);
	const [chosenFile, setChosenFile] = useState(null);
	const [handleSubmitForm, { isLoading }] = useUploadReportMutation();
	const { handleSubmit, control, reset, setError } = useForm({
		resolver: yupResolver(reportSchema),
		context: { startInternshipTime: student?.internshipTime }
	});

	useEffect(() => {
		/* If student has to edit report -> reset to previous form value */
		if (student?.statusCheck === 8)
			reset({
				endInternShipTime: moment(student?.endInternShipTime).format('YYYY-MM-DD'),
				resultScore: student?.resultScore,
				attitudePoint: student?.attitudePoint,
				signTheContract: student?.signTheContract
			});
	}, [student]);

	const onSubmit = async (value) => {
		const formData = new FormData();
		formData.append('file', chosenFile);
		formData.append('endInternShipTime', value.endInternShipTime);
		formData.append('resultScore', value.resultScore);
		formData.append('attitudePoint', value.attitudePoint);
		formData.append('signTheContract', value.signTheContract);
		formData.append('_id', student._id);
		formData.append('mssv', student.mssv);
		formData.append('email', student.email);
		formData.append('nameCompany', student?.support === 1 ? student?.business?.name : student?.nameCompany);
		formData.append('typeNumber', 3);

		const { error } = await handleSubmitForm(formData);
		if (error) {
			toast.error('Nộp báo cáo thất bại!');
			return;
		}
		toast.success('Nộp báo cáo thành công');
		navigate('/');
	};
	if (getTimeLoading) {
		return <LoadingData />;
	}
	return (
		<Fragment>
			{deadlineCheck ? (
				StatusToOpenTheForm.includes(student?.statusCheck) ? (
					<Container>
						<Typography level={5} className='mb-6'>
							Nộp báo cáo
						</Typography>
						<List>
							<List.Item>
								Họ và tên: <Text className='font-medium'>{student && student?.name}</Text>
							</List.Item>
							<List.Item>
								Mã sinh viên: <Text className='font-medium'>{student && student?.mssv}</Text>
							</List.Item>
							<List.Item>
								Tên doanh nghiệp:
								<Text className='font-medium'>
									{student && student?.support === 1 ? student?.business?.name : student?.nameCompany}
								</Text>
							</List.Item>
						</List>
						<Form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
							<Form.Group>
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
							</Form.Group>
							<Form.Group>
								<FormControl>
									<Text as='label'>Thời gian bắt đầu thực tập</Text>
									<Input readOnly value={formatDate(student?.internshipTime)} />
								</FormControl>
								<InputFieldControl
									label='Thời gian kết thúc thực tập'
									control={control}
									name='endInternShipTime'
									type='date'
								/>
							</Form.Group>
							<Form.Group>
								<RadioGroup>
									<Text className='font-medium'>Đề xuất ký HĐLĐ với doanh nghiệp</Text>
									<RadioFieldControl
										control={control}
										name='signTheContract'
										options={[
											{ label: 'Có', value: 0 },
											{ label: 'Không', value: 1 },
											{ label: 'Không nhận lời', value: 2 }
										]}
									/>
								</RadioGroup>
								<InputFieldControl
									label='Upload báo cáo (PDF)'
									control={control}
									name='file'
									type='file'
									onChange={(e) => {
										if (e.target.files[0].size > 1000000) {
											setError('form', { message: 'Kích thước file quá lớn' });
											return;
										}
										setError('form', null);
										setChosenFile(e.target.files[0]);
									}}
								/>
							</Form.Group>
							<Button
								variant='primary'
								className='w-auto'
								type='submit'
								disabled={isLoading}
								loading={isLoading}
								icon={ArrowUpTrayIcon}>
								Nộp báo cáo
							</Button>
						</Form>
					</Container>
				) : student?.report ? (
					<SuccessStateSection
						title={'Bạn đã nộp báo cáo thành công!'}
						message={
							student.statusCheck === InternCompletionStatus
								? 'Bạn đã hoàn thành thực tập.'
								: 'Báo cáo sẽ được phòng QHDN review và xác nhận lại cho sinh viên.'
						}
					/>
				) : (
					<EmptyStateSection title={'Bạn chưa đủ điều kiện nộp báo cáo'} />
				)
			) : (
				<EmptyStateSection
					title={'Thời gian đăng ký form báo cáo chưa mở, sinh viên vui lòng chờ thông báo từ phòng QHDN'}
				/>
			)}
		</Fragment>
	);
};

const List = tw.ol`flex flex-col gap-2 bg-gray-50 p-4 mb-6`;
const Form = tw.form`flex flex-col gap-6`;
const Container = tw.div`max-w-2xl text-base-content md:mx-auto`;
const RadioGroup = tw.div`flex flex-col gap-1`;
Form.Group = tw.div`grid grid-cols-2 gap-6 sm:grid-cols-1`;
List.Item = tw.li`whitespace-nowrap text-base-content inline-flex items-baseline gap-2`;

export default ReportPage;
