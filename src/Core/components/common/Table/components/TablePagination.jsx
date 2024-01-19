import React from 'react';
import ButtonGroup from '../../Button/ButtonGroup';
import Text from '../../Text/Text';
import { Option, Select } from '../../FormControl/SelectFieldControl';
import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	ChevronLeftIcon,
	ChevronRightIcon
} from '@heroicons/react/24/outline';
import useQueryParams from '@/App/hooks/useQueryParams';
import tw from 'twin.macro';
import Box from '../../Box';

/**
 * @typedef {import('react-table').TableInstance} TableInstance
 */

/**
 * @typedef TablePaginationProps
 * @prop {import('react-table').TableInstance<object>} table
 * @prop {boolean} manualPagination
 * @prop {boolean} hasPrevPage
 * @prop {boolean} hasNextPage
 * @prop {number} limit
 * @prop {number} page
 * @prop {number} totalDocs
 * @prop {(arg: any, options?: PrefetchOptions) => void} onPrefetch
 */

/**
 *  @type {React.FC<TablePaginationProps>}
 */
const TablePagination = ({
	hasNextPage,
	hasPrevPage,
	totalPages,
	limit,
	page,
	totalDocs,
	table,
	manualPagination,
	onPrefetch: handlePrefetch
}) => {
	const canNextPage = manualPagination ? hasNextPage : table.canNextPage;
	const canPreviousPage = manualPagination ? hasPrevPage : table.canPreviousPage;
	const pageCount = manualPagination ? totalPages : table.pageOptions.length;
	const pageSize = manualPagination ? limit : table.state.pageSize;
	const pageIndex = manualPagination ? page : table.state.pageIndex + 1;
	const [_, setParams] = useQueryParams();

	console.log(table.selectedFlatRows);

	const gotoFirstPage = () => {
		table.gotoPage(0);
		setParams('page', 1);
	};

	const gotoPreviousPage = () => {
		table.previousPage();
		setParams('page', pageIndex - 1);
	};

	const gotoNextPage = () => {
		table.nextPage();
		setParams('page', pageIndex + 1);
	};

	const gotoLastPage = () => {
		table.gotoPage(table.pageCount - 1);
		setParams('page', pageCount);
	};

	const changePageSize = (value) => {
		if (value > totalDocs) {
			gotoFirstPage();
		}
		setParams('limit', value);
		if (!manualPagination) table.setPageSize(value);
	};

	return (
		<Box className='flex w-full items-center justify-between'>
			<Text as='p' className='whitespace-nowrap text-sm font-medium'>
				{table.selectedFlatRows.length} trong {table.initialRows.length} được chọn
			</Text>
			<Box className='flex w-full items-stretch justify-end divide-x-[2px] divide-gray-200 py-4 [&>:first-child]:!pl-0 [&>:last-child]:!pr-0'>
				<Box className='px-6'>
					<Text
						as='label'
						htmlFor='page-size-select'
						className='flex items-center gap-2 whitespace-nowrap text-sm font-medium'>
						Hiển thị
						<Select
							id='page-size-select'
							className='w-full max-w-[128px]'
							defaultValue={pageSize}
							onChange={(e) => changePageSize(+e.target.value)}>
							{[10, 20, 30, 50].map((page_size) => (
								<Option value={page_size} key={page_size}>
									{page_size} hàng
								</Option>
							))}
						</Select>
					</Text>
				</Box>
				<Box className='inline-flex items-center px-6 text-center'>
					<Text as='span' className='text-sm font-medium text-base-content-active sm:hidden'>
						Trang {pageIndex ?? 1}/{pageCount ?? 1}
					</Text>
				</Box>
				<Box className='px-6'>
					<ButtonGroup>
						<ButtonGroup.Item
							shape='square'
							size='xs'
							variant={canPreviousPage ? 'ghost' : 'disabled'}
							onClick={gotoFirstPage}
							icon={ChevronDoubleLeftIcon}
						/>
						<ButtonGroup.Item
							shape='square'
							size='xs'
							variant={canPreviousPage ? 'ghost' : 'disabled'}
							onClick={gotoPreviousPage}
							icon={ChevronLeftIcon}
						/>
						<ButtonGroup.Item
							shape='square'
							size='xs'
							variant={canNextPage ? 'ghost' : 'disabled'}
							onClick={gotoNextPage}
							onMouseEnter={() => {
								if (handlePrefetch && manualPagination)
									handlePrefetch({ limit: pageSize, page: pageIndex + 1 });
							}}
							icon={ChevronRightIcon}
						/>
						<ButtonGroup.Item
							shape='square'
							size='xs'
							variant={canNextPage ? 'ghost' : 'disabled'}
							onClick={gotoLastPage}
							onMouseEnter={() => {
								if (handlePrefetch && manualPagination) handlePrefetch({ limit: pageSize, page: pageCount });
							}}
							icon={ChevronDoubleRightIcon}
						/>
					</ButtonGroup>
				</Box>
			</Box>
		</Box>
	);
};

export const Pagination = tw.div``;
Pagination.Item = tw.div`px-6`;

export default TablePagination;
