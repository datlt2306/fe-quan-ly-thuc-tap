import { InternSupportType, StudentStatusEnum, StudentStatusGroupEnum } from '@/App/constants/studentConstants';
import { useGetOneStudentQuery } from '@/App/providers/apis/studentApi';
import Badge from '@/Core/components/common/Badge';
import Button from '@/Core/components/common/Button';
import LoadingProgressBar from '@/Core/components/common/Loading/LoadingProgressBar';
import Text from '@/Core/components/common/Text/Text';
import Typography from '@/Core/components/common/Text/Typography';
import { Menu } from '@headlessui/react';
import { DocumentTextIcon, IdentificationIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Fragment, Suspense, lazy, useState } from 'react';
import { useSelector } from 'react-redux';
import tw from 'twin.macro';
import EmptyStateSection from '../Shared/EmptyStateSection';
import LoadingData from '../Shared/LoadingData';
const ViewReport = lazy(() => import('./components/ViewReport'));
const ViewForm = lazy(() => import('./components/ViewForm'));
const ViewCv = lazy(() => import('./components/ViewCv'));
const Modal = lazy(() => import('@/Core/components/common/Modal'));

const handleGetInternStatusStyle = (value) => {
	let style = null;
	Object.entries(StudentStatusGroupEnum).map(([k, v]) => {
		const findItem = v.find((item) => StudentStatusEnum[value] == item);
		if (findItem) {
			style = k;
			return;
		}
	});
	return style;
};

const StudentInfoPage = () => {
	const user = useSelector((state) => state.auth?.user);
	const [openState, setOpenState] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const [title, setTitle] = useState('');

	const { data, isLoading } = useGetOneStudentQuery(user?.id, {
		refetchOnMountOrArgChange: true
	});

	const dataRegisterInfomation = [
		{ label: 'Họ và tên', value: data?.name },
		{ label: 'Khóa học', value: data?.course },
		{ label: 'Ngành học', value: data?.major?.name },

		{ label: 'Email', value: data?.email },
		{
			label: 'Lựa chọn',
			value: data?.support == 1 || data?.support == 0 ? InternSupportType[data?.support] : 'Chưa có thông tin'
		},
		{
			label: 'Công ty đã chọn',
			value:
				data?.support === 1 ? data?.business?.name : data?.support === 0 ? data?.nameCompany : 'Chưa có thông tin'
		},
		{
			label: 'Trạng thái sinh viên',
			value: (
				<>
					{
						<Badge size='md' variant={handleGetInternStatusStyle(data?.statusCheck)}>
							{StudentStatusEnum[data?.statusCheck]}
						</Badge>
					}
				</>
			)
		}
	];

	const formSubmittedRoute = [
		{
			condition: data?.CV || data?.nameCompany,
			label: 'Form Đăng ký Thực Tập',
			content: <ViewCv setOpenState={setOpenState} data={data} />
		},
		{
			condition: data?.form,
			label: 'Form Biên Bản',
			content: <ViewForm setOpenState={setOpenState} data={data} />
		},
		{
			condition: data?.report,
			label: 'Form Báo Cáo',
			content: <ViewReport setOpenState={setOpenState} data={data} />
		}
	];
	if (isLoading) {
		return <LoadingData />;
	}
	return (
		<Fragment>
			<Grid>
				<Grid.Col>
					<Typography level={6} className='inline-flex items-center gap-2'>
						<IdentificationIcon className='h-6 w-6' /> Thông tin sinh viên
					</Typography>
					<List className='py-3 text-base-content'>
						{dataRegisterInfomation.map((item) => (
							<List.Item key={item.label}>
								<Text>{item.label}</Text>
								<Text className='font-medium'>{item.value}</Text>
							</List.Item>
						))}
					</List>
				</Grid.Col>

				<Grid.Col>
					{!(data?.CV || data?.form || data?.report || data?.nameCompany) ? (
						<EmptyStateSection
							title='Bạn chưa nộp form nào.'
							message='Thông tin chi tiết các form sẽ được hiển thị sau khi đăng ký thành công.'
						/>
					) : (
						<Fragment>
							<Typography level={6} className='inline-flex items-center gap-2'>
								<DocumentTextIcon className='h-6 w-6' /> Các form đã nộp
							</Typography>
							<Menu as={'ol'} className='flex w-full flex-col gap-1 py-3'>
								{formSubmittedRoute.map((item) => (
									<Menu.Item as='li' key={item.label} className='w-full'>
										{item.condition && (
											<Button
												variant='primary'
												className='w-full'
												onClick={() => {
													setModalContent(item.content);
													setTitle(item.label);
													setOpenState(true);
												}}>
												{item.label}
											</Button>
										)}
									</Menu.Item>
								))}
							</Menu>
						</Fragment>
					)}
				</Grid.Col>
			</Grid>

			<div className='bg-gray-50 p-4'>
				<Typography level={6} className='flex items-center gap-1  text-lg font-medium '>
					<PencilSquareIcon className='h-5 w-5' />
					Ghi chú
				</Typography>
				<TextNote>{data?.note}</TextNote>
			</div>

			{openState && (
				<Suspense fallback={<LoadingProgressBar />}>
					<Modal openState={openState} onOpenStateChange={setOpenState} title={title}>
						<Modal.Content>{modalContent}</Modal.Content>
					</Modal>
				</Suspense>
			)}
		</Fragment>
	);
};

const TextNote = tw.div`mt-2 h-52 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-200`;
const Grid = tw.section`mb-8 grid grid-cols-[1.5fr,1fr] divide-x divide-gray-200`;
const List = tw.ul`flex flex-col divide-y divide-gray-100`;
Grid.Col = tw.div`divide-y divide-gray-200 flex flex-col [&>*]:p-3`;
List.Item = tw.li`py-2 px-1 inline-grid grid-cols-2 items-baseline`;
Modal.Content = tw.div`min-w-[576px] w-full max-w-full`;

export { List };
export default StudentInfoPage;
