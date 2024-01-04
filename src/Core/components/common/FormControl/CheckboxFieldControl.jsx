import classNames from 'classnames';
import { forwardRef, useId, useRef } from 'react';
import { useController } from 'react-hook-form';
import tw from 'twin.macro';
import Text from '../Text/Text';

const FormControl = tw.div`flex items-center gap-6`;

export const Checkbox = forwardRef(({ onChange: handleChange, disabled, ...props }, ref) => {
	const localRef = useRef(null);
	const checkboxRef = ref || localRef;
	return (
		<input
			{...props}
			role='checkbox'
			onChange={(e) => handleChange(e)}
			ref={checkboxRef}
			aria-describedby='comments-description'
			name='comments'
			type='checkbox'
			disabled={disabled}
			className={classNames(`h-4 w-4 rounded border-gray-300 text-primary duration-100 focus:ring-primary`, {
				'bg-disabled/20': disabled
			})}
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
			{error && (
				<Text as='small' aria-errormessage={error?.message} color='error' className='font-medium'>
					{error?.message}
				</Text>
			)}
		</FormControl>
	);
};

export default forwardRef(CheckboxFieldControl);
