import { Controller } from "react-hook-form";
import tw from "twin.macro";

export const Input = tw.input`block w-full rounded-md border-0 duration-300 px-2.5 py-1.5 text-gray-900 outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6`;
const FormControl = tw.div`flex flex-col gap-2`;

const TextFieldControl = ({
	control,
	name,
	placeholder,
	label,
	type,
	disabled,
	rules,
	min,
	max,
}) => {
	const id = useId();
	return (
		<Controller
			control={control}
			name={name}
			render={({
				field: { onChange, onBlur, value, ref },
				fieldState: { invalid, isTouched, isDirty, error },
				formState,
			}) => (
				<FormControl>
					{label && <label htmlFor={id}>{label}</label>}
					<Input
						type={type} // available type: text, number, email, password, url,...
						onChange={onChange}
						id={id}
						disabled={disabled}
						defaultValue={value}
						placeholder={placeholder}
						min={min}
						max={max}
					/>
					{error && <small className="font-medium text-error">{error.message}</small>}
				</FormControl>
			)}
			rules={rules}
		/>
	);
};

TextFieldControl.defaultProp = {
	type: "text",
};

export default TextFieldControl;
