import useCountdown from '@/App/hooks/useCountdown';
import Text from '@/Core/components/common/Text/Text';
import { ClockIcon } from '@heroicons/react/24/outline';
import { memo, useEffect } from 'react';
import tw from 'twin.macro';
import EmptyStateSection from '../../Shared/EmptyStateSection';

const CountdownTimer = ({ targetDate }) => {
	const [days, hours, minutes, seconds, countdownControllers] = useCountdown(targetDate);
	useEffect(() => {
		countdownControllers.startCountdown();
	}, [countdownControllers]);
	if (days + hours + minutes + seconds <= 0)
		return (
			<EmptyStateSection icon={ClockIcon} title='Form đăng ký chưa mở' message='Sinh viên vui lòng quay lại sau.' />
		);
	else
		return (
			<Box>
				<Text>Thời gian đăng ký còn lại:</Text>
				<Text className='text-lg font-medium tracking-wide'>
					{days} ngày : {hours} giờ : {minutes} phút : {seconds} giây
				</Text>
			</Box>
		);
};

const Box = tw.div`flex items-center gap-2 bg-gray-100 p-4`;

export default memo(CountdownTimer);
