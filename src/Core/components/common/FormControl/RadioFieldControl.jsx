import { forwardRef } from 'react';
import { useRef } from 'react';
import { useController } from 'react-hook-form';
import tw from 'twin.macro';

export const Radio = forwardRef(({ onChange: handleChange, ...props }, ref) => (
	<input
		{...props}
		onChange={(e) => handleChange(e)}
		ref={ref}
		type='radio'
		className='border-gray-300 text-primary duration-300 focus:ring-primary'
	/>
));

const RadioFieldControl = ({ control, name, options, onChange: handleChange, ...props }) => {
	const {
		fieldState: { error },
		field
	} = useController({ control, name, ...props });

	const inputRef = useRef(null);

	return (
		<FormControl>
			<RadioGroup>
				{options.map((option, index) => (
					<Label htmlFor={index.toString()} key={index}>
						{option.label}
						<Radio
							ref={inputRef}
							id={index.toString()}
							name={name}
							onChange={(event) => {
								field.onChange(event);
								if (props.onChange) {
									props.onChange(event);
								}
							}}
							value={option.value} />
					</Label>
				))}
			</RadioGroup>
			{error && <small className='font-medium text-error'>{error.message}</small>}
		</FormControl>
	);
};

const Label = tw.label`flex items-center gap-2`;
const RadioGroup = tw.div`flex items-center gap-3`;
const FormControl = tw.div`flex flex-col gap-1 m-0`;

export default RadioFieldControl;
