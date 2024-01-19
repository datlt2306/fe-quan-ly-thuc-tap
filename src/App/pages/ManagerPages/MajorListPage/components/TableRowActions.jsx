import Box from '@/Core/components/common/Box';
import Button from '@/Core/components/common/Button';
import PopConfirm from '@/Core/components/common/Popup/PopConfirm';
import { TableContext } from '@/Core/components/common/Table/context/TableProvider';

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useContext } from 'react';

const TableRowActions = ({ value, onDelete, onUpdate }) => {
	const { isScrolling } = useContext(TableContext);
	return (
		<Box className='flex items-center gap-x-1'>
			<Button
				size='xs'
				variant='ghost'
				shape='square'
				icon={PencilSquareIcon}
				onClick={() => {
					onUpdate(value);
				}}
			/>

			<PopConfirm
				okText='Ok'
				cancelText='Cancel'
				title={'Xóa chuyên ngành'}
				description={'Bạn muốn xóa chuyên ngành này ?'}
				forceClose={isScrolling}
				onConfirm={() => onDelete(value)}>
				<Button size='xs' variant='ghost' className='text-error' shape='square' icon={TrashIcon} />
			</PopConfirm>
		</Box>
	);
};

export default TableRowActions;
