import classNames from 'classnames';
import { forwardRef, useRef } from 'react';
import { useController } from 'react-hook-form';
import tw from 'twin.macro';
import FormControl from './FormControl';

export const Radio = forwardRef(({ onChange: handleChange, ...props }, ref) => (
	<input
		{...props}
		onChange={(e) => handleChange(e)}
		ref={ref}
		type='radio'
		tw='border-gray-300 text-primary duration-300 focus:ring-primary'
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
							className={classNames({ 'border-error': !!error })}
							onChange={(event) => {
								field.onChange(event);
								if (handleChange) {
									handleChange(event);
								}
							}}
							value={option.value}
						/>
					</Label>
				))}
			</RadioGroup>
			{error && <small className='font-medium text-error'>{error.message}</small>}
		</FormControl>
	);
};

const Label = tw.label`flex items-center gap-2`;
const RadioGroup = tw.div`flex items-center gap-3`;

export default RadioFieldControl;
