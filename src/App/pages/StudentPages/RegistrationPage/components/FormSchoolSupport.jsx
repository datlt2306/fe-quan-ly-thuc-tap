import { useForm } from "react-hook-form";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import FileUploadFieldControl from "@/Core/components/common/FormControl/FileUploadFieldControl";
import { formSignUpSchoolSupportSchema } from "@/App/schemas/formSignUpInterShipSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/Core/components/common/Button";
import FormRow from "../components/FormRow";
const FormSchoolSupport = ({ fields, onSubmit }) => {
	const { control, handleSubmit } = useForm({
		resolver: yupResolver(formSignUpSchoolSupportSchema),
		defaultValues: formSignUpSchoolSupportSchema.getDefault(),
	});
	const formSchoolSupport = [
		...fields(control),
		{
			label: "Upload CV(PDF)",
			note: true,
			content: (
				<FileUploadFieldControl className="w-96 sm:w-full" control={control} name="upload" /> 
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
