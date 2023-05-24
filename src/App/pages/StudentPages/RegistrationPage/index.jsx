/* eslint-disable react/prop-types */
import { lazy, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import tw from 'twin.macro';

import { useState } from 'react';
import CountdownTimer from './components/CountdownTimer';
import ExpiredNotice from './components/ExpiredNotice';

import { useGetAllCompanyQuery } from '@/App/providers/apis/businessApi';
import { useGetSetTimeQuery } from '@/App/providers/apis/configTimesApi';
import { useGetAllMajorQuery } from '@/App/providers/apis/majorApi';
import { useGetOneStudentQuery } from '@/App/providers/apis/studentApi';

import { InternSupportType } from '@/App/constants/studentStatus';

import LoadingProgressBar from '@/Core/components/common/Loading/LoadingProgressBar';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import { Radio } from '@/Core/components/common/FormControl/RadioFieldControl';
import Typography from '@/Core/components/common/Text/Typography';
const FormSchoolSupport = lazy(() => import('./components/FormSchoolSupport'));
const FormSelfFinding = lazy(() => import('./components/FormSelfFinding'));

const labelItems = Object.entries(InternSupportType).map(([key, value]) => {
	return {
		label: key == 0 ? 'Tự tìm nơi thực tập' : value,
		value: key
	};
});
const FormElement = (props) => {
	const { student, majors, business, selectedOption, handleChangeForm, deadlineCheck, deadline } = props;
	return (
		<>
			{deadlineCheck ? <CountdownTimer targetDate={deadline?.endTime} /> : <ExpiredNotice />}
			{deadlineCheck && (
				<>
					<Layout>
						{labelItems.map((item, index) => (
							<RadioGroup key={index}>
								<Radio name='radio' value={item.value} onChange={() => handleChangeForm(item.value)} />
								<TitleForm>{item.label}</TitleForm>
							</RadioGroup>
						))}
					</Layout>

					<Suspense fallback={<LoadingProgressBar />}>
						{selectedOption == 1 && (
							<FormSchoolSupport
								majors={majors}
								business={business}
								selectedOption={selectedOption}
								user={student}
							/>
						)}
						{selectedOption == 0 && (
							<FormSelfFinding majors={majors} selectedOption={selectedOption} user={student} />
						)}
					</Suspense>
				</>
			)}
		</>
	);
};
const RegistrationPage = () => {
	const user = useSelector((state) => state.auth?.user);

	const [selectedOption, setSelectedOption] = useState(null);
	const [deadline, setDeadLine] = useState(null);
	const { data: business } = useGetAllCompanyQuery();
	const { data: majors } = useGetAllMajorQuery();
	const { data: student } = useGetOneStudentQuery(user?.id);
	const { data: times, isLoading } = useGetSetTimeQuery(
		{ typeNumber: selectedOption || 0 },
		{ refetchOnMountOrArgChange: true }
	);

	useEffect(() => {
		if (times?.time) {
			setDeadLine(times?.time);
		}
	}, [times]);

	//xử lý nếu nhân viên mở thêm form đăng ký
	useEffect(() => {
		if (student?.listTimeForm && student?.listTimeForm.length > 0) {
			const checkTimeStudent = student?.listTimeForm.find((item) => item.typeNumber == 0 || item.typeNumber == 1);
			setDeadLine(checkTimeStudent);
		}
	}, [times, selectedOption, student?.listTimeForm]);

	const handleChangeForm = (value) => {
		setSelectedOption(value);
	};
	//check thời hạn hoạt động của form từ lúc bắt đầu đến lúc kết thúc nếu thời gian hiện tại nằm trong khoảng thời gian này thì mới hiện form
	const deadlineCheck =
		deadline && deadline.endTime > new Date().getTime() && deadline.startTime < new Date().getTime();

	if (isLoading) {
		return (
			<div className='flex items-center justify-center gap-2'>
				<LoadingSpinner variant={'primary'} size='sm' />
			</div>
		);
	}
	return student?.listTimeForm?.length > 0 ? (
		<FormElement
			student={student}
			majors={majors}
			business={business}
			selectedOption={selectedOption}
			handleChangeForm={handleChangeForm}
			deadlineCheck={deadlineCheck}
			deadline={deadline}
		/>
	) : student?.CV || student?.nameCompany ? (
		<Typography level={6}>Bạn đã nộp form đăng ký thực tập!</Typography>
	) : (
		<FormElement
			student={student}
			majors={majors}
			business={business}
			selectedOption={selectedOption}
			handleChangeForm={handleChangeForm}
			deadlineCheck={deadlineCheck}
			deadline={deadline}
		/>
	);
};

const RadioGroup = tw.label`inline-flex items-center`;
const TitleForm = tw.span`ml-2 font-medium`;

export const Layout = tw.div`flex gap-7 py-6 items-center `;
export default RegistrationPage;
