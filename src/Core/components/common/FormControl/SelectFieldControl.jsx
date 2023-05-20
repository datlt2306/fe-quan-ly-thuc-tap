import { forwardRef, useId, useRef } from 'react';
import { useController } from 'react-hook-form';
import tw from 'twin.macro';

export const Select = tw.select`block w-full rounded-[4px] border-none duration-300  px-2 py-1.5 outline-none ring-1 ring-gray-300 focus:ring-primary focus:active:ring-primary min-w-[128px] m-0`;
export const Option = tw.option`leading-6`;
const FormControl = tw.div`flex flex-col gap-1 m-0`;

/**
 *
 * @property {string} name
 * @returns
 */
const SelectFieldControl = ({ initialValue = 'Chọn', control, name, label, options, disabled, rules, ...props }, ref) => {
	const id = useId();
	const localRef = useRef(null);
	const inputRef = ref || localRef;

	const {
		field,
		fieldState: { error }
	} = useController({
		name,
		control,
		rules,
		defaultValue: props.value,
		...props
	});
	return (
		<FormControl>
			{label && (
				<label className='font-medium text-base-content' htmlFor={id}>
					{label}
				</label>
			)}
			<Select
			{...props}
				onChange={(event) => {
					field.onChange(event);
					if (props.onChange) {
						props.onChange(event);
					}
				}}
				ref={(e) => {
					field.ref(e);
					inputRef.current = e;
				}}
				id={id}
				name={name}
				disabled={disabled}
				value={field.value}>
				<Option value=''>{initialValue}</Option>
				{Array.isArray(options) &&
					options.map((option, index) => (
						<Option value={option?.value} key={index}>
							{option?.label}
						</Option>
					))}
			</Select>
			{error && <small className='font-medium text-error'>{error.message}</small>}
		</FormControl>
	);
};

export default forwardRef(SelectFieldControl);
