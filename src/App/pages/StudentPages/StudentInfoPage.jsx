import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Menu } from "@headlessui/react";
import { Suspense, lazy, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Table from "@/Core/components/common/Table/CoreTable";
import { useGetStudentQuery } from "@/App/providers/apis/studentsApi";
import { useGetBusinessQuery } from "@/App/providers/apis/bussinessApi";
import { StudentStatusEnum } from "@/Core/constants/studentStatus";
import { useGetSetTimeQuery } from "@/App/providers/apis/configTimesApi";
import { useRequestOfStudentMutation } from "@/App/providers/apis/requestStudentsApi";
import Button from "@/Core/components/common/Button";
import ReactTable from "@/Core/components/common/Table/ReactTable";
import ModalLoading from "@/Core/components/common/Loading/ModalLoading";
import formatDate from "@/Core/utils/dateToTime";
import TextAreaFieldControl from "@/Core/components/common/FormControl/TextAreaFieldControl";
import tw from "twin.macro";
import { requestOfStudentValidator } from "@/App/schemas/requestStudentSchema.js";
import { supportOptionsEnum } from "@/Core/constants/supportOptionsEnum";
import axiosClient from "@/Core/configs/axiosConfig";
import { toast } from "react-toastify";

const Modal = lazy(() => import("@/Core/components/common/Modal"));

const VerticalList = (props) => (
	<ul {...props} tw="flex flex-col gap-3">
		{props.children}
	</ul>
);

const StudentInfoPage = () => {
	const user = useSelector((state) => state.auth?.user);
	// console.log(user)
	// const string = `typeNumber=${0}&semester_id=${user?.smester_id}&campus_id=${
	//    user?.campus_id
	//  }`;
	const [openState, setOpenState] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const [title, setTitle] = useState("");

	const { data, isFetching } = useGetStudentQuery(user.id);
	// console.log(data);
	// const { data: business } = useGetBusinessQuery();
	// const { data: times } = useGetSetTimeQuery(string);
	// useEffect(() => {
	// 	const string = `typeNumber=${1}&semester_id=${user?.smester_id}&campus_id=${user?.campus_id}`;
	// 	const url = `/settime/?${string}`;
	// 	axiosClient.get(url);

	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);
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
				Header: "Vị trí TT",
				accessor: "internshipPosition",
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
				Header: "Yêu cầu",
				accessor: "request",
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
			value: supportOptionsEnum[data?.support],
		},
		{
			label: "Công ty đã chọn :",
			value: data?.support === 1 ? data?.business?.name : data?.nameCompany,
		},
		{
			label: "Trạng thái sinh viên :",
			value: (
				<span className="text-primary ">
					{StudentStatusEnum.map((status) =>
						status.value === data?.statusCheck ? status.title : ""
					)}
				</span>
			),
		},
	];

	const viewForm = () => {
		const dataViewForm = [
			{ label: "Kiểu đăng ký:", value: supportOptionsEnum[+data?.support] },
			{ label: "Mã sinh viký:", value: data?.mssv },
			{ label: "Họ tên:", value: data?.name },
			{ label: "Email:", value: data?.email },
			{ label: "Số điện thoại:", value: data?.phoneNumber },
			{ label: "Địa chỉ:", value: data?.address },
			{ label: "Chuyên ngành:", value: data?.narrow?.name },
			{ label: "Vị trí thực tập:", value: data?.dream },
			{ label: "Ngày bắt đầu:", value: formatDate(data?.internshipTime) },
			{ label: "Biên bản thực tập:", value: "Xem" },
		];
		return (
			<>
				<VerticalList>
					{dataViewForm.map((item, index) => (
						<li key={index}>
							{item.label} <span className="font-medium">{item.value}</span>
						</li>
					))}
				</VerticalList>
			</>
		);
	};
	const viewReport = () => {
		const initDataViewReport = [
			{ label: "Họ tên:", value: data?.name },
			{
				label: "Tên công ty:",
				value: data?.support === 1 ? data?.business?.name : data?.nameCompany,
			},
			{ label: "Điểm kết quả:", value: data?.resultScore },
			{ label: "Điểm thái độ:", value: data?.attitudePoint },
			{ label: "Thời gian bắt đầu:", value: formatDate(data?.internshipTime) },
			{ label: "Thời gian kết thúc:", value: formatDate(data?.endInternShipTime) },
			{ label: "Báo cáo:", value: <button></button> },
		];
		return (
			<VerticalList>
				{initDataViewReport.map((item, index) => (
					<li key={index}>
						{item.label} <div className="font-medium">{item.value}</div>
					</li>
				))}
			</VerticalList>
		);
	};

	const formSubmittedRoute = [
		{
			label: "Form Đăng ký Thực Tập",
			content: (
				<ViewCv setOpenState={setOpenState} data={data} supportOptions={supportOptionsEnum} />
			),
		},
		{
			label: "Form Biên Bản",
			content: viewForm(),
		},
		{
			label: "Form Báo Cáo",
			content: viewReport(),
		},
	];

	return (
		<>
			<section className="mb-8  grid grid-cols-2 sm:grid-cols-1 ">
				<div tw=" sm:(border-r-0 border-b-2 pb-4) ">
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
									<Button
										onClick={() => {
											setModalContent(item.content);
											setTitle(item.label);
											setOpenState(true);
										}}>
										{item.label}
									</Button>
								</Menu.Item>
							))}
						</Menu>
					</div>
				</div>
			</section>

			{/* <section className="border-b-2 py-6">
				<h1 className=" text-lg font-bold text-primary my-2">Thông tin tuyển dụng</h1>
				<ReactTable columns={columnsData} data={business.list ?? []} />
			 <p>Chưa có thông tin thực tập</p>
			</section> */}
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
						defaultValue={data?.note}
						disabled
					/>
				</div>
			</section>
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

const ViewCv = ({ data, supportOptions, setOpenState }) => {
	const [open, setOpen] = useState(false);
	const [requestOfStudentMutation, { isLoading }] = useRequestOfStudentMutation();
	const user = useSelector((state) => state.auth?.user);
	// console.log(user);
	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(requestOfStudentValidator),
	});
	const onSubmit = async ({ description }) => {
		try {
			const response = await requestOfStudentMutation({
				type: "narrow",
				description: description,
				userId: user?._id,
			});
			setOpenState(false);
			if (!response.data.success) {
				toast.error(response.data.message);
				return;
			}
			toast.success(response.data.message);
		} catch (error) {
			setOpenState(false);
			toast.error(error?.response?.data?.message);
		}
	};

	const dataFormInterShip = [
		{ label: "Kiểu đăng ký :", value: supportOptions[+data?.support] },
		{ label: "Mã sinh viên :", value: data?.mssv },
		{ label: "Họ tên :", value: data?.name },
		{ label: "Email:", value: data?.email },
		{ label: "Số diện thoại:", value: data?.phoneNumber },
		{ label: "Địa chỉ:", value: data?.address },
		{ label: "Chuyên ngành:", value: data?.majors?.name },
		{ label: "Vị trí thực tập:", value: data?.position },
		{
			label: (
				<>
					{data?.support === 1 ? (
						<li>CV</li>
					) : data?.support === 0 ? (
						<>
							<li className="font-medium">Địa chỉ thực tập:</li>
							<li className="font-medium">Mã số thuế: </li>
							<li className="font-medium">Chức vụ người tiếp nhận</li>
							<li className="font-medium">SĐT doanh nghiệp</li>
							<li className="font-medium">Email người tiếpn nhận</li>
						</>
					) : null}
				</>
			),
			value: (
				<>
					{data?.support === 0 && (
						<>
							<li className="font-medium">{data?.nameCompany}</li>
							<li className="font-medium">{data?.addressCompany}</li>
							<li className="font-medium">{data?.taxCode}</li>
							<li className="font-medium">{data?.position}</li>
							<li className="font-medium">{data?.phoneNumberCompany}</li>
							<li className="font-medium">{data?.emailEnterprise}</li>
						</>
					)}
					{data?.support === 1 && (
						<>
							<p>{data?.business?.name}</p>
							{Object.keys(data).length !== 0 && (
								<p>
									<button type="link" onClick={() => window.open(data.link)} />
								</p>
							)}
						</>
					)}
				</>
			),
		},
	];

	return (
		<>
			<VerticalList>
				{dataFormInterShip.map((item) => (
					<li key={item.label}>
						{item.label}
						<span className="font-medium">{item.value}</span>
					</li>
				))}

				<form onSubmit={handleSubmit(onSubmit)}>
					{open && (
						<>
							<TextAreaFieldControl control={control} name="description" />
							<div className="mt-2 flex justify-between">
								<Button
									variant="error"
									className="hover:bg-red-600"
									onClick={() => {
										setOpen(false);
										reset();
									}}>
									Huỷ
								</Button>
								<Button
									variant="secondary"
									className="hover:bg-gray-300"
									onClick={() => setOpen(true)}>
									Gửi
								</Button>
							</div>
						</>
					)}

					{!open && (
						<Button variant="primary" className="mt-3 w-full" onClick={() => setOpen(true)}>
							Gửi yêu cầu hỗ trợ
						</Button>
					)}
				</form>
			</VerticalList>
		</>
	);
};
export default StudentInfoPage;
