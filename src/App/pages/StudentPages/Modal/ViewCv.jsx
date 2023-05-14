import Button from "@/Core/components/common/Button";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { requestOfStudentValidator } from "@/App/schemas/requestStudentSchema.js";
import { useState } from "react";
import { useRequestOfStudentMutation } from "@/App/providers/apis/requestStudentsApi";
import { toast } from "react-toastify";
import { VerticalList } from "../StudentInfoPage";
import TextAreaFieldControl from "@/Core/components/common/FormControl/TextAreaFieldControl";
import tw from "twin.macro";
const ItemValue=tw.li`font-medium`
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
		{ label: "Kiểu đăng ký :", value: data?.support ? supportOptions[+data?.support] : null },
		{ label: "Mã sinh viên :", value: data?.mssv },
		{ label: "Họ tên :", value: data?.name },
		{ label: "Email:", value: data?.email },
		{ label: "Số điện thoại:", value: data?.phoneNumber },
		{ label: "Địa chỉ:", value: data?.address },
		{ label: "Chuyên ngành:", value: data?.majors?.name },
		{ label: "Vị trí thực tập:", value: data?.position },
		{
			label: (
				<>
					{data?.support === 1 ? 	(
						<p className="pr-1">CV:</p>
					): data?.support === 0 ? (
						<div className="flex flex-col gap-3">
							<li>Địa chỉ thực tập:</li>
							<li>Mã số thuế: </li>
							<li>Chức vụ người tiếp nhận:</li>
							<li>SĐT doanh nghiệp:</li>
							<li>Email người tiếp nhận:</li>
						</div>
					) : null}
				</>
			),
			value: (
				<>
					{data?.support === 0 && (
						<>
							<ItemValue>{data?.nameCompany}</ItemValue>
							<ItemValue>{data?.addressCompany}</ItemValue>
							<ItemValue>{data?.taxCode}</ItemValue>
							<ItemValue>{data?.position}</ItemValue>
							<ItemValue>{data?.phoneNumberCompany}</ItemValue>
							<ItemValue>{data?.emailEnterprise}</ItemValue>
						</>
					)}
					{data?.support === 1 && (
						<>
							<p>{data?.business?.name}</p>
							<>
								<Button onClick={() => window.open(data?.["CV"])}>Xem</Button>
							</>
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
					<li key={item.label} className="flex items-center gap-1">
						<p>{item.label}</p>
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
export default ViewCv