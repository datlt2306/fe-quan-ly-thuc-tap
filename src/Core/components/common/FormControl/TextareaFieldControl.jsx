import { forwardRef, useEffect, useId, useRef } from 'react';
import { useController } from 'react-hook-form';
import tw from 'twin.macro';

const Textarea = tw.textarea`resize-none block w-full rounded-md border-0 duration-300 px-2.5 py-1.5 text-gray-900 outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6`;
const FormControl = tw.div`flex flex-col gap-1 m-0`;

const TextareaFieldControl = forwardRef(({ control, name, label, disabled, rules, ...props }, ref) => {
	const {
		field: { onChange, onBlur, value, ref: inputRef },
		fieldState: { error }
	} = useController({
		name,
		control,
		rules,
		defaultValue: props.value,
		...props
	});

	const textareaRef = useRef(null);
	const id = useId();

	useEffect(() => {
		const textarea = textareaRef.current;

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
				onChange={onChange}
				onBlur={onBlur}
				value={value}
				disabled={disabled}
				rows={5}
				ref={(e) => {
					textareaRef.current = e;
					if (typeof ref === 'function') {
						ref(e);
					} else if (ref && typeof ref === 'object') {
						ref.current = e;
					}
				}}
			/>
			{error && <small className='font-medium text-error'>{error?.message}</small>}
		</FormControl>
	);
});

export default TextareaFieldControl;