import { useController } from 'react-hook-form';
import tw from 'twin.macro';
import FormControl from './FormControl';
import { useId } from 'react';

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
			<label className='font-medium text-base-content' htmlFor={id}>
				{label}
			</label>
			<input type='file' onChange={(e) => handleChange(e)} />
			{error && <small className='font-medium text-error'>{error?.message}</small>}
		</FormControl>
	);
};

export default FileUploadFieldControl;
