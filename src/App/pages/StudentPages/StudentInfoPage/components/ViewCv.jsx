import Button from '@/Core/components/common/Button';
import { List } from '..';
import { InternSupportType } from '@/App/constants/studentConstants';
import tw from 'twin.macro';
import FormRequestSupport from './FormRequestSupport';
import { Fragment } from 'react';
import Text from '@/Core/components/common/Text/Text';
import { EyeIcon } from '@heroicons/react/24/outline';

const ViewCv = ({ data: user, setOpenState }) => {
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
						<List.Item>
							<Text>Tên công ty</Text>
							<Text className='font-medium text-base-content-active'>{user?.nameCompany}</Text>
						</List.Item>
						<List.Item>
							<Text>Địa chỉ thực tập</Text>
							<Text className='font-medium text-base-content-active'>{user?.addressCompany}</Text>
						</List.Item>
						<List.Item>
							<Text>Mã số thuế:</Text>
							<Text className='font-medium text-base-content-active'>{user?.taxCode}</Text>
						</List.Item>
						<List.Item>
							<Text>Chức vụ người tiếp nhận</Text>
							<Text className='font-medium text-base-content-active'>{user?.position}</Text>
						</List.Item>
						<List.Item>
							<Text>SĐT doanh nghiệp</Text>
							<Text className='font-medium text-base-content-active'>{user?.phoneNumberCompany}</Text>
						</List.Item>
						<List.Item>
							<Text>Email người tiếp nhận</Text>
							<Text className='font-medium text-base-content-active'>{user?.emailEnterprise}</Text>
						</List.Item>
					</Fragment>
				) : null}
			</List>
			<FormRequestSupport formType='narrow' setOpenState={setOpenState} />
		</Fragment>
	);
};
export default ViewCv;
