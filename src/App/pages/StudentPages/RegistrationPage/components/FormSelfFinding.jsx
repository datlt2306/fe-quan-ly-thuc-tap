import { useForm } from "react-hook-form";
import InputFieldControl from "@/Core/components/common/FormControl/InputFieldControl";
import { formSignUpSelfFindingSchema } from "@/App/schemas/formSignUpInterShipSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/Core/components/common/Button";
import FormRow from "./FormRow";
const FormSelfFinding = ({ fields, onSubmit }) => {
	const { control, handleSubmit } = useForm({
		resolver: yupResolver(formSignUpSelfFindingSchema),
		defaultValues: formSignUpSelfFindingSchema.getDefault(),
	});

	
	const formSelfFinding = [
		...fields(control),
		{
			label: "Đơn vị thực tập",
			note: true,
			content: (
				<InputFieldControl
					className="w-96 sm:w-full"
					control={control}
					name="nameCompany"
					placeholder="Đơn vị thực tập/Tên doanh nghiệp"
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
					name="addressCompany"
					placeholder="Địa chỉ đơn vị thực tập"
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
					placeholder="Chức vụ người tiếp nhận"
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
					name="phoneNumberCompany"
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
				<Button type="submit" className="mt-5 bg-primary text-white">
					Đăng ký
				</Button>
			),
		},
	];
	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} className="h-[700px]">
				{formSelfFinding.map((row, index) => (
					<FormRow key={index} label={row.label} note={row.note}>
						{row.content}
					</FormRow>
				))}
			</form>
		</>
	);
};

export default FormSelfFinding;
