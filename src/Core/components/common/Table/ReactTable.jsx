import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
	ArchiveBoxXMarkIcon,
	ArrowDownIcon,
	ArrowUpIcon,
	ArrowsUpDownIcon,
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { memo, useEffect, useMemo, useReducer } from "react";
import { useFilters, useGlobalFilter, usePagination, useResizeColumns, useSortBy, useTable } from "react-table";
import tw from "twin.macro";
import Button from "../Button";
import ButtonGroup from "../Button/ButtonGroup";
import { Option, Select } from "../FormControl/SelectFieldControl";
import Table from "./CoreTable";
import { GlobalFilter, InputColumnFilter } from "./ReactTableFilters";
import classNames from "classnames";
import { LoadingSpinner } from "../Loading/LoadingSpinner";
import { Skeleton } from "../../customs/Skelton";

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

const ReactTable = ({ columns, data, manualPagination, onPageChange: handlePageChange, onPageSizeChange: handlePageSizeChange, loading }) => {
	const isEmptyData = useMemo(() => Array.isArray(data) && data.length > 0, [data]);
	const filterTypes = useMemo(
		() => ({
			fuzzyText: fuzzyTextFilterFn,
			text: (rows, id, filterValue) => {
				return rows.filter((row) => {
					const rowValue = row.values[id];
					return rowValue !== undefined ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase()) : true;
				});
			},
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
		// preFilteredRows,
		// visibleColumns,
		setAllFilters,
		preGlobalFilteredRows,
		setGlobalFilter,
		state: { pageIndex, pageSize, globalFilter, filters },
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
			manualPagination,
			filterTypes,
		},
		useFilters,
		useGlobalFilter,
		useSortBy,
		usePagination
		// useResizeColumns
	);

	return (
		<Wrapper>
			{/* Global search  */}
			<Header>
				<GlobalFilter preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
				{!!filters.length && (
					<Button size="sm" onClick={() => setAllFilters([])}>
						<XMarkIcon className="h-3.5 w-3.5" /> Xóa lọc
					</Button>
				)}
			</Header>

			{/* Table data */}
			<Body isEmpty={isEmptyData}>
				<Table {...getTableProps()}>
					<Table.Header>
						{headerGroups.map((headerGroup) => (
							<Table.Row {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => {
									return (
										<Table.Cell as="th" {...column.getHeaderProps()}>
											<div className="flex h-12 items-center justify-between gap-6">
												{column.render("Header")}
												<div className="flex items-center gap-[2px]">
													{column.sortable && column.canSort && (
														<Button
															onClick={() => column.toggleSortBy()}
															{...column.getHeaderProps()}
															size="xs"
															variant={column.isSorted ? "primary" : "ghost"}
															shape="square">
															{column.isSorted ? (
																<ArrowDownIcon
																	className={classNames("block h-3.5 w-3.5", {
																		"-rotate-180": column.isSortedDesc,
																	})}
																/>
															) : (
																<ArrowsUpDownIcon className="block h-3.5 w-3.5" />
															)}
														</Button>
													)}
													{column.filterable && column.render("Filter")}
												</div>
											</div>
										</Table.Cell>
									);
								})}
							</Table.Row>
						))}
					</Table.Header>

					<Table.Body {...getTableBodyProps()}>
						{page.map((row) => {
							prepareRow(row);
							return (
								<Table.Row {...row.getRowProps()}>
									{row.cells.map((cell, index) => (
										<Table.Cell key={index} {...cell.getCellProps()}>
											{loading ? <Skeleton /> : cell.render("Cell", { className: "text-blue-500" })}
										</Table.Cell>
									))}
								</Table.Row>
							);
						})}

						{!data.length && (
							<Table.Row>
								<Table.Cell className="text-center text-xl text-disabled">Chưa có dữ liệu</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
			</Body>

			{/* Pagination */}
			<Footer>
				<ButtonGroup>
					<ButtonGroup.Item
						variant={canPreviousPage ? "outline" : "disabled"}
						shape="square"
						onClick={() => {
							gotoPage(0);
						}}
						disabled={!canPreviousPage}>
						<ChevronDoubleLeftIcon className="h-4 w-4" aria-hidden="true" />
					</ButtonGroup.Item>

					<ButtonGroup.Item
						variant={canPreviousPage ? "outline" : "disabled"}
						shape="square"
						onClick={() => {
							previousPage();
						}}
						disabled={!canPreviousPage}>
						<ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
					</ButtonGroup.Item>
					<ButtonGroup.Item
						variant={canNextPage ? "outline" : "disabled"}
						shape="square"
						onClick={() => {
							nextPage();
						}}
						disabled={!canNextPage}>
						<ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
					</ButtonGroup.Item>
					<ButtonGroup.Item
						variant={canNextPage ? "outline" : "disabled"}
						shape="square"
						onClick={() => {
							gotoPage(pageCount - 1);
						}}
						disabled={!canNextPage}>
						<ChevronDoubleRightIcon className="h-4 w-4" aria-hidden="true" />
					</ButtonGroup.Item>
				</ButtonGroup>

				<Seperator />

				<span className="font-medium text-base-content-active">
					Trang {pageIndex + 1}/{pageOptions.length}
				</span>

				<Seperator />

				<div className="flex items-center gap-2">
					<label htmlFor="page-size-select" className="whitespace-nowrap">
						Hiển thị
					</label>
					<Select
						id="page-size-select"
						className="w-full max-w-[128px]"
						defaultValue={pageSize}
						onChange={(e) => {
							setPageSize(e.target.value);
						}}>
						{[10, 20, 30, 50, 100].map((page_size, index) => (
							<Option value={page_size} key={index}>
								{page_size} hàng
							</Option>
						))}
					</Select>
				</div>
			</Footer>
		</Wrapper>
	);
};

// Styled components
const Wrapper = ({ children, ...props }) => (
	<div {...props} tw="flex flex-col items-stretch">
		{children}
	</div>
);
const Header = ({ children, ...props }) => (
	<div {...props} tw="flex items-center justify-between bg-gray-50 p-4">
		{children}
	</div>
);
const Body = ({ children, isEmpty, ...props }) => (
	<div
		{...props}
		className={classNames("h-full max-h-[400px] overflow-x-auto overflow-y-auto overscroll-x-auto", {
			"pb-10 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-200": isEmpty,
			"scrollbar-none": !isEmpty,
		})}>
		{children}
	</div>
);
const Footer = ({ children, ...props }) => (
	<div {...props} tw="flex w-full items-center gap-6 bg-gray-50 p-3">
		{children}
	</div>
);
const Seperator = tw.hr`h-6 min-h-full w-px bg-gray-200`;

export default memo(ReactTable);
