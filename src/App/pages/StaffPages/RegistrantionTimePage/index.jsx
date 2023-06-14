import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { TimesConfig } from '@/App/constants/timesConfig';
import { useGetAllSetTimeQuery, usePutSetTimeMutation } from '@/App/providers/apis/configTimesApi';
import { useGetAllSemestersQuery } from '@/App/providers/apis/semesterApi';
import { registrantionTimeSchema } from '@/App/schemas/registrantionTimeSchema';
import Button from '@/Core/components/common/Button';
import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import { Option, Select } from '@/Core/components/common/FormControl/SelectFieldControl';
import Modal from '@/Core/components/common/Modal';
import Table from '@/Core/components/common/Table/CoreTable';
import Text from '@/Core/components/common/Text/Text';
import { convertDate, formatDate } from '@/Core/utils/formatDate';
import tw from 'twin.macro';
import CompareDate from './CompareDate';

const RegistrantionTimePage = () => {
	const [handleSetTime] = usePutSetTimeMutation();
	const campus = useSelector((state) => state.campus);
	const { data: semester } = useGetAllSemestersQuery({ campus_id: campus?.currentCampus?._id });
	const { defaultSemester } = useSelector((state) => state.semester);
	const [selectedSemester, setSelectedSemester] = useState({});
	useEffect(() => {
		setSelectedSemester(defaultSemester);
	}, [defaultSemester]);
	const handleChangeSemester = (id) => {
		setSelectedSemester(semester?.listSemesters.find((item) => item._id === id));
	};
	const { data, isLoading } = useGetAllSetTimeQuery(
		{ semester_id: selectedSemester?._id },
		{ refetchOnMountOrArgChange: true }
	);
	const [tableData, setTableData] = useState([]);
	useEffect(() => {
		setTableData(data?.time);
	}, [data]);
	const [modal, setModal] = useState(false);
	const [modalData, setModalData] = useState({});

	const handleClick = (form, data) => {
		if (!form) {
			setModalData(data);
			reset({});
		} else {
			setModalData(form);
			reset({
				startTime: moment(form.startTime).format('YYYY-MM-DD'),
				endTime: moment(form.endTime).format('YYYY-MM-DD')
			});
		}
		setModal(!modal);
	};

	const { handleSubmit, control, reset } = useForm({
		resolver: yupResolver(registrantionTimeSchema)
	});

	const onSubmit = async (value) => {
		const result = modalData._id
			? await handleSetTime({
					_id: modalData._id,
					typeName: modalData.typeName,
					typeNumber: modalData.typeNumber,
					startTime: moment(value.startTime).valueOf(),
					endTime: moment(value.endTime).valueOf()
			  })
			: await handleSetTime({
					typeName: modalData.typeName,
					typeNumber: modalData.typeNumber,
					startTime: moment(value.startTime).valueOf(),
					endTime: moment(value.endTime).valueOf()
			  });
		if (result.error) {
			toast.error(`Cập nhật ${modalData.typeName} thất bại!`);
		} else {
			toast.success(`Cập nhật ${modalData.typeName} thành công!`);
		}
		setModal(!modal);
	};

	return (
		<Fragment>
			<Box>
				<Item>
					<SelectBox>
						<Text
							as='label'
							htmlFor='semester-list'
							className='inline-flex items-center gap-2 whitespace-nowrap text-base-content'>
							<CalendarDaysIcon className='h-6 w-6' /> Kỳ học
						</Text>
						<Select
							className='min-w-[12rem] capitalize sm:text-sm'
							onChange={(e) => handleChangeSemester(e.target.value)}>
							{Array.isArray(semester?.listSemesters) &&
								semester?.listSemesters.map((item, index) => (
									<Option value={item._id} key={index} selected={selectedSemester?._id === item._id}>
										{item.name}
									</Option>
								))}
						</Select>
					</SelectBox>
				</Item>
				<Item className='text-base-content'>
					Thời gian kỳ:{' '}
					<Text className='font-medium'>{selectedSemester && formatDate(selectedSemester?.start_time)}</Text> -{' '}
					<Text className='font-medium'>{selectedSemester && formatDate(selectedSemester?.end_time)}</Text>
				</Item>
			</Box>
			<Table>
				<Table.Header>
					<Table.Row>
						<Table.Cell as='th'>Loại hình đặt thời gian</Table.Cell>
						<Table.Cell as='th'>Thời gian bắt đầu</Table.Cell>
						<Table.Cell as='th'>Thời gian kết thúc</Table.Cell>
						<Table.Cell as='th'>Trạng thái</Table.Cell>
						<Table.Cell as='th'>Hành động</Table.Cell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{isLoading ? (
						<Table.Pending prepareRows={5} prepareCols={5} />
					) : (
						TimesConfig &&
						TimesConfig.map((item, index) => (
							<Table.Row key={index}>
								<Table.Cell>{item.typeName}</Table.Cell>
								<Table.Cell>
									{tableData &&
										formatDate(tableData?.find((i) => i.typeNumber === item.typeNumber)?.startTime)}
								</Table.Cell>
								<Table.Cell>
									{tableData && formatDate(tableData?.find((i) => i.typeNumber === item.typeNumber)?.endTime)}
								</Table.Cell>
								<Table.Cell>
									{tableData && (
										<CompareDate
											start={tableData?.find((i) => i.typeNumber === item.typeNumber)?.startTime}
											end={tableData?.find((i) => i.typeNumber === item.typeNumber)?.endTime}
										/>
									)}
								</Table.Cell>
								<Table.Cell>
									<Button
										disabled={selectedSemester?._id !== defaultSemester?._id}
										size='xs'
										variant={selectedSemester?._id !== defaultSemester?._id ? 'disabled' : 'success'}
										onClick={() =>
											handleClick(
												tableData.find((i) => i.typeNumber === item.typeNumber),
												{ typeName: item.typeName, typeNumber: item.typeNumber }
											)
										}>
										Cập nhật
									</Button>
								</Table.Cell>
							</Table.Row>
						))
					)}
				</Table.Body>
			</Table>
			<Modal openState={modal} onOpenStateChange={setModal} title='Đặt thời gian'>
				<Modal.Form onSubmit={handleSubmit(onSubmit)}>
					<InputFieldControl
						type='date'
						control={control}
						name='startTime'
						label='Start date'
						min={convertDate(selectedSemester?.start_time)}
						max={convertDate(selectedSemester?.end_time)}
					/>
					<InputFieldControl
						type='date'
						control={control}
						name='endTime'
						label='End date'
						min={convertDate(selectedSemester?.start_time)}
						max={convertDate(selectedSemester?.end_time)}
					/>
					<Button type='submit' variant='primary' icon={ClockIcon}>
						Đặt thời gian
					</Button>
				</Modal.Form>
			</Modal>
		</Fragment>
	);
};

const Box = tw.div`flex justify-between items-center mb-8 bg-gray-50 px-3 py-4`;
const Item = tw.div``;
const SelectBox = tw.div`flex basis-1/4 items-center gap-2`;
Modal.Form = tw.form`grid gap-6 min-w-[384px]`;

export default RegistrantionTimePage;
