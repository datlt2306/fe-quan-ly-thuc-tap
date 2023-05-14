import { useForm } from "react-hook-form";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import { formSignUpSchoolSupportSchema } from "@/App/schemas/formSignUpInterShipSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/Core/components/common/Button";
import FormRow from "../components/FormRow";
import { schoolSupportDefaultValues } from "../Fields/formFields";
const FormSchoolSupport = ({ fields, onSubmit }) => {
	const { control, handleSubmit, reset } = useForm({
		resolver: yupResolver(formSignUpSchoolSupportSchema),
		defaultValues: schoolSupportDefaultValues,
	});

	const formSchoolSupport = [
		...fields(control),
		{
			label: "Upload CV(PDF)",
			note: true,
			content: (
				<InputFieldControl
					className="w-96 sm:w-full"
					type="file"
					control={control}
					name="upload"
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
	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
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
