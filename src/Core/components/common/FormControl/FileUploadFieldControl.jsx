import { useController } from 'react-hook-form';
import tw from 'twin.macro';

const FormControl = tw.div`flex flex-col gap-2 m-0 `;

const FileUploadFieldControl = ({ control, name, label, disabled, rules }) => {
	const {
		field,
		fieldState: { error }
	} = useController({ name, control, rules, defaultValue: [] });
	const handleChange = (event) => {
		if (event.target.files && event.target.files.length > 0) {
			field.onChange(event.target.files[0]);
		}
	};

	return (
		<FormControl>
			<div className='relative '>
				{label && <div className='font-medium text-base-content'>{label}</div>}
				<label className='mt-1 block'>
					<input type='file' onChange={handleChange} />
				</label>
			</div>
			{error && <small className='font-medium text-error'>{error?.message}</small>}
		</FormControl>
	);
};

export default FileUploadFieldControl;
