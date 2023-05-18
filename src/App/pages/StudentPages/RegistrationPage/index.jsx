import tw from "twin.macro";
import { lazy, Suspense, useEffect } from "react";
import { useSelector } from "react-redux";

import ExpiredNotice from "./components/ExpiredNotice";
import CountdownTimer from "./components/CountdownTimer";
import LoadingProgressBar from "@/Core/components/common/Loading/LoadingProgressBar";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import SelectFieldControl from "@/Core/components/common/FormControl/SelectFieldControl";
import { RegistrationType } from "./constants/RegistrationType";
import { useState, useCallback } from "react";
import { toast } from "react-toastify";
// import { useUploadDriveMutation } from "@/App/providers/apis/uploadDriveApi";
import { useNavigate } from "react-router-dom";
import { useUploadCvMutation } from "@/App/providers/apis/registerInternAPI";

import { useGetAllCompanyQuery } from "@/App/providers/apis/businessApi";
import { useGetAllMajorQuery } from "@/App/providers/apis/majorApi";
import { useGetSetTimeQuery } from "@/App/providers/apis/configTimesApi";
// import FormSchoolSupport from "./components/FormSchoolSupport"
// import FormSelfFinding from "./components/FormSchoolSupport"

// const FormSelfFinding = lazy(() => import("./components/FormSelfFinding"));

const FormSchoolSupport = lazy(() => import("./components/FormSchoolSupport"));
const FormSelfFinding = lazy(() => import("./components/FormSelfFinding"));

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

const RegistrationPage = () => {
	const user = useSelector((state) => state.auth?.user);
	const navigate=useNavigate()
	const [selectedOption, setSelectedOption] = useState(null);
	const [deadline, setDeadLine] = useState(null);
	const { data: business } = useGetAllCompanyQuery();
	const { data: majors } = useGetAllMajorQuery();
	const { data: times } = useGetSetTimeQuery({ typeNumber: selectedOption || 0 }, { refetchOnMountOrArgChange: true });
	const [hanldeUploadCvMutation, result] = useUploadCvMutation();

	useEffect(() => {
		if (times?.time) {
			setDeadLine(times?.time);
		}
	}, [times]);

	useEffect(() => {
		if (user?.listTimeForm && user?.listTimeForm.length > 0) {
			const checkTimeStudent = user?.listTimeForm.find((item) => item.typeNumber === selectedOption);
			setDeadLine(checkTimeStudent);
		}
	}, [times, selectedOption, user?.listTimeForm]);

	// useEffect(() => {
	// 	console.log("deadline", deadline);
	// }, [deadline]);

	const handleChangeForm = (value) => {
		setSelectedOption(value);
	};

	const handleFormSchoolSupport = async (data) => {
		const file = data.CV;

		const isPDF = file.type === "application/pdf";
		if (!isPDF) {
			toast.error(`Vui lòng chọn file PDF`);
			return;
		}
		const handleData = {
			...data,
			typeNumber: selectedOption,
			support: Number(selectedOption),
			semester_id: user?.smester_id._id,
			campus_id: user?.campus_id,
			mssv: user?.mssv,
			_id: user?.id,
			email: user?.email,
			CV: "",
			majorCode: user?.majorCode,
		};
		const formData = new FormData();
		Object.entries(handleData).forEach(([key, value]) => {
			formData.append(key, value);
		});
		formData.append("file", file);
		// const response = await uploadDriveMutation(formData);
		const res = await hanldeUploadCvMutation(formData);
		if (res?.error) {
			toast.error("Đã có lỗi xảy ra");
			return;
		}
		toast.success("Đăng ký thành công");
		navigate("/thong-tin-sinh-vien")
	};

	const handleFormSelfFinding = async (data) => {
			const res = await hanldeUploadCvMutation({
				...data,
				typeNumber: selectedOption,
				support: selectedOption,
				semester_id: user?.smester_id._id,
				campus_id: user?.campus_id,
				mssv: user?.mssv,
				_id: user?.id,
				email: user?.email,
				majorCode: user?.majorCode,

			});
			if (res?.error) {
				toast.error("Đã có lỗi xảy ra");
				
				return;
			}
		toast.success("Đăng ký thành công");
		navigate("/thong-tin-sinh-vien")

	
	};
	const sharedFields = useCallback(
		(control) => {
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
					content: <InputFieldControl className="w-96 sm:w-full" control={control} name="phoneNumber" placeholder="Số điện thoại" />,
				},
				{
					label: "Địa chỉ",
					note: true,
					content: <InputFieldControl className="w-96 sm:w-full" control={control} name="address" placeholder="Địa chỉ" />,
				},
				{
					label: "Chuyên ngành",
					note: true,
					content: (
						<SelectFieldControl
							className="w-96 sm:w-[210.4px]"
							initialValue="Chọn chuyên ngành"
							control={control}
							name="major"
							options={Array.isArray(majors) ? majors.map((item) => ({ value: item._id, label: item.name })) : []}
						/>
					),
				},
				// {
				// 	label: "Đơn vị thực tập",
				// 	note: true,
				// 	content: (
				// 		<SelectFieldControl
				// 			className="w-96 sm:w-[210.4px]"
				// 			initialValue="Chọn doanh nghiệp"
				// 			control={control}
				// 			name="business"
				// 			options={Array.isArray(business?.list) ? business.list.map((item) => ({ value: item._id, label: item.name })) : []}
				// 		/>
				// 	),
				// },
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
		},
		[business?.list, majors]
	);
	const deadlineCheck = deadline && deadline.endTime > new Date().getTime() && deadline.startTime < new Date().getTime();
	
	return (
		<>
			{deadlineCheck ? <CountdownTimer targetDate={deadline?.endTime} /> : <ExpiredNotice />}
			{deadlineCheck && (
				<>
					<Layout>
						<RegistrationTypeCol>Kiểu đăng ký</RegistrationTypeCol>
						<FormSignUpCol>
							{labelItems.map((item, index) => (
								<LabelLayout key={index}>
									<input type="radio" name="radio" defaultValue={item.value} onClick={() => handleChangeForm(item.value)} />
									<TitleForm>{item.label}</TitleForm>
								</LabelLayout>
							))}
						</FormSignUpCol>
					</Layout>
			

					<Suspense fallback={<LoadingProgressBar />}>
					{selectedOption == RegistrationType.SchoolSupport && <FormSchoolSupport fields={sharedFields} onSubmit={handleFormSchoolSupport} business={business} />}
						{selectedOption == RegistrationType.SelfFinding && <FormSelfFinding fields={sharedFields} onSubmit={handleFormSelfFinding} />}
					
					</Suspense>
				</>
			)}
		</>
	);
};

export const Layout = tw.div`grid grid-cols-12 gap-7 sm:gap-4 items-center my-4 `;

const RegistrationTypeCol = tw.div`col-span-4  flex justify-end font-medium sm:col-span-12 sm:justify-start`;

const FormSignUpCol = tw.div`col-span-8 flex items-center gap-4   sm:(col-span-12 items-start justify-start flex-col)`;

const LabelLayout = tw.label`inline-flex items-center`;
const TitleForm = tw.span`ml-2 font-medium`;

export default RegistrationPage;
