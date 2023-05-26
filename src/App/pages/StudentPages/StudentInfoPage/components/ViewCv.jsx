import Button from '@/Core/components/common/Button';
import { useRequestOfStudentMutation } from '@/App/providers/apis/requestStudentsApi';
import { toast } from 'react-toastify';
import { VerticalList } from '..';

import { InternSupportType } from '@/App/constants/studentConstants';
import tw from 'twin.macro';

import FormRequestSupport from './FormRequestSupport';

const ItemValue = tw.p`font-medium`;
const ViewCv = ({ data, setOpenState, nameMajor }) => {
	const dataFormInterShip = [
		{ label: 'Kiểu đăng ký :', value: InternSupportType[+data?.support] ?? null },
		{ label: 'Mã sinh viên :', value: data?.mssv },
		{ label: 'Họ tên :', value: data?.name },
		{ label: 'Email:', value: data?.email },
		{ label: 'Số điện thoại:', value: data?.phoneNumber },
		{ label: 'Địa chỉ:', value: data?.address },
		{ label: 'Chuyên ngành:', value: nameMajor },
		{ label: 'Vị trí thực tập:', value: data?.dream },
		{
			label: (
				<>
					{data?.support === 1 ? (
						<>
							<p className='pr-1 '>
								Công ty: <span tw='font-medium'>:{data?.business?.name}</span>
							</p>
							<div className='mt-3 flex items-center'>
								<p className='pr-1'>CV:</p>
								<Button onClick={() => window.open(data?.['CV'])}>Xem</Button>
							</div>
						</>
					) : data?.support === 0 ? (
						<div className='flex flex-col gap-3'>
							<Flex>
								<p>Tên công ty:</p>
								<ItemValue>{data?.nameCompany}</ItemValue>
							</Flex>
							<Flex>
								<p>Địa chỉ thực tập:</p>
								<ItemValue>{data?.addressCompany}</ItemValue>
							</Flex>
							<Flex>
								<p>Mã số thuế:</p>
								<ItemValue>{data?.taxCode}</ItemValue>
							</Flex>
							<Flex>
								<p>Chức vụ người tiếp nhận:</p>
								<ItemValue>{data?.position}</ItemValue>
							</Flex>
							<Flex>
								<p>SĐT doanh nghiệp:</p>
								<ItemValue>{data?.phoneNumberCompany}</ItemValue>
							</Flex>
							<Flex>
								<p>Email người tiếp nhận:</p>
								<ItemValue>{data?.emailEnterprise}</ItemValue>
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
