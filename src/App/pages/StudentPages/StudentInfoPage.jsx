import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Menu } from "@headlessui/react";
import { Suspense, lazy } from "react";
import { useGetStudentQuery } from "@/App/providers/apis/studentsApi";
import { useGetAllCompanyQuery } from "@/App/providers/apis/businessApi";
import { StudentStatusEnum, StudentStatusGroupEnum } from "@/Core/constants/studentStatus";
import { useGetSetTimeQuery } from "@/App/providers/apis/configTimesApi";
import Button from "@/Core/components/common/Button";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import ModalLoading from "@/Core/components/common/Loading/ModalLoading";
import tw from "twin.macro";
import { supportOptionsEnum } from "@/Core/constants/supportOptionsEnum";
const ViewReport = lazy(() => import("./Modal/ViewReport"));
const ViewForm = lazy(() => import("./Modal/ViewForm"));
const ViewCv = lazy(() => import("./Modal/ViewCv"));
const Modal = lazy(() => import("@/Core/components/common/Modal"));

export const VerticalList = (props) => (
	<ul {...props} tw="flex flex-col gap-3">
		{props.children}
	</ul>
);
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

const StudentInfoPage = () => {
	const user = useSelector((state) => state.auth?.user);
	const [dateNow] = useState(Date.now());
	const [openState, setOpenState] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const [title, setTitle] = useState("");
	const getIntershipStatusStyle = (value) => {
		let status;
		Object.keys(StudentStatusGroupEnum).forEach((groupKey) => {
			if (StudentStatusGroupEnum[groupKey].includes(value)) {
				status = groupKey;
			}
		});
		return status;
	};

	const { data, isFetching } = useGetStudentQuery(user?.id);
	const { data: business } = useGetAllCompanyQuery();

	const { data: timeForm } = useGetSetTimeQuery({
		typeNumber: 1,
		semester_id: user?.smester_id,
		campus_id: user?.campus_id,
	});

	const columnsData = useMemo(
		() => [
			{
				Header: "Mã",
				accessor: "code_request",
			},
			{
				Header: "Tên doanh nghiệp",
				accessor: "name",
			},
			{
				Header: "Chuyên ngành",
				accessor: "major",
			},
			{
				Header: "Vị trí TT",
				accessor: "internshipPosition",
			},
			{
				Header: "Yêu cầu",
				accessor: "request",
			},
			{
				Header: "Quyền lợi",
				accessor: "benefish",
			},
			{
				Header: "Số lượng",
				accessor: "amount",
			},
			{
				Header: "Địa chỉ",
				accessor: "address",
			},

			{
				Header: "Chi tiết",
				accessor: "description",
			},
		],
		[]
	);
	const dataRegisterInfomation = [
		{ label: "Họ và tên :", value: data?.name },
		{ label: "Khóa học :", value: data?.course },
		{ label: "Ngành học :", value: data?.majors?.name },

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
			value: <>{<span className={`text-${getIntershipStatusStyle(data?.statusCheck)}`}>{StudentStatusEnum[data?.statusCheck]}</span>}</>,
		},
	];

	const formSubmittedRoute = [
		{
			condition: user?.CV,
			label: "Form Đăng ký Thực Tập",
			content: <ViewCv setOpenState={setOpenState} data={data} supportOptions={supportOptionsEnum} />,
		},
		{
			condition: user?.form,
			label: "Form Biên Bản",
			content: <ViewForm data={data} />,
		},
		{
			condition: user?.report,
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
						{isFetching && <div>...Đang tải dữ liệu</div>}
						{!isFetching &&
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
					<ReactTable columns={columnsData} data={business?.list ?? []} />
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

export default StudentInfoPage;
