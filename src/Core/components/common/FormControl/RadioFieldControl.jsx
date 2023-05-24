import { forwardRef, useRef } from 'react';
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

const RadioFieldControl = ({ control, name, options, onChange: handleChange }) => {
	const {
		fieldState: { error },
		formState
	} = useController({ control, name });

	return (
		<FormControl>
			<RadioGroup>
				{options.map((option, index) => (
					<Label htmlFor={index.toString()} key={index}>
						{option.label}
						<Radio id={index.toString()} name={name} onChange={(e) => handleChange(e)} value={option.value} />
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
