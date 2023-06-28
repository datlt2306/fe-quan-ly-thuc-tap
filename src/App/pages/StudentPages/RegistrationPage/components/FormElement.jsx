import { Fragment, Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { InternSupportType } from '@/App/constants/studentConstants';
import { useGetSetTimeQuery } from '@/App/store/apis/configTimesApi';
import { Radio } from '@/Core/components/common/FormControl/RadioFieldControl';
import LoadingProgressBar from '@/Core/components/common/Loading/LoadingProgressBar';
import Text from '@/Core/components/common/Text/Text';
import EmptyStateSection from '../../Shared/EmptyStateSection';
import LoadingData from '../../Shared/LoadingData';
import CountdownTimer from './CountdownTimer';
import tw from 'twin.macro';
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
		if (student?.support) {
			setSelectedOption(student?.support);
		}
	}, [student?.support]);

	useEffect(() => {
		if (times?.time) {
			setDeadLine(times?.time);
		}
	}, [times]);
	//Click vào form nào thì lấy value của form đó
	const handleFormChange = useCallback((value) => {
		setSelectedOption(value);
	}, []);

	//Check thời hạn hoạt động của form từ lúc bắt đầu đến lúc kết thúc nếu thời gian hiện tại nằm trong khoảng thời gian này thì mới hiện form
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
			{deadlineCheck ? (
				<CountdownTimer targetDate={deadline?.endTime} />
			) : (
				<EmptyStateSection title='Form đăng ký chưa mở' message='Sinh viên vui lòng quay lại đăng ký sau.' />
			)}
			{deadlineCheck && (
				<Container>
					<SelectBox>
						{labelItems.map((item, index) => (
							<RadioGroup key={index}>
								<Radio
									name='radio'
									id={index}
									value={item.value}
									disabled={student?.support == 1 && true}
									checked={student?.support || selectedOption === item.value}
									onChange={() => handleFormChange(item.value)}
								/>
								<Text as='label' level={6} className='text-base' htmlFor={index}>
									{item.label}
								</Text>
							</RadioGroup>
						))}
					</SelectBox>

					<Suspense fallback={<LoadingProgressBar />}>
						{selectedOption == 1 && <FormSchoolSupport selectedOption={selectedOption} user={student} />}
						{selectedOption == 0 && <FormSelfFinding selectedOption={selectedOption} user={student} />}
					</Suspense>
				</Container>
			)}
		</Fragment>
	);
};

const Container = tw.div`flex flex-col gap-6`;
const RadioGroup = tw.label`inline-flex items-center gap-2`;
const SelectBox = tw.div`flex gap-8 py-6 items-center`;

export default FormElement;
