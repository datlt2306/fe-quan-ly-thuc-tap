import { InternSupportType } from '@/App/constants/studentConstants';
import Button from '@/Core/components/common/Button';
import Text from '@/Core/components/common/Text/Text';
import { EyeIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { List } from '..';
import FormRequestSupport from './FormRequestSupport';

const ViewCv = ({ data: user, setOpenState }) => {
	const dataInfoCompany = [
		{ label: 'Tên công ty:', value: user?.nameCompany },
		{ label: 'Địa chỉ thực tập:', value: user?.addressCompany },
		{ label: 'Mã số thuế:', value: user?.taxCode },
		{ label: 'Chức vụ người tiếp nhận:', value: user?.position },
		{ label: 'SĐT doanh nghiệp:', value: user?.phoneNumberCompany },
		{ label: 'Tên người tiếp nhận:', value: user?.employer },
		{ label: 'Email người tiếp nhận:', value: user?.emailEnterprise }
	];
	const dataFormInterShip = [
		{ label: 'Kiểu đăng ký', value: InternSupportType[+user?.support] ?? null },
		{ label: 'Mã sinh viên', value: user?.mssv },
		{ label: 'Họ tên', value: user?.name },
		{ label: 'Email', value: user?.email },
		{ label: 'Số điện thoại', value: user?.phoneNumber },
		{ label: 'Địa chỉ', value: user?.address },
		{ label: 'Chuyên ngành', value: user?.major?.name },
		{ label: 'Vị trí thực tập', value: user?.dream }
	];

	return (
		<Fragment>
			<List className='w-full max-w-xl'>
				{dataFormInterShip.map((item) => (
					<List.Item key={item.label}>
						<Text>{item.label}</Text>
						<Text className='font-medium text-base-content-active'>{item.value}</Text>
					</List.Item>
				))}
				{user?.support === 1 ? (
					<Fragment>
						<List.Item>
							<Text>Công ty</Text>
							<Text className='font-medium text-base-content-active'>{user?.business?.name}</Text>
						</List.Item>
						<List.Item>
							<Text>CV</Text>
							<Button as='a' href={user?.CV} target='_blank' shape='pill'>
								<EyeIcon className='h-4 w-4' /> Preview
							</Button>
						</List.Item>
					</Fragment>
				) : user?.support === 0 ? (
					<Fragment>
						{dataInfoCompany?.map((item) => (
							<List.Item>
								<Text>{item.label}</Text>
								<Text className='font-medium text-base-content-active'>
									{item.value || 'Chưa có thông tin'}
								</Text>
							</List.Item>
						))}
					</Fragment>
				) : null}
			</List>
			<FormRequestSupport formType='narrow' setOpenState={setOpenState} />
		</Fragment>
	);
};
export default ViewCv;
