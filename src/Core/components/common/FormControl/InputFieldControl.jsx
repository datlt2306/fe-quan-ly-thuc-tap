import classNames from 'classnames';
import { forwardRef, useId, useRef, useState } from 'react';
import { useController } from 'react-hook-form';
import tw from 'twin.macro';
import Text from '../Text/Text';
import FormControl from './FormControl';
import Box from '../Box';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

/**
 * @typedef {import('react-hook-form').RegisterOptions} RegisterOptions
 * @typedef {import('react-hook-form').FieldValues} FieldValues
 */

/**
 * @typedef TInputFieldControlProps
 * @prop {import('react-hook-form').Control} control
 * @prop {Omit<RegisterOptions<FieldValues, any>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs">}
 */

/** @type {React.FC<TInputFieldControlProps & React.HTMLAttributes<HTMLInputElement>>} */
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
	const [visible, setVisible] = useState(false);

	return (
		<FormControl>
			{label && (
				<Text as='label' className='font-semibold' htmlFor={id}>
					{label}
				</Text>
			)}
			<Box className='relative'>
				<Input
					{...props}
					id={id}
					type={type !== 'password' ? type : visible ? 'text' : 'password'} // available type: text, email, password, url,...
					onChange={(event) => {
						field.onChange(event);
						if (props.onChange) {
							props.onChange(event);
						}
					}}
					className={classNames(props.className, { 'ring-error': !!error, 'pr-8': type === 'password' })}
					value={field.value || ''}
					disabled={disabled}
					ref={(e) => {
						field.ref(e);
						inputRef.current = e;
					}}
				/>
				{type === 'password' && (
					<button
						type='button'
						role='button'
						onClick={() => setVisible(!visible)}
						className='absolute right-2 top-1/2 inline-flex aspect-square h-4 -translate-y-1/2 items-center justify-center bg-white'>
						{visible ? <EyeIcon className='h-4 w-4' /> : <EyeSlashIcon className='h-4 w-4' />}
					</button>
				)}
			</Box>
			{props.description && <Text as='small'>{props.description}</Text>}
			{error && <Text className='font-medium text-error'>{error?.message}</Text>}
		</FormControl>
	);
};

const Input = tw.input`block w-full rounded-md border-0 duration-300 px-2.5 py-1.5 text-base-content outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 disabled:bg-disabled/10`;

export { Input };
export default forwardRef(InputFieldControl);
