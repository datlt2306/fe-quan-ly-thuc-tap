import { PaginationActionEnums } from '@/App/hooks/useServerPagination';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import {
	ArrowDownIcon,
	ArrowPathIcon,
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
import Text from '../Text/Text';
import Table from './CoreTable';
import { GlobalFilter } from './ReactTableFilters';

function fuzzyTextFilterFn(rows, id, filterValue) {
	return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}
fuzzyTextFilterFn.autoRemove = (val) => !val; // Let the table remove the filter if the string is empty

/**
 * @prop {Array} columns
 * @prop {Array} data
 * @prop {boolean} serverSidePagination
 * @prop {Function} onGetSelectedRows
 * @prop {boolean} loading
 * @returns React table element
 */
const ReactTable = ({
	onHandleRefetch,
	columns,
	data,
	serverSidePagination,
	serverPaginationProps,
	onServerPaginate: dispatch,
	onGetSelectedRows: handleGetSelectedRows,
	loading
}) => {
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

	const {
		getTableProps,
		getTableBodyProps,
		prepareRow,
		headerGroups,
		page,
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
			manualPagination: serverSidePagination,
			filterTypes
			// defaultColumn,
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

	const isEmptyData = Array.isArray(data) && data.length > 0;
	const hasNextPage = serverSidePagination ? serverPaginationProps.canNextPage : canNextPage;
	const hasPreviousPage = serverSidePagination ? serverPaginationProps.canPreviousPage : canPreviousPage;

	const gotoFirstPage = () => {
		serverSidePagination ? dispatch({ type: PaginationActionEnums.GO_TO_FIRST_PAGE }) : gotoPage(0);
	};
	const gotoPreviousPage = () => {
		serverSidePagination ? dispatch({ type: PaginationActionEnums.GO_TO_PREV_PAGE }) : previousPage();
	};
	const gotoNextPage = () => {
		serverSidePagination ? dispatch({ type: PaginationActionEnums.GO_TO_NEXT_PAGE }) : nextPage();
	};
	const gotoLastPage = () => {
		serverSidePagination
			? dispatch({
					type: PaginationActionEnums.GO_TO_LAST_PAGE,
					payload: serverPaginationProps?.totalPages
			  })
			: gotoPage(pageCount - 1);
	};
	const changePageSize = (value) => {
		if (serverSidePagination) {
			if (serverPaginationProps.pageIndex >= serverPaginationProps.totalPages) gotoPreviousPage();
			dispatch({
				type: PaginationActionEnums.CHANGE_PAGE_SIZE,
				payload: value
			});
			return;
		}

		setPageSize(value);
	};

	return (
		<Wrapper>
			{/* Global search  */}
			<Header>
				<GlobalFilter
					preGlobalFilteredRows={preGlobalFilteredRows}
					globalFilter={globalFilter}
					setGlobalFilter={setGlobalFilter}
				/>
				<ButtonList>
					{!!filters.length && (
						<Button size='sm' onClick={() => setAllFilters([])} icon={XMarkIcon}>
							Xóa lọc
						</Button>
					)}
					{!!onHandleRefetch && (
						<Button
							variant={loading ? 'disabled' : 'primary'}
							size='sm'
							icon={ArrowPathIcon}
							onClick={onHandleRefetch}>
							Reload
						</Button>
					)}
				</ButtonList>
			</Header>

			{/* Table data */}
			<Body isEmpty={isEmptyData}>
				<Table {...getTableProps()}>
					<Table.Header sticky={true}>
						{headerGroups.map((headerGroup) => (
							<Table.Row {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column, index) => (
									<Table.Cell key={index} as='th' {...column.getHeaderProps()}>
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
							<Table.Pending prepareRows={10} prepareCols={columns.length} />
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
							variant={hasPreviousPage ? 'ghost' : 'disabled'}
							shape='square'
							size='sm'
							onClick={gotoFirstPage}
							icon={ChevronDoubleLeftIcon}
						/>
						<ButtonGroup.Item
							variant={hasPreviousPage ? 'ghost' : 'disabled'}
							shape='square'
							size='sm'
							onClick={gotoPreviousPage}
							icon={ChevronLeftIcon}
						/>

						<ButtonGroup.Item
							variant={hasNextPage ? 'ghost' : 'disabled'}
							shape='square'
							size='sm'
							onClick={gotoNextPage}
							icon={ChevronRightIcon}
						/>
						<ButtonGroup.Item
							variant={hasNextPage ? 'ghost' : 'disabled'}
							shape='square'
							size='sm'
							onClick={gotoLastPage}
							icon={ChevronDoubleRightIcon}
						/>
					</ButtonGroup>
				</Footer.Item>

				<Footer.Item className='inline-flex items-center text-center'>
					<Text as='span' className='font-medium text-base-content-active sm:hidden'>
						Trang{' '}
						{serverSidePagination
							? `${serverPaginationProps?.pageIndex}/${serverPaginationProps?.totalPages}`
							: `${pageIndex + 1}/${pageOptions.length}`}
					</Text>
				</Footer.Item>

				<Footer.Item>
					<Text as='label' htmlFor='page-size-select' className='flex items-center gap-2 whitespace-nowrap'>
						Hiển thị
						<Select
							id='page-size-select'
							className='w-full max-w-[128px]'
							defaultValue={serverSidePagination ? serverPaginationProps.pageSize : pageSize}
							onChange={(e) => changePageSize(+e.target.value)}>
							{[10, 20, 30, 50].map((page_size) => (
								<Option value={page_size} key={page_size}>
									{page_size} hàng
								</Option>
							))}
						</Select>
					</Text>
				</Footer.Item>
			</Footer>
		</Wrapper>
	);
};

// Styled components
const Wrapper = tw.div`flex flex-col items-stretch bg-white isolate`;
const Header = tw.div`flex items-center justify-between bg-gray-50 p-4 z-0`;
const ButtonList = tw.div`flex items-center gap-1`;
const Body = ({ isEmpty, ...props }) => (
	<div
		{...props}
		className={classNames('overflow-x-auto', {
			'py-10 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-200': isEmpty,
			'scrollbar-none': !isEmpty
		})}>
		{props.children}
	</div>
);
const HeaderCell = tw.div`flex h-12 items-center justify-between gap-6`;
const Footer = tw.div`flex w-full items-stretch bg-gray-50 p-3 divide-x divide-gray-300 [&>:first-child]:!pl-0 [&>:last-child]:!pr-0`;
HeaderCell.Actions = tw.div`flex items-center gap-px`;
Footer.Item = tw.div`px-6`;

export default memo(ReactTable);
