import React from "react";
import tw from "twin.macro";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import SelectFieldControl from "@/Core/components/common/FormControl/SelectFieldControl";
import Button from "@/Core/components/common/Button";
import { useMemo, useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	formSignUpSchoolSupportSchema,
	formSignUpSelfFindingSchema,
} from "@/App/schemas/formSignUpInterShipSchema";

const Layout = tw.div`grid grid-cols-12 gap-7 sm:gap-4 items-center my-4 `;
const RegistrationTypeCol = tw.div`col-span-4  flex justify-end font-medium sm:col-span-12 sm:justify-start`;
const FormSignUpCol = tw.div`col-span-8 flex items-center gap-4   sm:(col-span-12 items-start justify-start flex-col)`;

const RegistrationType = {
	SelfFinding: 0,
	SchoolSupport: 1,
};

const LabelLayout = tw.label`inline-flex items-center`;
const TitleForm = tw.span`ml-2 font-medium`;

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
	const [selectedOption, setSelectedOption] = useState(null);

	const { control, handleSubmit, reset } = useForm({
		resolver:
			selectedOption == RegistrationType.SchoolSupport
				? yupResolver(formSignUpSchoolSupportSchema)
				: yupResolver(formSignUpSelfFindingSchema),
		defaultValues: {
			phone: "",
			address: "",
		},
	});

	const onSubmit = async (data) => {
		console.log(data);
	};
	const labelItem = [
		{
			label: "Nhờ nhà trường hỗ trợ",
			value: RegistrationType.SchoolSupport,
		},
		{
			label: "Tự tìm nơi thực tập",
			value: RegistrationType.SelfFinding,
		},
	];
	const sharedFields=[
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
				<InputFieldControl
					className="w-96 sm:w-full"
					control={control}
					name="phone"
					placeholder="Số điện thoại"
				/>
			),
		},
		{
			label: "Địa chỉ",
			note: true,
			content: (
				<InputFieldControl
					className="w-96 sm:w-full"
					control={control}
					name="address"
					placeholder="Địa chỉ"
				/>
			),
		},
		{
			label: "Chuyên ngành",
			note: true,
			content: (
				<InputFieldControl
					className="w-96 sm:w-full"
					control={control}
					name="narrow"
					placeholder="Chuyên ngành"
				/>
			),
		},
		{
			label: "Đơn vị thực tập",
			note: true,
			content: (
				<InputFieldControl
					className="w-96 sm:w-full"
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
					className="w-96 sm:w-full"
					control={control}
					name="dream"
					placeholder="VD: Web Back-end, Dựng phim, Thiết kế nội thất"
				/>
			),
		}
	]
	const formSchoolSupport = [
		...sharedFields,
		{
			label: "Upload CV(PDF)",
			note: true,
			content: (
				<InputFieldControl
					className="w-96 sm:w-full"
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
	];
	const formSelfFinding = [
			...sharedFields,
		{
			label: "Đơn vị thực tập",
			note: true,
			content: (
				<InputFieldControl
					className="w-96 sm:w-full"
					control={control}
					name="business"
					placeholder="Chọn doanh nghiệp"
				/>
			),
		},
		{
			label: "Địa chỉ thực tập",
			note: true,
			content: (
				<InputFieldControl
					className="w-96 sm:w-full"
					control={control}
					name="business"
					placeholder="Chọn doanh nghiệp"
				/>
			),
		},
		{
			label: "Mã số thuế",
			note: true,
			content: (
				<InputFieldControl
					className="w-96 sm:w-full"
					control={control}
					name="taxCode"
					placeholder="Mã số thuế"
				/>
			),
		},
		{
			label: "Chức vụ người tiếp nhận",
			note: true,
			content: (
				<InputFieldControl
					className="w-96 sm:w-full"
					control={control}
					name="position"
					placeholder="Email người tiếp nhận"
				/>
			),
		},
		{
			label: "Số điện thoại doanh nghiệp",
			note: true,
			content: (
				<InputFieldControl
					className="w-96 sm:w-full"
					control={control}
					name="numberEnterprise"
					placeholder="Số điện thoại doanh nghiệp"
				/>
			),
		},
		{
			label: "Email người tiếp nhận",
			note: true,
			content: (
				<InputFieldControl
					className="w-96 sm:w-full"
					control={control}
					name="emailEnterprise"
					placeholder="Email người tiếp nhận"
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
	];

	const handleChangeForm = (value) => {
		setSelectedOption(value);
		reset();
	};

	//kiểm tra option  hiện tại có phải null không null thì không render ra cái gì nếu không
	//thì render theo option
	const formToRender =
		selectedOption != null
			? selectedOption === RegistrationType.SchoolSupport
				? formSchoolSupport
				: formSelfFinding
			: null;
	return (
		<>
			<div className="mb-5">Thời gian đăng ký còn lại</div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Layout>
					<RegistrationTypeCol>Kiểu đăng ký</RegistrationTypeCol>
					<FormSignUpCol>
						{labelItem.map((item, index) => (
							<LabelLayout key={index}>
								<input
									type="radio"
									name="radio"
									defaultValue={item.value}
									onClick={() => handleChangeForm(item.value)}
								/>
								<TitleForm>{item.label}</TitleForm>
							</LabelLayout>
						))}
					</FormSignUpCol>
				</Layout>
				{formToRender?.map((row, index) => (
					<FormRow key={index} label={row.label} note={row.note}>
						{row.content}
					</FormRow>
				))}
			</form>
		</>
	);
};

export default RegistrationPage;
