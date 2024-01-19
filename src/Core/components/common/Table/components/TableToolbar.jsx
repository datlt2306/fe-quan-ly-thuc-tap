import { ArrowPathIcon, ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Box from '../../Box';
import Button from '../../Button';
import Tooltip from '../../Tooltip';
import ColumnVisibilityToggle from './ColumnVisibilityToggle';
import { GlobalFilter } from './TableFilter';

const TableToolbar = ({ table, handleRefetch, loading }) => {
	return (
		<Box className='z-20 flex items-center justify-between py-4'>
			<GlobalFilter
				preGlobalFilteredRows={table.preGlobalFilteredRows}
				globalFilter={table.state?.globalFilter}
				setGlobalFilter={table.setGlobalFilter}
				filterFn={'fullTextSeach'}
			/>
			<Box className='flex h-fit w-fit items-center gap-1'>
				{!!table.state?.filters?.length && (
					<Tooltip message='Xóa lọc' position='top'>
						<Button
							size='sm'
							variant='error'
							shape='square'
							className='!h-fit !w-fit'
							onClick={() => table.setAllFilters([])}
							icon={XMarkIcon}
						/>
					</Tooltip>
				)}
				{!!handleRefetch && (
					<Tooltip message='Tải lại' position='top'>
						<Button
							variant='outline'
							shape='square'
							size='xs'
							disabled={loading}
							onClick={handleRefetch}
							icon={ArrowPathIcon}
						/>
					</Tooltip>
				)}
				<Tooltip message='Đặt lại' position='top'>
					<Button
						variant='outline'
						shape='square'
						icon={ArrowUturnLeftIcon}
						size='xs'
						onClick={table.resetResizing}
					/>
				</Tooltip>
				<Tooltip message='View'>
					<ColumnVisibilityToggle table={table} />
				</Tooltip>
			</Box>
		</Box>
	);
};

export default TableToolbar;
