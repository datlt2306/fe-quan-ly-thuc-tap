import React from "react";
import tw from "twin.macro";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import SelectFieldControl from "@/Core/components/common/FormControl/SelectFieldControl";
import Button from "@/Core/components/common/Button";
import { useMemo, useState, useRef,useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	formSignUpSchoolSupportSchema,
	formSignUpSelfFindingSchema,
} from "@/App/schemas/formSignUpInterShipSchema";
const Layout = tw.div`grid grid-cols-12 gap-7 sm:gap-4 items-center my-4 `;
const FormRow = ({ label, children, note = false }) => (
	<Layout>
		<div className="col-span-4 flex justify-end font-medium sm:justify-start">
			{note ? (
				<>
					<b className="pr-1 text-red-500"> * </b> <p>{label}</p>
				</>
			) : (
				<p>{label}</p>
			)}
		</div>
		<div className="col-span-8 flex items-center gap-4">{children}</div>
	</Layout>
);

const RegistrationPage = () => {
	const [file, setFile] = useState("");
	useEffect(() => {
	  
	console.log(file);
	  
	}, [file])
	
	const { control, handleSubmit, register } = useForm({
		resolver: yupResolver(formSignUpSchoolSupportSchema),
	});

	const RegistrationType = {
		SelfFinding: 0,
		SchoolSupport: 1,
	};
	const onSubmit = async (data) => {
		console.log(data);
	};
	const formRows = useMemo(
		() => [
			{
				label: "Mã sinh viên",
				content: <p>PH24952</p>,
			},
			{
				label: "Họ và tên",
				content: <p>MInh nguyễn</p>,
			},
			{
				label: "Số điện thoại",
				note: true,
				content: (
					<InputFieldControl control={control} name="phone" placeholder="Số điện thoại" />
				),
			},
			{
				label: "Địa chỉ",
				note: true,
				content: <InputFieldControl control={control} name="address" placeholder="Địa chỉ" />,
			},
			{
				label: "Chuyên ngành",
				note: true,
				content: (
					<InputFieldControl control={control} name="narrow" placeholder="Chuyên ngành" />
				),
			},
			{
				label: "Đơn vị thực tập",
				note: true,
				content: (
					<InputFieldControl
						control={control}
						name="business"
						placeholder="Chọn doanh nghiệp"
					/>
				),
			},
			{
				label: "Vị trí thực tập",
				note: true,
				content: (
					<InputFieldControl
						control={control}
						name="dream"
						placeholder="VD: Web Back-end, Dựng phim, Thiết kế nội thất"
					/>
				),
			},
			{
				label: "Upload CV(PDF)",
				note: true,
				content: (
					<InputFieldControl
						type="file"
						control={control}
						name="upload"
						value={file}
						onChange={(e) => setFile(e.target.value)}
					/>
				),
			},
			{
				content: (
					<Button type="submit" className="mt-5 bg-secondary text-white">
						Đăng ký
					</Button>
				),
			},
		],
		[control, file]
	);
	return (
		<>
			<div className="mb-5">Thời gian đăng ký còn lại</div>

			<form onSubmit={handleSubmit(onSubmit)}>
				<Layout>
					<div className="col-span-4  flex justify-end font-medium sm:col-span-12 sm:justify-start">
						Kiểu đăng ký
					</div>
					<div tw="col-span-8 flex items-center gap-4   sm:(col-span-12 items-start justify-start flex-col) ">
						{/* col-span-8 sm:col-span-12 sm:justify-start items-center gap-4  */}
						<label className="inline-flex items-center">
							<input
								type="radio"
								name="radio"
								defaultValue={RegistrationType.SchoolSupport}
							/>
							<span className="ml-2 font-medium">Nhờ nhà trường hỗ trợ</span>
						</label>
						<label className="inline-flex items-center">
							<input type="radio" name="radio" defaultValue={RegistrationType.SelfFinding} />
							<span className="ml-2 font-medium">Tự tìm nơi thực tập</span>
						</label>
					</div>
				</Layout>
				{formRows.map((row, index) => (
					<FormRow key={index} label={row.label} note={row.note}>
						{row.content}
					</FormRow>
				))}
			</form>
		</>
	);
};

export default RegistrationPage;
