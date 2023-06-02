import Button from '@/Core/components/common/Button';
import { VerticalList } from '..';

import { InternSupportType } from '@/App/constants/studentConstants';
import tw from 'twin.macro';

import FormRequestSupport from './FormRequestSupport';
import { Fragment } from 'react';

const ItemValue = tw.p`font-medium`;
const ViewCv = ({ data: user, setOpenState }) => {
	const dataInfoCompany = [
		{ label: 'Tên công ty:', value: user?.nameCompany },
		{ label: 'Địa chỉ thực tập:', value: user?.addressCompany },
		{ label: 'Mã số thuế:', value: user?.taxCode },
		{ label: 'Chức vụ người tiếp nhận:', value: user?.position },
		{ label: 'SĐT doanh nghiệp:', value: user?.phoneNumberCompany },
		{ label: 'Tên người tiếp nhận:', value: user?.nameEnterprise },
		{ label: 'Email người tiếp nhận:', value: user?.emailEnterprise }
	];
	const dataFormInterShip = [
		{ label: 'Kiểu đăng ký :', value: InternSupportType[+user?.support] ?? null },
		{ label: 'Mã sinh viên :', value: user?.mssv },
		{ label: 'Họ tên :', value: user?.name },
		{ label: 'Email:', value: user?.email },
		{ label: 'Số điện thoại:', value: user?.phoneNumber },
		{ label: 'Địa chỉ:', value: user?.address },
		{ label: 'Chuyên ngành:', value: user?.major?.name },
		{ label: 'Vị trí thực tập:', value: user?.dream },
		{
			label: (
				<Fragment>
					{user?.support == 1 && (
						<>
							<p className='pr-1 '>
								Công ty: <span tw='font-medium'>{user?.business?.name}</span>
							</p>
							<div className='mt-3 flex items-center'>
								<p className='pr-1'>CV:</p>
								<Button variant='outline' onClick={() => window.open(user?.['CV'])}>
									Xem
								</Button>
							</div>
						</>
					)}
					{user?.support == 0 && (
						<div className='flex flex-col gap-3'>
							{dataInfoCompany?.map((item) => (
								<Flex>
									<p>{item.label}</p>
									<ItemValue>{item.value || 'Chưa có thông tin'}</ItemValue>
								</Flex>
							))}
						</div>
					)}
				</Fragment>
			)
		}
	];

	return (
		<>
			<VerticalList>
				{dataFormInterShip.map((item) => (
					<Fragment>
						<li key={item.label} className='flex items-center gap-1'>
							<div>{item.label}</div>
							<span className='font-medium'>{item.value}</span>
						</li>
					</Fragment>
				))}

				<FormRequestSupport formType='narrow' setOpenState={setOpenState} />
			</VerticalList>
		</>
	);
};

const Flex = tw.div`flex gap-1`;
export default ViewCv;
