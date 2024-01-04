import { CheckIcon } from '@heroicons/react/24/outline';
import { useEffect, useId, useState } from 'react';
import tw from 'twin.macro';
import Button from '../../Button';

const EditableCell = ({
	value: initialValue,
	row: { index },
	column: { id },
	original,
	type = 'text',
	onConfirmChange: handleConfirmChange,
	...props
}) => {
	const [value, setValue] = useState(initialValue);
	const _id = useId();
	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	return (
		<EditBox className='group'>
			<Input {...props} type={type} value={value} onChange={(e) => setValue(e.target.value)} />
			<Button
				size='xs'
				variant='ghost'
				shape='square'
				className='pointer-events-none invisible absolute right-5 top-1/2 -translate-y-1/2 duration-200 group-focus-within:pointer-events-auto group-focus-within:visible'
				onClick={() => {
					if (handleConfirmChange) {
						handleConfirmChange(id, value, original);
					}
				}}
				icon={CheckIcon}
			/>
		</EditBox>
	);
};

const Input = tw.input`border-none z-0 w-32 outline-none focus:border-none pr-20 focus:ring-0 `;
const EditBox = tw.label`relative `;

export default EditableCell;
