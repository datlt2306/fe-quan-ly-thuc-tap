import { useId } from "react";
import { Controller } from "react-hook-form";
import tw from "twin.macro";

export const Select = tw.select`block w-full rounded-[4px] border-none duration-300  px-1 py-1.5 outline-none ring-1 ring-gray-300 focus:ring-primary focus:active:ring-primary`;
export const Option = tw.option`leading-6`;
const FormControl = tw.div`flex flex-col gap-2`;

/**
 *
 * @property {string} name
 * @returns
 */
export const SelectFieldControl = ({ initialValue, control, name, label, options, disabled, placeholder, rules }) => {
	const id = useId();
	return (
		<Controller
			control={control}
			name={name}
			render={({
				field: { onChange, onBlur, value, ref },
				fieldState: { invalid, isTouched, isDirty, error },
				formState,
			}) => {
				return (
					<FormControl>
						{label && <label htmlFor={id}>{label}</label>}
						<Select
							onChange={onChange}
							id={id}
							disabled={disabled}
							defaultValue={value}
							placeholder={placeholder}>
							<option>{initialValue || "Chọn"}</option>
							{Array.isArray(options) &&
								options.map((option, index) => (
									<option value={option?.value} key={index}>
										{option?.label}
									</option>
								))}
						</Select>
						{error && <small className="font-medium text-error">{error.message}</small>}
					</FormControl>
				);
			}}
			rules={rules}
		/>
	);
};
