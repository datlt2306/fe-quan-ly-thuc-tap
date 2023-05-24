import useCountdown from '@/App/hooks/useCountdown';
import { memo, useEffect } from 'react';
import DateTimeDisplay from './DateTimeDisplay ';
// import "./style/CountDownStyle.css";
import ExpiredNotice from './ExpiredNotice';

const ShowCounter = ({ days, hours, minutes, seconds }) => {
	return (
		<div className='flex rounded-md bg-gray-100 p-4'>
			<div className='flex gap-2'>
				<div>Thời gian đăng ký còn lại</div>
				<DateTimeDisplay value={days} type={'Ngày'} />
				<p>:</p>
				<DateTimeDisplay value={hours} type={'Giờ'} />
				<p>:</p>
				<DateTimeDisplay value={minutes} type={'Phút'} />
				<p>:</p>
				<DateTimeDisplay value={seconds} type={'Giây'} />
			</div>
		</div>
	);
};

const CountdownTimer = ({ targetDate }) => {
	const [days, hours, minutes, seconds, countdownControllers] = useCountdown(targetDate);
	useEffect(() => {
		countdownControllers.startCountdown();
	}, [countdownControllers]);
	if (days + hours + minutes + seconds <= 0) {
		return <ExpiredNotice />;
	} else {
		return <ShowCounter days={days} hours={hours} minutes={minutes} seconds={seconds} />;
	}
};

export default memo(CountdownTimer);
