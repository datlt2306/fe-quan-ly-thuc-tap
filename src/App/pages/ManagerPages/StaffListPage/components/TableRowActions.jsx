import Box from '@/Core/components/common/Box';
import Button from '@/Core/components/common/Button';
import PopConfirm from '@/Core/components/common/Popup/PopConfirm';
import { TableContext } from '@/Core/components/common/Table/context/TableProvider';
import Tooltip from '@/Core/components/common/Tooltip';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useContext } from 'react';

const TableRowActions = ({ row, onDelete, onUpdate }) => {
	const { isScrolling } = useContext(TableContext);
	return (
		<Box className='flex items-center gap-x-1'>
			<Tooltip message='Cập nhật'>
				<Button
					size='xs'
					variant='ghost'
					shape='square'
					icon={PencilSquareIcon}
					onClick={() => onUpdate(row.original._id)}
				/>
			</Tooltip>

			<PopConfirm
				okText='Ok'
				cancelText='Cancel'
				title={'Xóa nhân viên'}
				position='right'
				description={'Bạn muốn xóa nhân viên này ?'}
				forceClose={isScrolling}
				onConfirm={() => onDelete(row.original._id)}>
				<Tooltip message='Xóa'>
					<Button size='xs' variant='ghost' className='text-error' shape='square' icon={TrashIcon} />
				</Tooltip>
			</PopConfirm>
		</Box>
	);
};

export default TableRowActions;
