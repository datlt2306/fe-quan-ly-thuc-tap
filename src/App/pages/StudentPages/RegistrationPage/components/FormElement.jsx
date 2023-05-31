import { Suspense, useState, useEffect, useCallback, useMemo, lazy, Fragment } from 'react';
import tw from 'twin.macro';

import LoadingData from '../../Shared/LoadingData';
import ExpiredNotice from './ExpiredNotice';
import CountdownTimer from './CountdownTimer';

import { Radio } from '@/Core/components/common/FormControl/RadioFieldControl';
import LoadingProgressBar from '@/Core/components/common/Loading/LoadingProgressBar';

import { useGetSetTimeQuery } from '@/App/providers/apis/configTimesApi';
import { useGetAllMajorQuery } from '@/App/providers/apis/majorApi';
import { InternSupportType } from '@/App/constants/studentConstants';

const FormSchoolSupport = lazy(() => import('./FormSchoolSupport'));
const FormSelfFinding = lazy(() => import('./FormSelfFinding'));

const labelItems = Object.entries(InternSupportType).map(([key, value]) => {
	return {
		label: key == 0 ? 'Tự tìm nơi thực tập' : value,
		value: key
	};
});
const FormElement = ({ student }) => {
	const [selectedOption, setSelectedOption] = useState(null);

	const [deadline, setDeadLine] = useState(null);
	const { data: times, isLoading } = useGetSetTimeQuery(
		{ typeNumber: selectedOption || 0 },
		{ refetchOnMountOrArgChange: true }
	);

	useEffect(() => {
		if (times?.time) {
			setDeadLine(times?.time);
		}
	}, [times]);

	//click vào form nào thì lấy value của form đó
	const handleFormChange = useCallback((value) => {
		setSelectedOption(value);
	}, []);

	//check thời hạn hoạt động của form từ lúc bắt đầu đến lúc kết thúc nếu thời gian hiện tại nằm trong khoảng thời gian này thì mới hiện form
	const deadlineCheck = useMemo(() => {
		if (deadline) {
			return deadline.endTime > new Date().getTime() && deadline.startTime < new Date().getTime();
		}
		return false;
	}, [deadline]);

	if (isLoading) {
		return <LoadingData />;
	}
	return (
		<Fragment>
			{deadlineCheck ? <CountdownTimer targetDate={deadline?.endTime} /> : <ExpiredNotice />}
			{deadlineCheck && (
				<Fragment>
					<Layout>
						{labelItems.map((item, index) => (
							<RadioGroup key={index}>
								<Radio name='radio' value={item.value} onChange={() => handleFormChange(item.value)} />
								<TitleForm>{item.label}</TitleForm>
							</RadioGroup>
						))}
					</Layout>

					<Suspense fallback={<LoadingProgressBar />}>
						{selectedOption == 1 && <FormSchoolSupport selectedOption={selectedOption} user={student} />}
						{selectedOption == 0 && <FormSelfFinding selectedOption={selectedOption} user={student} />}
					</Suspense>
				</Fragment>
			)}
		</Fragment>
	);
};

const RadioGroup = tw.label`inline-flex items-center`;
const TitleForm = tw.span`ml-2 font-medium`;
const Layout = tw.div`flex gap-7 py-6 items-center `;
export default FormElement;
