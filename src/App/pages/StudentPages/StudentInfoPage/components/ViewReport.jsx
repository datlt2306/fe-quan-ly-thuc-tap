import formatDate from '@/Core/utils/formatDate';
import { VerticalList } from '..';
import Button from '@/Core/components/common/Button';

const ViewReport = ({ data: user }) => {
	const initDataViewReport = [
		{ label: 'Họ tên:', value: user?.name },
		{
			label: 'Tên công ty:',
			value: user?.support === 1 ? user?.business?.name : user?.nameCompany
		},
		{ label: 'Điểm kết quả:', value: user?.resultScore },
		{ label: 'Điểm thái độ:', value: user?.attitudePoint },
		{ label: 'Thời gian bắt đầu:', value: formatDate(user?.internshipTime) },
		{ label: 'Thời gian kết thúc:', value: formatDate(user?.endInternShipTime) },
		{
			label: 'Báo cáo:',
			value: <>{user?.['report'] && <Button onClick={() => window.open(user?.['report'])}>Xem</Button>}</>
		}
	];
	return (
		<VerticalList>
			{initDataViewReport.map((item, index) => (
				<li key={index} className='flex items-center gap-2'>
					<p>{item.label}</p> <div className='font-medium'>{item.value}</div>
				</li>
			))}
		</VerticalList>
	);
};
export default ViewReport;
