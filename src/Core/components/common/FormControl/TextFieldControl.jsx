import { Controller } from "react-hook-form";
import tw from "twin.macro";

export const Input = tw.input`block w-full rounded-md border-0 duration-300 px-2.5 py-1.5 text-gray-900 outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6`;
const FormControl = tw.div`flex flex-col gap-2`;

const TextFieldControl = (props) => {
	const id = useId();
	return (
		<Controller
			control={props.control}
			name={props.name}
			render={({
				field: { onChange, onBlur, value, ref },
				fieldState: { invalid, isTouched, isDirty, error },
				formState,
			}) => (
				<FormControl>
					{props.label && <label htmlFor={id}>{props.label}</label>}
					<Input
						type={props.type}
						onChange={onChange}
						id={id}
						disabled={props.disabled}
						defaultValue={value}
						placeholder={props.placeholder}
						min={props.min}
					/>
					{error && <small className="font-medium text-error">{error.message}</small>}
				</FormControl>
			)}
			rules={props.rules}
		/>
	);
};

TextFieldControl.defaultProp = {
	type: "text",
};

export default TextFieldControl;
