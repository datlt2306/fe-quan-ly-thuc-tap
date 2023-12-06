import { StaffPaths } from '@/App/configs/route-paths.config';
import Modal from '@/Core/components/common/Modal';
import Text from '@/Core/components/common/Text/Text';
import Typography from '@/Core/components/common/Text/Typography';
import BrowserMockup from '@/Core/components/customs/BrowserMockup';
import { ArrowTopRightOnSquareIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import tw from 'twin.macro';
import Step2_1 from '@/App/assets/images/step-2.1.png';
import Step2_2 from '@/App/assets/images/step-2.2.png';
import Step2_3 from '@/App/assets/images/step-2.3.png';
import { ViewContext } from '../context/ViewContext';
import Box from '@/Core/components/common/Box';

const Instruction = () => {
	const [image, setImage] = useState(null);
	const [open, setOpen] = useState(false);
	const { firstStepRef, secondStepRef, thirdStepRef } = useContext(ViewContext);

	const handleOpenImage = (e) => {
		setImage(e.target.src);
		setOpen(!open);
	};

	return (
		<>
			<Box className='flex flex-col gap-20 overflow-y-auto scrollbar-none'>
				<Typography level={6} fontWeight='semibold' textAlign='center' className='inline-flex items-center gap-3'>
					<PaperClipIcon className='h-5 w-5' /> Hướng dẫn lấy mật khẩu ứng dụng
				</Typography>

				<Box ref={firstStepRef} className='mb-10' id='step-1'>
					<Text className='mb-2 block font-semibold'>Bước 1</Text>
					<Text className='block font-normal'>
						Truy cập{' '}
						<a
							href='https://myaccount.google.com'
							target='_blank'
							className='font-semibold transition-colors duration-200 hover:text-primary'>
							Google Accounts
						</a>{' '}
						và đăng nhập với email của bạn.
					</Text>
					<Text className='font-normal italic'>
						(*) Nếu bạn chưa bật "Xác mính 2 bước" có thể xem{' '}
						<a
							href='https://support.google.com/accounts/answer/185839?hl=vi&co=GENIE.Platform%3DDesktop'
							target='_blank'
							className='font-semibold transition-colors duration-200 hover:text-primary'>
							hướng dẫn
						</a>{' '}
						tại đây
					</Text>
				</Box>

				<Box ref={secondStepRef} className='mb-10 flex flex-col space-y-10' id='step-2'>
					<Box>
						<Text className='mb-2 block font-semibold'>Bước 2</Text>
						<Text className='mb-10 font-normal'>Lấy mật khẩu ứng dụng</Text>
					</Box>

					<Box className='mb-20 flex flex-col gap-1'>
						<BrowserMockup url='https://myaccount.google.com/'>
							<Image src={Step2_1} loading='lazy' className='max-w-full' onClick={handleOpenImage} />
						</BrowserMockup>
						<Description>Đi đến tab "Bảo mật", chọn "Xác minh 2 bước"</Description>
					</Box>

					<Box className='mb-20 flex flex-col gap-1'>
						<BrowserMockup url='https://myaccount.google.com/'>
							<Image src={Step2_2} loading='lazy' className='max-w-full' onClick={handleOpenImage} />
						</BrowserMockup>
						<Description>Kéo xuống, chọn "Mật khẩu ứng dụng"</Description>
					</Box>

					<Box className='mb-20 flex flex-col gap-1'>
						<BrowserMockup url='https://myaccount.google.com/'>
							<Image src={Step2_3} loading='lazy' className='max-w-full' onClick={handleOpenImage} />
						</BrowserMockup>
						<Description>Nhập tên ứng dụng, click nút "Tạo" để tạo mật khẩu ứng dụng</Description>
					</Box>
				</Box>

				<Box ref={thirdStepRef} id='step-3' className='flex min-h-[25vh] flex-col space-y-2'>
					<Text className='block font-semibold'>Bước 3</Text>
					<Text as='p' className='mb-10 font-normal'>
						Copy mật khẩu ứng dụng đã tạo, đi đến trang cài đặt và paste mật khẩu trước đó và lưu lại.
					</Text>
					<Link className='btn btn-sm btn-primary w-fit' to={StaffPaths.SETTINGS}>
						<ArrowTopRightOnSquareIcon className='h-4 w-4' /> Đi đến cài đặt
					</Link>
				</Box>
			</Box>
			<Modal
				openState={open}
				onOpenStateChange={setOpen}
				panelProps={{ className: '!p-0 rounded-lg overflow-clip' }}>
				<BrowserMockup url='https://myaccount.google.com/' className='border-none'>
					<Image src={image} className='w-full max-w-7xl xl:max-w-[1440px]' />
				</BrowserMockup>
			</Modal>
		</>
	);
};

const Image = tw.img`object-cover cursor-pointer`;
const Description = tw.small`italic text-base-content`;

export default Instruction;
