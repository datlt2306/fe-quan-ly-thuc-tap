/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import {
	ArrowDownIcon,
	ArrowsUpDownIcon,
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	XMarkIcon
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { memo, useEffect, useMemo } from 'react';
import { useFilters, useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import tw from 'twin.macro';
import Button from '../Button';
import ButtonGroup from '../Button/ButtonGroup';
import { Option, Select } from '../FormControl/SelectFieldControl';
import Table from './CoreTable';
import { GlobalFilter, InputColumnFilter } from './ReactTableFilters';
import Text from '../Text/Text';

/**
 *
 * @param {Array} columns
 * @param {any} data
 * @returns React table element
 */

function fuzzyTextFilterFn(rows, id, filterValue) {
	return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}
// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

const ReactTable = ({ columns, data, manualPagination, onGetSelectedRows: handleGetSelectedRows, loading }) => {
	const isEmptyData = useMemo(() => Array.isArray(data) && data.length > 0, [data]);
	const filterTypes = useMemo(
		() => ({
			fuzzyText: fuzzyTextFilterFn,
			text: (rows, id, filterValue) => {
				return rows.filter((row) => {
					const rowValue = row.values[id];
					return rowValue !== undefined
						? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
						: true;
				});
			}
		}),
		[]
	);
	const defaultColumn = useMemo(() => ({ Filter: InputColumnFilter }), []);

	const {
		// Default react table props
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		prepareRow,
		// Pagination props
		canNextPage,
		canPreviousPage,
		nextPage,
		previousPage,
		pageCount,
		pageOptions,
		gotoPage,
		setPageSize,
		selectedFlatRows,
		setAllFilters,
		preGlobalFilteredRows,
		setGlobalFilter,
		state: { pageIndex, pageSize, globalFilter, filters, selectedRowIds }
		// preFilteredRows,
		// visibleColumns,
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
			manualPagination,
			filterTypes
		},
		useFilters,
		useGlobalFilter,
		useSortBy,
		usePagination,
		useRowSelect
	);

	useEffect(() => {
		if (handleGetSelectedRows) handleGetSelectedRows(selectedFlatRows.map((d) => d.original));
	}, [selectedFlatRows]);

	return (
		<Wrapper>
			{/* Global search  */}
			<Header>
				<GlobalFilter
					preGlobalFilteredRows={preGlobalFilteredRows}
					globalFilter={globalFilter}
					setGlobalFilter={setGlobalFilter}
				/>
				{!!filters.length && (
					<Button size='sm' onClick={() => setAllFilters([])}>
						<XMarkIcon className='h-3.5 w-3.5' /> Xóa lọc
					</Button>
				)}
			</Header>

			{/* Table data */}
			<Body isEmpty={isEmptyData}>
				<Table {...getTableProps()}>
					<Table.Header sticky={true}>
						{headerGroups.map((headerGroup) => (
							<Table.Row {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => (
									<Table.Cell as='th' {...column.getHeaderProps()}>
										<HeaderCell>
											{column.render('Header')}
											<HeaderCell.Actions>
												{column.sortable && column.canSort && (
													<Button
														onClick={() => column.toggleSortBy()}
														{...column.getHeaderProps()}
														size='xs'
														variant={column.isSorted ? 'primary' : 'ghost'}
														shape='square'>
														{column.isSorted ? (
															<ArrowDownIcon
																className={classNames('block h-3.5 w-3.5', {
																	'-rotate-180': column.isSortedDesc
																})}
															/>
														) : (
															<ArrowsUpDownIcon className='block h-3.5 w-3.5' />
														)}
													</Button>
												)}
												{column.filterable && column.render('Filter')}
											</HeaderCell.Actions>
										</HeaderCell>
									</Table.Cell>
								))}
							</Table.Row>
						))}
					</Table.Header>

					<Table.Body {...getTableBodyProps()}>
						{loading ? (
							<Table.Pending numOfCols={columns.length} />
						) : data.length ? (
							page.map((row) => {
								prepareRow(row);
								return (
									<Table.Row {...row.getRowProps()}>
										{row.cells.map((cell, index) => (
											<Table.Cell key={index} {...cell.getCellProps()}>
												{cell.render('Cell', { className: 'text-blue-500' })}
											</Table.Cell>
										))}
									</Table.Row>
								);
							})
						) : (
							<Table.Empty />
						)}
					</Table.Body>
				</Table>
			</Body>

			{/* Pagination */}
			<Footer>
				<Footer.Item>
					<ButtonGroup>
						<ButtonGroup.Item
							variant={canPreviousPage ? 'ghost' : 'disabled'}
							shape='square'
							onClick={() => {
								gotoPage(0);
							}}
							disabled={!canPreviousPage}>
							<ChevronDoubleLeftIcon className='h-4 w-4' aria-hidden='true' />
						</ButtonGroup.Item>

						<ButtonGroup.Item
							variant={canPreviousPage ? 'ghost' : 'disabled'}
							shape='square'
							onClick={() => {
								previousPage();
							}}
							disabled={!canPreviousPage}>
							<ChevronLeftIcon className='h-4 w-4' aria-hidden='true' />
						</ButtonGroup.Item>
						<ButtonGroup.Item
							variant={canNextPage ? 'ghost' : 'disabled'}
							shape='square'
							onClick={() => {
								nextPage();
							}}
							disabled={!canNextPage}>
							<ChevronRightIcon className='h-4 w-4' aria-hidden='true' />
						</ButtonGroup.Item>
						<ButtonGroup.Item
							variant={canNextPage ? 'ghost' : 'disabled'}
							shape='square'
							onClick={() => {
								gotoPage(pageCount - 1);
							}}
							disabled={!canNextPage}>
							<ChevronDoubleRightIcon className='h-4 w-4' aria-hidden='true' />
						</ButtonGroup.Item>
					</ButtonGroup>
				</Footer.Item>

				<Footer.Item className='inline-flex items-center text-center'>
					<Text as='span' className='font-medium text-base-content-active sm:hidden'>
						Trang {pageIndex + 1}/{pageOptions.length}
					</Text>
				</Footer.Item>

				<Footer.Item>
					<label htmlFor='page-size-select' className='flex items-center gap-2 whitespace-nowrap'>
						Hiển thị
						<Select
							id='page-size-select'
							className='w-full max-w-[128px]'
							defaultValue={pageSize}
							onChange={(e) => {
								setPageSize(e.target.value);
							}}>
							{[10, 20, 30, 50].map((page_size, index) => (
								<Option value={page_size} key={index}>
									{page_size} hàng
								</Option>
							))}
						</Select>
					</label>
				</Footer.Item>
			</Footer>
		</Wrapper>
	);
};

// Styled components
const Wrapper = ({ children, ...props }) => (
	<div {...props} tw='flex flex-col items-stretch'>
		{children}
	</div>
);
const Header = ({ children, ...props }) => (
	<div {...props} tw='flex items-center justify-between bg-gray-50 p-4'>
		{children}
	</div>
);
const HeaderCell = tw.div`flex h-12 items-center justify-between gap-6`;
HeaderCell.Actions = tw.div`flex items-center gap-px`;
const Body = ({ children, isEmpty, ...props }) => (
	<div
		{...props}
		className={classNames('relative overflow-x-auto overscroll-x-auto', {
			'pb-10 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-200': isEmpty,
			'scrollbar-none': !isEmpty
		})}>
		{children}
	</div>
);
const Footer = ({ children, ...props }) => (
	<div
		{...props}
		tw='flex w-full items-stretch bg-gray-50 p-3 divide-x divide-gray-300 [&>:first-child]:!pl-0 [&>:last-child]:!pr-0'>
		{children}
	</div>
);
Footer.Item = ({ ...props }) => (
	<div {...props} className={classNames('px-6', props.className)}>
		{props.children}
	</div>
);

export default memo(ReactTable);
