import { forwardRef, useId, useRef } from 'react';
import { useController } from 'react-hook-form';
import tw from 'twin.macro';

export const Input = tw.input`block w-full rounded-md border-0 duration-300 px-2.5 py-1.5 text-gray-900 outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6`;
const FormControl = tw.div`flex flex-col gap-1 m-0`;

const InputFieldControl = ({ control, name, label, disabled, rules, type = 'text', ...props }, ref) => {
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

	const id = useId();
	const localRef = useRef(null);
	const inputRef = ref || localRef;

	return (
		<FormControl>
			{label && (
				<label className='font-medium text-base-content' htmlFor={id}>
					{label}
				</label>
			)}
			<Input
				{...props}
				id={id}
				type={type} // available type: text, email, password, url,...
				onChange={(event) => {
					field.onChange(event);
					if (props.onChange) {
						props.onChange(event);
					}
				}}
				value={field.value}
				disabled={disabled}
				ref={(e) => {
					field.ref(e);
					inputRef.current = e;
				}}
			/>
			{error && <small className='font-medium text-error'>{error?.message}</small>}
		</FormControl>
	);
};

export default forwardRef(InputFieldControl);
