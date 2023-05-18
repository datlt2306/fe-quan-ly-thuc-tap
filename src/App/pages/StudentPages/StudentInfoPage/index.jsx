import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Menu } from "@headlessui/react";
import { Suspense, lazy } from "react";
import { useGetOneStudentQuery } from "@/App/providers/apis/studentApi";
import { useGetAllCompanyQuery } from "@/App/providers/apis/businessApi";
import { StudentStatusEnum, StudentStatusGroupEnum } from "@/Core/constants/studentStatus";
import { useGetSetTimeQuery } from "@/App/providers/apis/configTimesApi";
import { useGetAllMajorQuery } from "@/App/providers/apis/majorApi";

import Button from "@/Core/components/common/Button";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import ModalLoading from "@/Core/components/common/Loading/ModalLoading";
import tw from "twin.macro";
import { supportOptionsEnum } from "@/Core/constants/supportOptionsEnum";
import { useEffect } from "react";
const ViewReport = lazy(() => import("./components/ViewReport"));
const ViewForm = lazy(() => import("./components/ViewForm"));
const ViewCv = lazy(() => import("./components/ViewCv"));
const Modal = lazy(() => import("@/Core/components/common/Modal"));

export const VerticalList = (props) => (
	<ul {...props} tw="flex flex-col gap-3">
		{props.children}
	</ul>
);

const StudentInfoPage = () => {
	const user = useSelector((state) => state.auth?.user);
	const [dateNow] = useState(Date.now());
	const [nameMajor, setNameMajor] = useState(null);
	const [openState, setOpenState] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const [title, setTitle] = useState("");

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

	const { data, isFetching } = useGetOneStudentQuery(user?.id);
	const { data: business } = useGetAllCompanyQuery();
	const { data: timeForm } = useGetSetTimeQuery({
		typeNumber: 1,
		campus_id: data?.campus_id,
	},{refetchOnMountOrArgChange:true});
	const { data: allMajor } = useGetAllMajorQuery();

	useEffect(() => {
		const findMajor = allMajor?.find((item) => item?.majorCode == data?.majorCode);
		setNameMajor(findMajor?.name);
	}, [allMajor, data?.majorCode]);
	const columnsData = useMemo(
		() => [
			{
				Header: "Mã",
				accessor: "business_code",
			},
			{
				Header: "Tên doanh nghiệp",
				accessor: "name",
			},
			{
				Header: "Vị trí TT",
				accessor: "internship_position",
			},
			{
				Header: "Số lượng",
				accessor: "amount",
			},
			{
				Header: "Yêu cầu",
				accessor: "requirement",
			},
			{
				Header: "Quyền lợi",
				accessor: "benefit",
			},
			{
				Header: "Chuyên ngành",
				accessor: "major.name",
			},
			{
				Header: "Mô tả",
				accessor: "description",
			},
			{
				Header: "Địa chỉ",
				accessor: "address",
			},
		],
		[]
	);
	const dataRegisterInfomation = [
		{ label: "Họ và tên :", value: data?.name },
		{ label: "Khóa học :", value: data?.course },
		{ label: "Ngành học :", value: nameMajor },

		{ label: "Email :", value: data?.email },
		{
			label: "Lựa chọn :",
			value: data?.support ? supportOptionsEnum[data?.support] : null,
		},
		{
			label: "Công ty đã chọn :",
			value: data?.support === 1 ? data?.business?.name : data?.nameCompany,
		},
		{
			label: "Trạng thái sinh viên :",
			value: <>{<span className={`text-${handleGetInternStatusStyle(data?.statusCheck)}`}>{StudentStatusEnum[data?.statusCheck]}</span>}</>,
		},
	];

	const formSubmittedRoute = [
		{
			condition: data?.CV,
			label: "Form Đăng ký Thực Tập",
			content: <ViewCv setOpenState={setOpenState} data={data} supportOptions={supportOptionsEnum} />,
		},
		{
			condition: data?.form,
			label: "Form Biên Bản",
			content: <ViewForm data={data} />,
		},
		{
			condition: data?.report,
			label: "Form Báo Cáo",
			content: <ViewReport data={data} />,
		},
	];
	return (
		<>
			<WrapLayoutInfoUser>
				<LayoutInfoUser>
					<VerticalList className="text-gray-500">
						<Title>Thông Tin Đăng Ký</Title>
						{
							dataRegisterInfomation.map((item) => (
								<li key={item.label} className="flex gap-1 ">
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
							{formSubmittedRoute.map((item) => (
								<Menu.Item key={item.label} className="w-full  rounded-md p-3 text-start hover:bg-gray-100  hover:text-primary">
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

			<LayoutInfoRecruitment>
				<Title>Thông tin tuyển dụng</Title>
				{timeForm?.time?.startTime <= dateNow && dateNow <= timeForm?.time.endTime ? (
					<ReactTable
						noDataComponent={
							<tr>
								<td>Empty</td>
							</tr>
						}
						columns={columnsData}
						data={business?.list ?? []}
					/>
				) : (
					<Text>Chưa có thông tin tuyển dụng</Text>
				)}
			</LayoutInfoRecruitment>

			<RenderNote label="Ghi chú" data={data} />

			{openState && (
				<Suspense fallback={<ModalLoading />}>
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
		<label tw="mb-2 block text-sm font-medium text-gray-900 dark:text-white">{label}</label>
		<textarea
			id="message"
			rows={4}
			tw="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:(placeholder-gray-400 border-gray-600 bg-gray-700 text-white)"
			defaultValue={data?.note}
			disabled
		/>
	</>
);
const WrapLayoutInfoUser = tw.section`mb-8  grid grid-cols-2 sm:grid-cols-1 `;
const LayoutInfoUser = tw.div`border-r-2 sm:(border-r-0 border-b-2 pb-4 border-r-0)`;
const LayoutFormSubmitted = tw.div`ml-8 sm:(pt-4 ml-0)`;
const LayoutInfoRecruitment = tw.section`border-b-2 py-6 mb-6`;
export default StudentInfoPage;
