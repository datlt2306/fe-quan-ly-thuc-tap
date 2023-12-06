import { PaginationActionEnums } from '@/App/hooks/useServerPagination';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import {
	ArrowDownIcon,
	ArrowPathIcon,
	ArrowUturnLeftIcon,
	ArrowsUpDownIcon,
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	XMarkIcon
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { memo, useEffect, useMemo, useState } from 'react';
import {
	useBlockLayout,
	useFilters,
	useGlobalFilter,
	usePagination,
	useResizeColumns,
	useRowSelect,
	useSortBy,
	useTable
} from 'react-table';
import { useSticky } from 'react-table-sticky';
import Box from '../Box';
import Button from '../Button';
import ButtonGroup from '../Button/ButtonGroup';
import { Option, Select } from '../FormControl/SelectFieldControl';
import Text from '../Text/Text';
import Tooltip from '../Tooltip';
import Table from './Table';
import { GlobalFilter } from './components/ReactTableFilters';
import { Body, Footer, Header } from './components/Styled';
import useCustomFilterTypes from './hooks/useCustomFilter';
import useCustomSortTypes from './hooks/useCustomSort';

/**
 * @typedef {import('@reduxjs/toolkit/dist/query').QueryDefinition} QueryDefinition
 */

/**
 * @typedef TReactTableProps
 * @prop {QueryActionCreatorResult<QueryDefinition<any, ({ url, method, data, params }: {
 *		url: any;
 *		method: any;
 *		data: any;
 *		params: any;
 *	}) => Promise<{
 *		data: AxiosResponse<any, any>;
 *		error?: undefined;
 *	} | {
 *		error: {
 *			status: any;
 *			data: any;
 *		};
 *		data?: undefined;
 *	}>, string, any, string>>} onHandleRefetch
 * @prop {React.Dispatch<React.SetStateAction<any[]>>} onGetSelectedRows
 * @prop {boolean} stickyColumn
 * @prop {boolean} resizable
 * @prop {boolean} loading
 * @prop {boolean} isFetching
 * @prop {React.DispatchWithoutAction} onServerPaginate

 */

/**
 * Core data table component with Tanstack table v7
 * @type {React.FC<TReactTableProps>}
 */
const DataTable = ({
	onHandleRefetch: handleRefetch,
	columns,
	data,
	serverSidePagination,
	serverPaginationProps,
	stickyColumn = false,
	resizable,
	onServerPaginate: dispatch,
	onGetSelectedRows: handleGetSelectedRows,
	loading,
	isFetching
}) => {
	const extraPlugins = useMemo(
		() => [
			{ enable: resizable, plugins: [useResizeColumns] },
			{ enable: stickyColumn, plugins: [useSticky] },
			{ enable: resizable | stickyColumn, plugins: [useBlockLayout] }
		],
		[stickyColumn]
	);

	const filterTypes = useCustomFilterTypes();
	const sortTypes = useCustomSortTypes();
	const {
		getTableProps,
		getTableBodyProps,
		prepareRow,
		resetResizing,
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
		// totalColumnsWidth,
		// rows,
	} = useTable(
		{
			columns,
			data,
			manualPagination: serverSidePagination,
			filterTypes,
			sortTypes
		},
		useFilters,
		useGlobalFilter,
		useSortBy,
		usePagination,
		useRowSelect,
		...extraPlugins
			.filter((plugin) => plugin.enable)
			.map((item) => item.plugins)
			.flat()
	);

	const [isForceRefetch, setIsForceRefetch] = useState(false);

	useEffect(() => {
		if (handleGetSelectedRows) handleGetSelectedRows(selectedFlatRows.map((d) => d.original));
	}, [selectedFlatRows]);

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

	/**
	 * @deprecated
	 */
	const RenderRow = ({ index, style }) => {
		const row = page[index];
		prepareRow(row);
		return (
			<Table.Row {...row.getRowProps({ style })}>
				{row.cells.map((cell, index) => (
					<Table.Cell key={index} {...cell.getCellProps()}>
						{cell.render('Cell', { className: 'border-b border-b-gray-200' })}
					</Table.Cell>
				))}
			</Table.Row>
		);
	};

	return (
		<Box className='isolate flex max-h-[75vh] flex-col items-stretch bg-white'>
			{/* Global search  */}
			<Header>
				<GlobalFilter
					preGlobalFilteredRows={preGlobalFilteredRows}
					globalFilter={globalFilter}
					setGlobalFilter={setGlobalFilter}
					filterFn={'fullTextSeach'}
				/>
				<Box className='flex h-fit w-fit items-center gap-1'>
					{!!filters?.length && (
						<Tooltip message='Xóa lọc' position='top'>
							<Button
								size='sm'
								variant='error'
								shape='square'
								className='!h-fit !w-fit'
								onClick={() => setAllFilters([])}
								icon={XMarkIcon}
							/>
						</Tooltip>
					)}
					<Tooltip message='Đặt lại' position='top'>
						<Button
							variant='outline'
							shape='square'
							icon={ArrowUturnLeftIcon}
							size='xs'
							onClick={resetResizing}
						/>
					</Tooltip>

					{!!handleRefetch && (
						<Tooltip message='Tải lại' position='top'>
							<Button
								variant='outline'
								shape='square'
								size='xs'
								disabled={loading || isFetching}
								onClick={() => {
									setIsForceRefetch(true);
									handleRefetch();
								}}
								icon={ArrowPathIcon}
							/>
						</Tooltip>
					)}
				</Box>
			</Header>

			{/* Table data */}
			<Body isEmpty={data.length === 0} loading={loading}>
				<Table {...getTableProps()}>
					<Table.Header sticky={true}>
						{headerGroups.map((headerGroup) => {
							const { style, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
							return (
								<Table.Row {...headerGroupProps} className='bg-white' style={loading ? null : style}>
									{headerGroup.headers.map((column, index) => {
										const { style, ...headerCellProps } = column?.getHeaderProps();
										return (
											<Table.Cell key={index} as='th' {...headerCellProps} style={loading ? null : style}>
												{resizable && (
													<Table.Resizer isResizing={column?.isResizing} {...column?.getResizerProps()} />
												)}
												<Box className='flex h-12 items-center justify-between gap-3'>
													{column?.render('Header')}
													<Box className='flex items-center gap-px'>
														{column.sortable && column.canSort && (
															<Button
																onClick={() => column?.toggleSortBy()}
																{...column?.getHeaderProps()}
																size='xs'
																className='z-0 !h-fit !w-fit'
																variant={column.isSorted ? 'primary' : 'ghost'}
																shape='square'>
																{column.isSorted ? (
																	<ArrowDownIcon
																		className={classNames(' h-3.5 w-3.5', {
																			'-rotate-180': column.isSortedDesc
																		})}
																	/>
																) : (
																	<ArrowsUpDownIcon className=' h-3.5 w-3.5' />
																)}
															</Button>
														)}
														{!column?.resizing && column.filterable && column.render('Filter')}
													</Box>
												</Box>
											</Table.Cell>
										);
									})}
								</Table.Row>
							);
						})}
					</Table.Header>

					<Table.Body {...getTableBodyProps()}>
						{loading ? (
							<Table.Pending prepareRows={10} prepareCols={columns?.length} loading={loading} />
						) : (
							data?.length > 0 &&
							page.map((row) => {
								prepareRow(row);
								return (
									<Table.Row {...row.getRowProps()}>
										{row.cells?.map((cell, index) => (
											<Table.Cell key={index} {...cell?.getCellProps()}>
												{cell.render('Cell', { className: 'border-b border-b-gray-200' })}
											</Table.Cell>
										))}
									</Table.Row>
								);
							})
						)}
					</Table.Body>
				</Table>
			</Body>
			{!loading && data.length === 0 && <Body.Empty />}
			{/* Pagination */}
			<Footer>
				<Footer.Item>
					<ButtonGroup>
						<ButtonGroup.Item
							shape='square'
							size='xs'
							variant={hasPreviousPage ? 'ghost' : 'disabled'}
							onClick={gotoFirstPage}
							icon={ChevronDoubleLeftIcon}
						/>
						<ButtonGroup.Item
							shape='square'
							size='xs'
							variant={hasPreviousPage ? 'ghost' : 'disabled'}
							onClick={gotoPreviousPage}
							icon={ChevronLeftIcon}
						/>
						<ButtonGroup.Item
							shape='square'
							size='xs'
							variant={hasNextPage ? 'ghost' : 'disabled'}
							onClick={gotoNextPage}
							icon={ChevronRightIcon}
						/>
						<ButtonGroup.Item
							shape='square'
							size='xs'
							variant={hasNextPage ? 'ghost' : 'disabled'}
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
							: `${pageIndex + 1}/${pageOptions?.length}`}
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
		</Box>
	);
};

export default memo(DataTable);
