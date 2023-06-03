import { useGetSetTimeQuery } from '@/App/providers/apis/configTimesApi';
import { useUploadReportMutation } from '@/App/providers/apis/reportApi';
import { useGetOneStudentQuery } from '@/App/providers/apis/studentApi';
import { reportSchema } from '@/App/schemas/reportSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl, { Input } from '@/Core/components/common/FormControl/InputFieldControl';
import RadioFieldControl from '@/Core/components/common/FormControl/RadioFieldControl';
import Text from '@/Core/components/common/Text/Text';
import Typography from '@/Core/components/common/Text/Typography';
import formatDate from '@/Core/utils/formatDate';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { Fragment, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';
import EmptyStateSection from '../Shared/EmptyStateSection';
import LoadingData from '../Shared/LoadingData';
import SuccessStateSection from '../Shared/SuccessStateSection';
import FormControl from '@/Core/components/common/FormControl/FormControl';

const ReportPage = () => {
	// check the student's status to open the form
	// 6: "Đang thực tập", 8: "Sửa báo cáo"
	const statusCheck = [6, 8];

	const { data: times, isLoading: getTimeLoading } = useGetSetTimeQuery({ typeNumber: 3 });
	const deadlineCheck =
		times && times?.time?.endTime > new Date().getTime() && times?.time?.startTime < new Date().getTime();

	const convertTime = (date) => {
		if (typeof date !== 'string') return '';
		return date ? moment(date.substring(0, 10), 'YYYY-MM-DD').format('DD/MM/YYYY') : '';
	};

	const navigate = useNavigate();

	const { user } = useSelector((state) => state.auth);
	const { data, isLoading: getUserLoading } = useGetOneStudentQuery(user?.id);
	const [chosenFile, setChosenFile] = useState(null);
	const [handleSubmitForm, { isLoading }] = useUploadReportMutation();

	const fileInputRef = useRef(null);

	const { handleSubmit, control } = useForm({
		resolver: yupResolver(reportSchema)
	});

	const onSubmit = async (value) => {
		const formData = new FormData();
		formData.append('file', chosenFile);
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
		<Fragment>
			{deadlineCheck ? (
				statusCheck.includes(data?.statusCheck) ? (
					<Container>
						<Typography level={5} className='mb-6'>
							Nộp báo cáo
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
						<Form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
							<Form.Grid>
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
							</Form.Grid>
							<Form.Grid>
								<FormControl>
									<Text as='label'>Thời gian bắt đầu thực tập:</Text>
									<Input readOnly value={data && formatDate(data?.internshipTime)} />
								</FormControl>
								<InputFieldControl
									label='Thời gian kết thúc thực tập'
									control={control}
									name='endInternShipTime'
									type='date'
								/>
							</Form.Grid>
							<Form.Grid>
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
									ref={fileInputRef}
									label='Upload báo cáo (PDF)'
									control={control}
									name='file'
									type='file'
									onChange={(e) => setChosenFile(e.target.files[0])}
								/>
							</Form.Grid>
							<Button
								variant='primary'
								className='w-auto'
								type='submit'
								disabled={isLoading}
								loading={isLoading}>
								Nộp báo cáo
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
		</Fragment>
	);
};

const List = tw.ol`flex flex-col gap-2 bg-gray-50 p-4 mb-6`;
const Form = tw.form`flex flex-col gap-6`;
const Container = tw.div`max-w-2xl text-base-content md:mx-auto`;
const RadioGroup = tw.div`flex flex-col gap-1`;
Form.Grid = tw.div`grid grid-cols-2 gap-6 sm:grid-cols-1`;
List.Item = tw.li`whitespace-nowrap text-base-content inline-flex items-baseline gap-2`;

export default ReportPage;
