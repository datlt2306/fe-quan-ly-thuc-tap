import classNames from 'classnames';
import { forwardRef, useEffect, useId, useRef } from 'react';
import { useController } from 'react-hook-form';
import tw from 'twin.macro';
import FormControl from './FormControl';
import Text from '../Text/Text';

const TextareaFieldControl = forwardRef(
	({ control, name, label, onChange: handleChange, disabled, rules, resizable, rows = 5, ...props }, ref) => {
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

		const textareaRef = useRef(null);
		const resolvedRef = ref || textareaRef;
		const id = useId();

		const handleInput = (e) => {
			if (resizable) {
				e.target.style.height = 'auto';
				e.target.style.height = `${e.target.scrollHeight}px`;
			}
		};

		return (
			<FormControl>
				{label && (
					<Text as='label' className='font-semibold text-base-content' htmlFor={id}>
						{label}
					</Text>
				)}
				<Textarea
					{...props}
					id={id}
					onChange={(e) => {
						field.onChange(e);
						if (handleChange) handleChange(e);
					}}
					onInput={(e) => handleInput(e)}
					value={field.value}
					disabled={disabled}
					className={classNames({
						'resize-none': !resizable,
						'ring-error': !!error
					})}
					rows={rows}
					ref={(e) => {
						field.ref(e);
						resolvedRef.current = e;
					}}
				/>
				{error && (
					<Text as='small' aria-errormessage={error?.message} color='error' className='font-medium'>
						{error?.message}
					</Text>
				)}
			</FormControl>
		);
	}
);

const Textarea = tw.textarea`scrollbar-none block w-full rounded-md border-0 duration-300 px-2.5 py-2 text-base-content outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6`;

export default TextareaFieldControl;
