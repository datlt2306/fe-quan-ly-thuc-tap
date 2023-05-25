/* eslint-disable react/prop-types */
import { VerticalList } from '..';

import Button from '@/Core/components/common/Button';
import { InternSupportType } from '@/App/constants/studentConstants';
import formatDate from '@/Core/utils/formatDate';

const ViewForm = ({ data: user, nameMajor }) => {
	const dataViewForm = [
		{
			label: 'Kiểu đăng ký:',
			value: InternSupportType[+user?.support] ?? null
		},
		{ label: 'Mã sinh viên:', value: user?.mssv },
		{ label: 'Họ tên:', value: user?.name },
		{ label: 'Email:', value: user?.email },
		{ label: 'Số điện thoại:', value: user?.phoneNumber },
		{ label: 'Địa chỉ:', value: user?.address },
		{ label: 'Chuyên ngành:', value: nameMajor },
		{ label: 'Vị trí thực tập:', value: user?.dream },
		{ label: 'Ngày bắt đầu:', value: formatDate(user?.internshipTime) },
		{
			label: 'Biên bản thực tập:',
			value: <>{user?.['form'] && <Button onClick={() => window.open(user?.['form'])}>Xem</Button>}</>
		}
	];
	return (
		<>
			<VerticalList>
				{dataViewForm.map((item, index) => (
					<li key={index} className='flex items-center gap-3'>
						<p>{item.label}</p> <span className='font-medium'>{item.value}</span>
					</li>
				))}
			</VerticalList>
		</>
	);
};
export default ViewForm;
