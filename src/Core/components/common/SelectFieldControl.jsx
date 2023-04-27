import { useId } from "react";
import { Controller } from "react-hook-form";
import tw from "twin.macro";

export const Select = tw.select`block w-full outline-none rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-primary  sm:text-sm sm:leading-6 duration-200`;
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
