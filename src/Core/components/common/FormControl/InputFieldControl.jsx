import classNames from 'classnames';
import { forwardRef, useId, useRef } from 'react';
import { useController } from 'react-hook-form';
import tw from 'twin.macro';
import Text from '../Text/Text';
import FormControl from './FormControl';

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
				<Text as='label' className='font-semibold' htmlFor={id}>
					{label}
				</Text>
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
				className={classNames({ 'ring-error': !!error })}
				value={field.value || ''}
				disabled={disabled}
				ref={(e) => {
					field.ref(e);
					inputRef.current = e;
				}}
			/>
			{props.description && <small>{props.description}</small>}
			{error && <Text className='font-medium text-error'>{error?.message}</Text>}
		</FormControl>
	);
};

const Input = tw.input`block w-full rounded-md border-0 duration-300 px-2.5 py-1.5 text-base-content outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6`;

export { Input };
export default forwardRef(InputFieldControl);
