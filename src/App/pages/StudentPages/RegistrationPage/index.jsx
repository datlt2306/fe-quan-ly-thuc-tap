import tw from "twin.macro";
import { lazy, Suspense } from "react";

import ModalLoading from "@/Core/components/common/Loading/ModalLoading";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import SelectFieldControl from "@/Core/components/common/FormControl/SelectFieldControl";
import { RegistrationType } from "./constants/RegistrationType";
import { useState, useCallback, useTransition } from "react";
import { toast } from "react-toastify";

const FormSchoolSupport = lazy(() => import("./form/FormSchoolSupport"));
const FormSelfFinding = lazy(() => import("./components/FormSelfFinding"));

export const Layout = tw.div`grid grid-cols-12 gap-7 sm:gap-4 items-center my-4 `;

const RegistrationTypeCol = tw.div`col-span-4  flex justify-end font-medium sm:col-span-12 sm:justify-start`;

const FormSignUpCol = tw.div`col-span-8 flex items-center gap-4   sm:(col-span-12 items-start justify-start flex-col)`;

const LabelLayout = tw.label`inline-flex items-center`;
const TitleForm = tw.span`ml-2 font-medium`;

const labelItems = [
	{
		label: "Nhờ nhà trường hỗ trợ",
		value: RegistrationType.SchoolSupport,
	},
	{
		label: "Tự tìm nơi thực tập",
		value: RegistrationType.SelfFinding,
	},
];
const options = [
	{ value: "option1", label: "Option 1" },
	{ value: "option2", label: "Option 2" },
	{ value: "option3", label: "Option 3" },
];

const RegistrationPage = () => {
	const [selectedOption, setSelectedOption] = useState(null);
	const handleChangeForm = (value) => {
		setSelectedOption(value);
	};
	
	const handleFormSchoolSupport = async (data) => {
		const file = data.upload;
		const isPDF = file.type === "application/pdf";
		if (!isPDF) {
			toast.error(`Vui lòng chọn file PDF`);
			return;
		}

	};
	const handleFormSelfFinding = async (data) => {
		
	};
	const sharedFields = useCallback((control) => {
		return [
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
						name="phoneNumber"
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
						placeholder="Chọn chuyên ngành"
					/>
				),
			},
			{
				label: "Đơn vị thực tập",
				note: true,
				content: (
					<SelectFieldControl
						className="w-96 sm:w-[178.4px]"
						initialValue="Chọn doanh nghiệp"
						control={control}
						name="business"
						options={options}
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
			},
		];
	}, []);

	return (
		<>
			<div className="mb-5">Thời gian đăng ký còn lại</div>
			<Layout>
				<RegistrationTypeCol>Kiểu đăng ký</RegistrationTypeCol>
				<FormSignUpCol>
					{labelItems.map((item, index) => (
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
			<Suspense fallback={<ModalLoading />}>
				{selectedOption == RegistrationType.SchoolSupport && (
					<FormSchoolSupport fields={sharedFields} onSubmit={handleFormSchoolSupport} />
				)}
				{selectedOption == RegistrationType.SelfFinding && (
					<FormSelfFinding fields={sharedFields} onSubmit={handleFormSelfFinding} />
				)}
			</Suspense>
		</>
	);
};

export default RegistrationPage;
