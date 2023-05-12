import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Menu } from "@headlessui/react";
import { Suspense, lazy } from "react";
import { useGetStudentQuery } from "@/App/providers/apis/studentsApi";
import { useGetAllCompanyQuery } from "@/App/providers/apis/businessApi";
import { StudentStatusEnum, StudentStatusGroup } from "@/Core/constants/studentStatus";
import { useGetSetTimeQuery } from "@/App/providers/apis/configTimesApi";
import Button from "@/Core/components/common/Button";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import ModalLoading from "@/Core/components/common/Loading/ModalLoading";
import tw from "twin.macro";
import { supportOptionsEnum } from "@/Core/constants/supportOptionsEnum";
import axiosClient from "@/Core/configs/axiosConfig";
const ViewReport = lazy(() => import("./Modal/ViewReport"));
const ViewForm = lazy(() => import("./Modal/ViewForm"));
const ViewCv = lazy(() => import("./Modal/ViewCv"));

const Modal = lazy(() => import("@/Core/components/common/Modal"));

export const VerticalList = (props) => (
	<ul {...props} tw="flex flex-col gap-3">
		{props.children}
	</ul>
);

const StudentInfoPage = () => {
	const user = useSelector((state) => state.auth?.user);
	const [dateNow] = useState(Date.now());
	const [openState, setOpenState] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const [title, setTitle] = useState("");
	const [data, setData] = useState([]);
	const getIntershipStatusStyle = (value) => {
		let status;
		Object.keys(StudentStatusGroup).forEach((groupKey) => {
			if (StudentStatusGroup[groupKey].includes(value)) {
				status = groupKey;
			}
		});
		return status;
	};
	useEffect(() => {
		const getStudentById = async () => {
			try {
				const studentData = await axiosClient.get(`/student/${user?.id}`);
				// console.log('student',studentData);
				setData(studentData);
			} catch (error) {
				console.log(error);
			}
		};
		getStudentById();
	}, []);
	// const { data, isFetching } = useGetStudentQuery(user.id);
	const { data: business } = useGetAllCompanyQuery();
	const string = `typeNumber=${1}&semester_id=${user?.smester_id}&campus_id=${user?.campus_id}`;
	const { data: timeForm } = useGetSetTimeQuery(string);
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
			value: (
				<>
					{/* {StudentStatusEnum.map((status, index) =>
						status.value === data?.statusCheck ? (
							<span className={status.color}>
								{status.title}
							</span>
						) : (
							""
						)
					)} */}
					{
						<span className={`text-${getIntershipStatusStyle(data?.statusCheck)}`}>
							{StudentStatusEnum[data?.statusCheck]}
						</span>
					}
				</>
			),
		},
	];

	const formSubmittedRoute = [
		{
			condition: user?.CV,
			label: "Form Đăng ký Thực Tập",
			content: (
				<ViewCv setOpenState={setOpenState} data={data} supportOptions={supportOptionsEnum} />
			),
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
			<section className="mb-8  grid grid-cols-2 sm:grid-cols-1  ">
				<div tw="border-r-2 sm:(border-r-0 border-b-2 pb-4 border-r-0)  ">
					<VerticalList className="text-gray-500">
						<h1 className="mb-5  text-lg font-medium text-primary">Thông Tin Đăng Ký</h1>
						{dataRegisterInfomation.map((item) => (
							<li key={item.label} className="flex gap-1 ">
								{item.label}
								<p className="font-medium"> {item.value}</p>
							</li>
						))}
					</VerticalList>
				</div>

				<div tw="ml-8 sm:(pt-4 ml-0)">
					<h1 className="mb-5 text-lg font-medium  text-primary">Các Form Đã Nộp</h1>
					<div className="mt-8 flex flex-col  gap-3 ">
						<Menu>
							{formSubmittedRoute.map((item) => (
								<Menu.Item
									key={item.label}
									className="w-full  rounded-md p-3 text-start hover:bg-gray-100  hover:text-primary">
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
					</div>
				</div>
			</section>

			<section className="border-b-2 py-6">
				<h1 className=" my-2 text-lg font-bold text-primary">Thông tin tuyển dụng</h1>
				{timeForm?.time?.startTime <= dateNow && dateNow <= timeForm?.time.endTime ? (
					<ReactTable columns={columnsData} data={business?.list ?? []} />
				) : (
					<p>Chưa có thông tin tuyển dụng</p>
				)}
			</section>
			<section className="mt-3">
				<div>
					<label
						htmlFor="message"
						className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
						Ghi Chú
					</label>
					<textarea
						id="message"
						rows={4}
						className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						defaultValue={user?.note}
						disabled
					/>
				</div>
			</section>
			{openState && (
				<Suspense fallback={<ModalLoading />}>
					<Modal
						max_height="650"
						openState={openState}
						onOpenStateChange={setOpenState}
						title={title}>
						{modalContent}
					</Modal>
				</Suspense>
			)}
		</>
	);
};

export default StudentInfoPage;
