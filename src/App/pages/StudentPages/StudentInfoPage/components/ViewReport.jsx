import formatDate from '@/Core/utils/formatDate';
import { List } from '..';
import Button from '@/Core/components/common/Button';
import FormRequestSupport from './FormRequestSupport';
import Text from '@/Core/components/common/Text/Text';
import { EyeIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

const ViewReport = ({ data: user, setOpenState }) => {
	const initDataViewReport = [
		{ label: 'Họ tên:', value: user?.name },
		{
			label: 'Tên công ty:',
			value: user?.business?.name || user?.nameCompany
		},
		{ label: 'Điểm kết quả:', value: user?.resultScore },
		{ label: 'Điểm thái độ:', value: user?.attitudePoint },
		{ label: 'Thời gian bắt đầu:', value: formatDate(user?.internshipTime) },
		{ label: 'Thời gian kết thúc:', value: formatDate(user?.endInternShipTime) },
		{
			label: 'Báo cáo:',
			value: user?.['report'] && (
				<Button as='a' href={user?.report} target='_blank' size='sm' variant='outline' icon={EyeIcon}>
					Preview
				</Button>
			)
		}
	];
	return (
		<Fragment>
			<List className='mb-6'>
				{initDataViewReport.map((item, index) => (
					<List.Item key={index}>
						<Text>{item.label}</Text>
						<Text className='font-medium'>{item.value || "Chưa có thông tin"}</Text>
					</List.Item>
				))}
			</List>
			<FormRequestSupport formType='report' setOpenState={setOpenState} />
		</Fragment>
	);
};
export default ViewReport;
