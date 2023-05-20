import { InternSupportType, StudentStatusEnum, StudentStatusGroupEnum } from '@/App/constants/studentStatus';
import { useGetAllMajorQuery } from '@/App/providers/apis/majorApi';
import { useGetOneStudentQuery } from '@/App/providers/apis/studentApi';
import Button from '@/Core/components/common/Button';
import LoadingProgressBar from '@/Core/components/common/Loading/LoadingProgressBar';
import { Menu } from '@headlessui/react';
import { Suspense, lazy, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import tw from 'twin.macro';

const ViewReport = lazy(() => import('./components/ViewReport'));
const ViewForm = lazy(() => import('./components/ViewForm'));
const ViewCv = lazy(() => import('./components/ViewCv'));
const Modal = lazy(() => import('@/Core/components/common/Modal'));

export const VerticalList = (props) => (
	<ul {...props} tw='flex flex-col gap-3'>
		{props.children}
	</ul>
);

const StudentInfoPage = () => {
	const user = useSelector((state) => state.auth?.user);
	const [nameMajor, setNameMajor] = useState(null);
	const [openState, setOpenState] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const [title, setTitle] = useState('');

	const { data, isFetching } = useGetOneStudentQuery(user?.id, {
		refetchOnMountOrArgChange: true
	});
	const { data: allMajor } = useGetAllMajorQuery();

	useEffect(() => {
		const findMajor = allMajor?.find((item) => item?.majorCode == data?.majorCode);
		setNameMajor(findMajor?.name);
	}, [allMajor, data?.majorCode]);

	const dataRegisterInfomation = [
		{ label: 'Họ và tên :', value: data?.name },
		{ label: 'Khóa học :', value: data?.course },
		{ label: 'Ngành học :', value: nameMajor },

		{ label: 'Email :', value: data?.email },
		{
			label: 'Lựa chọn :',
			value: data?.support ? InternSupportType[data?.support] : 'Chưa có thông tin'
		},
		{
			label: 'Công ty đã chọn :',
			value: data?.support === 1 ? data?.business?.name : data?.support === 0 ? data?.nameCompany : 'Chưa có thông tin'
		},
		{
			label: 'Trạng thái sinh viên :',
			value: <>{<span className={`text-${handleGetInternStatusStyle(data?.statusCheck)}`}>{StudentStatusEnum[data?.statusCheck]}</span>}</>
		}
	];

	const formSubmittedRoute = [
		{
			condition: data?.CV,
			label: 'Form Đăng ký Thực Tập',
			content: <ViewCv setOpenState={setOpenState} data={data} nameMajor={nameMajor} />
		},
		{
			condition: data?.form,
			label: 'Form Biên Bản',
			content: <ViewForm data={data} nameMajor={nameMajor} />
		},
		{
			condition: data?.report,
			label: 'Form Báo Cáo',
			content: <ViewReport data={data} nameMajor={nameMajor} />
		}
	];
	return (
		<>
			<WrapLayoutInfoUser>
				<LayoutInfoUser>
					<VerticalList className='text-gray-500'>
						<Title>Thông Tin Đăng Ký</Title>
						{dataRegisterInfomation.map((item) => (
							<li key={item.label} className='flex gap-1 '>
								{item.label}
								<Text>{item.value}</Text>
							</li>
						))}
					</VerticalList>
				</LayoutInfoUser>

				<LayoutFormSubmitted>
					<Title>Các Form Đã Nộp</Title>
					<WrapMenu>
						<Menu>
							{!(data?.CV || data?.form || data?.report) && <div className='font-medium'>Chưa có form nào được nộp</div>}
							{formSubmittedRoute.map((item) => (
								<Menu.Item key={item.label} className='w-full  rounded-md p-3 text-start hover:bg-gray-100  hover:text-primary'>
									<>
										{item.condition && (
											<Button
												onClick={() => {
													setModalContent(item.content);
													setTitle(item.label);
													setOpenState(true);
												}}>
												{item.label}
											</Button>
										)}
									</>
								</Menu.Item>
							))}
						</Menu>
					</WrapMenu>
				</LayoutFormSubmitted>
			</WrapLayoutInfoUser>

			<RenderNote label='Ghi chú' data={data} />

			{openState && (
				<Suspense fallback={<LoadingProgressBar />}>
					<Modal openState={openState} onOpenStateChange={setOpenState} title={title}>
						{modalContent}
					</Modal>
				</Suspense>
			)}
		</>
	);
};
const Title = tw.h1`mb-5  text-lg font-medium text-primary`;
const Text = tw.p`font-medium`;
const WrapMenu = tw.div`mt-8 flex flex-col  gap-3`;
const RenderNote = ({ label, data }) => (
	<>
		<label tw='mb-2 block text-sm font-medium text-gray-900 dark:text-white'>{label}</label>
		<textarea
			id='message'
			rows={4}
			tw='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:(placeholder-gray-400 border-gray-600 bg-gray-700 text-white)'
			defaultValue={data?.note}
			disabled
		/>
	</>
);
const handleGetInternStatusStyle = (value) => {
	let style = null;
	const checkstyle = Object.entries(StudentStatusGroupEnum).map(([k, v]) => {
		const findItem = v.find((item) => StudentStatusEnum[value] == item);
		if (findItem) {
			style = k;
			return;
		}
	});
	return style;
};
const WrapLayoutInfoUser = tw.section`mb-8  grid grid-cols-2 sm:grid-cols-1 `;
const LayoutInfoUser = tw.div`border-r-2 sm:(border-r-0 border-b-2 pb-4 border-r-0)`;
const LayoutFormSubmitted = tw.div`ml-8 sm:(pt-4 ml-0)`;
export default StudentInfoPage;
