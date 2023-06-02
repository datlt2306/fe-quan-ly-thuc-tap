import { List } from '..';

import Button from '@/Core/components/common/Button';
import { InternSupportType } from '@/App/constants/studentConstants';
import formatDate from '@/Core/utils/formatDate';
import FormRequestSupport from './FormRequestSupport';
import Text from '@/Core/components/common/Text/Text';
import { EyeIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
const ViewForm = ({ data: user, setOpenState }) => {
	const dataViewForm = [
		{
			label: 'Kiểu đăng ký',
			value: InternSupportType[+user?.support] ?? null
		},
		{ label: 'Mã sinh viên', value: user?.mssv },
		{ label: 'Họ tên', value: user?.name },
		{ label: 'Email', value: user?.email },
		{ label: 'Số điện thoại', value: user?.phoneNumber },
		{ label: 'Địa chỉ', value: user?.address },
		{ label: 'Chuyên ngành', value: user?.major?.name },
		{ label: 'Vị trí thực tập', value: user?.dream },
		{ label: 'Ngày bắt đầu', value: formatDate(user?.internshipTime) },
		{
			label: 'Biên bản thực tập:',
			value: user?.['form'] && (
				<Button variant='outline' size='sm' as='a' href={user?.form} target='_blank' icon={EyeIcon}>
					Preview
				</Button>
			)
		}
	];

	return (
		<Fragment>
			<List className='mb-6 divide-y divide-gray-100'>
				{dataViewForm.map((item, index) => (
					<List.Item key={index}>
						<Text>{item.label}</Text> <Text className='font-medium text-base-content-active'>{item.value}</Text>
					</List.Item>
				))}
			</List>
			<FormRequestSupport formType='form' setOpenState={setOpenState} />
		</Fragment>
	);
};
export default ViewForm;
