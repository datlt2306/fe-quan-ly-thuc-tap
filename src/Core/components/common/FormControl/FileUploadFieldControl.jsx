import { useController } from 'react-hook-form';
import tw from 'twin.macro';
import FormControl from './FormControl';
import { useId } from 'react';
import Text from '../Text/Text';

const FileUploadFieldControl = ({ control, name, label, disabled, rules }) => {
	const id = useId();

	const {
		field,
		fieldState: { error }
	} = useController({ name, control, rules, defaultValue: [] });
	const handleChange = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			field.onChange(e.target.files[0]);
		}
	};

	return (
		<FormControl>
			<Text as='label' className='font-semibold' htmlFor={id}>
				{label}
			</Text>
			<input type='file' onChange={(e) => handleChange(e)} />
			{error && (
				<Text as='small' aria-errormessage={error?.message} color='error' className='font-medium'>
					{error?.message}
				</Text>
			)}
		</FormControl>
	);
};

export default FileUploadFieldControl;
