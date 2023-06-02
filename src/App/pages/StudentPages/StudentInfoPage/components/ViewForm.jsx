import { VerticalList } from '..';

import Button from '@/Core/components/common/Button';
import { InternSupportType } from '@/App/constants/studentConstants';
import formatDate from '@/Core/utils/formatDate';
import FormRequestSupport from './FormRequestSupport';
const ViewForm = ({ data: user, setOpenState }) => {
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
		{ label: 'Chuyên ngành:', value: user?.major?.name },
		{ label: 'Vị trí thực tập:', value: user?.dream },
		{ label: 'Ngày bắt đầu:', value: formatDate(user?.internshipTime) },
		{
			label: 'Biên bản thực tập:',
			value: (
				<>
					{user?.['form'] && (
						<Button variant='outline' onClick={() => window.open(user?.['form'])}>
							Xem
						</Button>
					)}
				</>
			)
		}
	];

	return (
		<>
			<VerticalList>
				{dataViewForm.map((item, index) => (
					<li key={index} className='flex items-center gap-3'>
						<p>{item.label}</p> <span className='font-medium'>{item.value || 'Chưa có thông tin'}</span>
					</li>
				))}
				<FormRequestSupport formType='form' setOpenState={setOpenState} />
			</VerticalList>
		</>
	);
};
export default ViewForm;
