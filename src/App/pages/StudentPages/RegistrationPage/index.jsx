import { lazy, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import tw from 'twin.macro';

import InputFieldControl from '@/Core/components/common/FormControl/InputFieldControl';
import SelectFieldControl from '@/Core/components/common/FormControl/SelectFieldControl';
import LoadingProgressBar from '@/Core/components/common/Loading/LoadingProgressBar';
import { useCallback, useState } from 'react';
import CountdownTimer from './components/CountdownTimer';
import ExpiredNotice from './components/ExpiredNotice';
<<<<<<< HEAD
import { RegistrationType } from './constants/RegistrationType';
=======
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec

import { useGetAllCompanyQuery } from '@/App/providers/apis/businessApi';
import { useGetSetTimeQuery } from '@/App/providers/apis/configTimesApi';
import { useGetAllMajorQuery } from '@/App/providers/apis/majorApi';
import { useGetOneStudentQuery } from '@/App/providers/apis/studentApi';

<<<<<<< HEAD
=======
import { InternSupportType } from '@/App/constants/studentStatus';

>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec
const Input = tw.input`block w-full rounded-md border-0 duration-300 px-2.5 py-1.5 text-gray-900 outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6`;

const FormSchoolSupport = lazy(() => import('./components/FormSchoolSupport'));
const FormSelfFinding = lazy(() => import('./components/FormSelfFinding'));

<<<<<<< HEAD
const labelItems = [
	{
		label: 'Nhờ nhà trường hỗ trợ',
		value: RegistrationType.SchoolSupport
	},
	{
		label: 'Tự tìm nơi thực tập',
		value: RegistrationType.SelfFinding
	}
];
=======
const labelItems = Object.entries(InternSupportType).map(([key, value]) => {
	return {
		label: key == 0 ? 'Tự tìm nơi thực tập' : value,
		value: key
	};
});
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec

const RegistrationPage = () => {
	const user = useSelector((state) => state.auth?.user);

	const [selectedOption, setSelectedOption] = useState(null);
	const [deadline, setDeadLine] = useState(null);
	const { data: business } = useGetAllCompanyQuery();
	const { data: majors } = useGetAllMajorQuery();
	const { data: student } = useGetOneStudentQuery(user?.id);
<<<<<<< HEAD
	const { data: times, isLoading } = useGetSetTimeQuery({ typeNumber: selectedOption || 0 }, { refetchOnMountOrArgChange: true });
=======
	const { data: times, isLoading } = useGetSetTimeQuery(
		{ typeNumber: selectedOption || 0 },
		{ refetchOnMountOrArgChange: true }
	);
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec

	useEffect(() => {
		if (times?.time) {
			setDeadLine(times?.time);
		}
	}, [times]);

	//xử lý nếu nhân viên mở thêm form đăng ký
	useEffect(() => {
		if (student?.listTimeForm && student?.listTimeForm.length > 0) {
<<<<<<< HEAD
			const checkTimeStudent = student?.listTimeForm.find(
				(item) => item.typeNumber == RegistrationType.SelfFinding || item.typeNumber == RegistrationType.SchoolSupport
			);
=======
			const checkTimeStudent = student?.listTimeForm.find((item) => item.typeNumber == 0 || item.typeNumber == 1);
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec
			setDeadLine(checkTimeStudent);
		}
	}, [times, selectedOption, student?.listTimeForm]);

	const handleChangeForm = (value) => {
		setSelectedOption(value);
	};

	const sharedFields = useCallback((control) => {
		return [
			{
				content: (
					<div>
						<label>Họ và tên</label>
						<Input className='mt-2' readOnly value={student?.name}></Input>
					</div>
				)
			},
			{
				content: (
					<div>
						<label>Mã sinh viên</label>
						<Input className='mt-2' readOnly value={student?.mssv}></Input>
					</div>
				)
			},
			{
<<<<<<< HEAD
				content: <InputFieldControl label='Số điện thoại' control={control} name='phoneNumber' placeholder='Số điện thoại' />
=======
				content: (
					<InputFieldControl
						label='Số điện thoại'
						control={control}
						name='phoneNumber'
						placeholder='Số điện thoại'
					/>
				)
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec
			},
			{
				content: <InputFieldControl label='Địa chỉ' control={control} name='address' placeholder='Địa chỉ' />
			},
			{
				content: (
					<SelectFieldControl
						label='Chuyên ngành'
						className='w-full'
						initialValue='Chọn chuyên ngành'
						control={control}
						name='major'
						options={Array.isArray(majors) ? majors.map((item) => ({ value: item._id, label: item.name })) : []}
					/>
				)
			},
			{
				content: (
					<InputFieldControl
						label='Vị trí thực tập'
						control={control}
						name='dream'
						placeholder='VD: Web Back-end, Dựng phim, Thiết kế nội thất'
					/>
				)
			}
		];
	}, []);

<<<<<<< HEAD
	const deadlineCheck = deadline && deadline.endTime > new Date().getTime() && deadline.startTime < new Date().getTime();
=======
	const deadlineCheck =
		deadline && deadline.endTime > new Date().getTime() && deadline.startTime < new Date().getTime();
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec

	if (isLoading) {
		return <div>... Đang tải dữ liệu</div>;
	}
<<<<<<< HEAD

=======
	if (student?.CV || student?.nameCompany) {
		return <div>Bạn đã nộp form đăng ký thực tập</div>;
	}
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec
	return (
		<>
			{deadlineCheck ? <CountdownTimer targetDate={deadline?.endTime} /> : <ExpiredNotice />}
			{deadlineCheck && (
				<>
					<Layout>
						<RegistrationTypeCol>Kiểu đăng ký</RegistrationTypeCol>
						{labelItems.map((item, index) => (
							<LabelLayout key={index}>
<<<<<<< HEAD
								<input type='radio' name='radio' defaultValue={item.value} onClick={() => handleChangeForm(item.value)} />
=======
								<input
									type='radio'
									name='radio'
									defaultValue={item.value}
									onClick={() => handleChangeForm(item.value)}
								/>
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec
								<TitleForm>{item.label}</TitleForm>
							</LabelLayout>
						))}
					</Layout>

					<Suspense fallback={<LoadingProgressBar />}>
<<<<<<< HEAD
						{selectedOption == RegistrationType.SchoolSupport && (
							<FormSchoolSupport fields={sharedFields} business={business} selectedOption={selectedOption} user={student} />
						)}
						{selectedOption == RegistrationType.SelfFinding && (
=======
						{selectedOption == 1 && (
							<FormSchoolSupport
								fields={sharedFields}
								business={business}
								selectedOption={selectedOption}
								user={student}
							/>
						)}
						{selectedOption == 0 && (
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec
							<FormSelfFinding fields={sharedFields} selectedOption={selectedOption} user={student} />
						)}
					</Suspense>
				</>
			)}
		</>
	);
};

const RegistrationTypeCol = tw.div`flex col-span-2 font-medium text-lg`;
const LabelLayout = tw.label`inline-flex items-center`;
const TitleForm = tw.span`ml-2 font-medium`;

export const Layout = tw.div`flex gap-7 py-6 items-center `;

export default RegistrationPage;
