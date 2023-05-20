import { forwardRef, useId, useRef } from 'react';
import { useController } from 'react-hook-form';
import tw from 'twin.macro';

const FormControl = tw.div`flex items-center gap-6`;

export const Checkbox = forwardRef(({ onChange: handleChange, ...props }, ref) => {
	const localRef = useRef(null);
	const checkboxRef = ref || localRef;
	return (
		<input
			{...props}
			onChange={(e) => handleChange(e)}
			ref={checkboxRef}
			aria-describedby='comments-description'
			name='comments'
			type='checkbox'
			tw='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary duration-100'
		/>
	);
});

const CheckboxFieldControl = ({ control, name, label, rules, checked, disabled, ...props }, ref) => {
	const {
		field,
		fieldState: { error }
	} = useController({
		name,
		control,
		rules,
		checked,
		...props
	});
	const id = useId();
	const localRef = useRef(null);
	const inputRef = ref || localRef;
	return (
		<FormControl>
			<label htmlFor={id}>{label}</label>
			<Checkbox
				id={id}
				control={control}
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
				name={name}
				disabled={disabled}
			/>
			{error && <small className='font-medium text-error'>{error.message}</small>}
		</FormControl>
	);
};

export default forwardRef(CheckboxFieldControl);
