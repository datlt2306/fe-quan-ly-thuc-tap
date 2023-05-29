import classNames from 'classnames';
import { forwardRef, useEffect, useId, useRef } from 'react';
import { useController } from 'react-hook-form';
import tw from 'twin.macro';

const Textarea = tw.textarea`block w-full rounded-md border-0 duration-300 px-2.5 py-1.5 text-gray-900 outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6`;

const FormControl = tw.div`flex flex-col gap-px m-0`;

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

		useEffect(() => {
			const textarea = resolvedRef.current;
			const handleInput = () => {
				textarea.style.height = 'auto';
				textarea.style.height = `${textarea.scrollHeight}px`;
			};
			textarea.addEventListener('input', handleInput);
			return () => {
				textarea.removeEventListener('input', handleInput);
			};
		}, []);

		return (
			<FormControl>
				{label && (
					<label className='font-medium text-base-content' htmlFor={id}>
						{label}
					</label>
				)}
				<Textarea
					{...props}
					id={id}
					onChange={(e) => {
						field.onChange(e);
						if (handleChange) handleChange(e);
					}}
					value={field.value}
					disabled={disabled}
					className={classNames({ 'resize-none': !resizable, 'ring-error': !!error })}
					rows={rows}
					ref={(e) => {
						field.ref(e);
						resolvedRef.current = e;
					}}
				/>
				{error && <small className='font-medium text-error'>{error?.message}</small>}
			</FormControl>
		);
	}
);

export default TextareaFieldControl;
