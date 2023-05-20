/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import Button from '@/Core/components/common/Button';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { requestOfStudentValidator } from '@/App/schemas/requestStudentSchema.js';
import { useState } from 'react';
import { useRequestOfStudentMutation } from '@/App/providers/apis/requestStudentsApi';
import { toast } from 'react-toastify';
import { VerticalList } from '..';
import TextAreaFieldControl from '@/Core/components/common/FormControl/TextAreaFieldControl';
import { InternSupportType } from '@/App/constants/studentStatus';
import tw from 'twin.macro';
const ItemValue = tw.p`font-medium`;
const ViewCv = ({ data, setOpenState, nameMajor }) => {
	const [open, setOpen] = useState(false);
	const [requestOfStudentMutation, { isLoading }] = useRequestOfStudentMutation();
	const user = useSelector((state) => state.auth?.user);
	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(requestOfStudentValidator)
	});
	const onSubmit = async ({ description }) => {
		const response = await requestOfStudentMutation({
			type: 'narrow',
			description: description,
			userId: user?._id
		});
		setOpenState(false);
		if (response?.error) {
			toast.error('Đã có lỗi xảy ra');
			return;
		}
		toast.success('Gửi yêu cầu hỗ trợ thành công');
	};
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

				<form onSubmit={handleSubmit(onSubmit)}>
					{open && (
						<>
							<TextAreaFieldControl control={control} name='description' />
							<div className='mt-2 flex justify-between'>
								<Button
									variant='error'
									className='hover:bg-red-600'
									onClick={() => {
										setOpen(false);
										reset();
									}}>
									Huỷ
								</Button>
								<Button variant='secondary' className='hover:bg-gray-300' onClick={() => setOpen(true)}>
									Gửi
								</Button>
							</div>
						</>
					)}

					{!open && (
						<Button variant='primary' className='mt-3 w-full' onClick={() => setOpen(true)}>
							Gửi yêu cầu hỗ trợ
						</Button>
					)}
				</form>
			</VerticalList>
		</>
	);
};
const Flex = tw.div`flex gap-1`;
export default ViewCv;
