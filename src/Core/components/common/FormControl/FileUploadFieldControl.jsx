import { useController } from 'react-hook-form';
<<<<<<< HEAD
import { useState } from 'react';
import tw from 'twin.macro';
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid';
const Input = tw.input`block w-full rounded-md border-0 duration-300 px-2.5 py-1.5 text-gray-900 outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 hidden`;
const Label = tw.label`inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:bg-gray-50 gap-2`;
=======
import tw from 'twin.macro';

>>>>>>> d9c780983b704e9aae04b622bedc398cb9bc0b54
const FormControl = tw.div`flex flex-col gap-2 m-0 `;

const FileUploadFieldControl = ({ control, name, label, disabled, rules }) => {
	const {
		field,
		fieldState: { error }
	} = useController({ name, control, rules, defaultValue: [] });
<<<<<<< HEAD

=======
>>>>>>> d9c780983b704e9aae04b622bedc398cb9bc0b54
	const handleChange = (event) => {
		if (event.target.files && event.target.files.length > 0) {
			field.onChange(event.target.files[0]);
		}
	};

	return (
		<FormControl>
			<div className='relative '>
				{label && <div className='font-medium text-base-content'>{label}</div>}
<<<<<<< HEAD
				<Label htmlFor='file-upload'>
					<ArrowUpTrayIcon height={20} />
					<span>Chọn tệp</span>
				</Label>
				<Input id='file-upload' type='file' onChange={handleChange} disabled={disabled} />
			</div>

=======
				<label className='mt-1 block'>
					<input type='file' onChange={handleChange} />
				</label>
			</div>
>>>>>>> d9c780983b704e9aae04b622bedc398cb9bc0b54
			{error && <small className='font-medium text-error'>{error?.message}</small>}
		</FormControl>
	);
};

export default FileUploadFieldControl;
