import { formSignUpSchoolSupportSchema } from "@/App/schemas/formSignUpInterShipSchema";
import Button from "@/Core/components/common/Button";
import FileUploadFieldControl from "@/Core/components/common/FormControl/FileUploadFieldControl";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormRow from "../components/FormRow";
import SelectFieldControl from "@/Core/components/common/FormControl/SelectFieldControl";
const FormSchoolSupport = ({ fields,onSubmit,business }) => {
	const { control, handleSubmit } = useForm({
		resolver: yupResolver(formSignUpSchoolSupportSchema),
		defaultValues: formSignUpSchoolSupportSchema.getDefault(),
	});
	
	const formSchoolSupport = [
		...fields(control),
		{
			label: "Đơn vị thực tập",
			note: true,
			content: (
				<SelectFieldControl
					className="w-96 sm:w-[210.4px]"
					initialValue="Chọn doanh nghiệp"
					control={control}
					name="business"
					options={Array.isArray(business?.list) ? business.list.map((item) => ({ value: item._id, label: item.name })) : []}
				/>
			),
		},
		{
			label: "Upload CV(PDF)",
			note: true,
			content: <FileUploadFieldControl className="w-96 sm:w-full" control={control} name="CV" />,
		},
		{
			content: (
				<Button type="submit" className="mt-5 bg-primary text-white">
					Đăng ký
				</Button>
			),
		},
	];
	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className="h-[700px]">
				{formSchoolSupport.map((row, index) => (
					<FormRow key={index} label={row.label} note={row.note}>
						{row.content}
					</FormRow>
				))}
			</form>
		</>
	);
};

export default FormSchoolSupport;
