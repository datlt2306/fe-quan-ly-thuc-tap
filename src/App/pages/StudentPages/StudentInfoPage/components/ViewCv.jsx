import Button from '@/Core/components/common/Button';
import { VerticalList } from '..';

import { InternSupportType } from '@/App/constants/studentConstants';
import tw from 'twin.macro';

import FormRequestSupport from './FormRequestSupport';

const ItemValue = tw.p`font-medium`;
const ViewCv = ({ data: user, setOpenState }) => {
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
				<>
					{user?.support === 1 ? (
						<>
							<p className='pr-1 '>
								Công ty: <span tw='font-medium'>{user?.business?.name}</span>
							</p>
							<div className='mt-3 flex items-center'>
								<p className='pr-1'>CV:</p>
								<Button onClick={() => window.open(user?.['CV'])}>Xem</Button>
							</div>
						</>
					) : user?.support === 0 ? (
						<div className='flex flex-col gap-3'>
							<Flex>
								<p>Tên công ty:</p>
								<ItemValue>{user?.nameCompany}</ItemValue>
							</Flex>
							<Flex>
								<p>Địa chỉ thực tập:</p>
								<ItemValue>{user?.addressCompany}</ItemValue>
							</Flex>
							<Flex>
								<p>Mã số thuế:</p>
								<ItemValue>{user?.taxCode}</ItemValue>
							</Flex>
							<Flex>
								<p>Chức vụ người tiếp nhận:</p>
								<ItemValue>{user?.position}</ItemValue>
							</Flex>
							<Flex>
								<p>SĐT doanh nghiệp:</p>
								<ItemValue>{user?.phoneNumberCompany}</ItemValue>
							</Flex>
							<Flex>
								<p>Email người tiếp nhận:</p>
								<ItemValue>{user?.emailEnterprise}</ItemValue>
							</Flex>
						</div>
					) : null}
				</>
			)
		}
	];

	return (
		<>
			<VerticalList>
				{dataFormInterShip.map((item) => (
					<li key={item.label} className='flex items-center gap-1'>
						<div>{item.label}</div>
						<span className='font-medium'>{item.value}</span>
					</li>
				))}

				<FormRequestSupport formType='narrow' setOpenState={setOpenState} />
			</VerticalList>
		</>
	);
};
const Flex = tw.div`flex gap-1`;
export default ViewCv;
