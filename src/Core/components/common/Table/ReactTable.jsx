import { Popover, Transition } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	FunnelIcon,
} from "@heroicons/react/24/outline";
import { Fragment, memo, useMemo } from "react";
import { useFilters, useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import tw from "twin.macro";
import Button from "../Button";
import ButtonGroup from "../Button/ButtonGroup";
import { Select } from "../FormControl/SelectFieldControl";
import { Input } from "../FormControl/TextFieldControl";
import Table from "./CoreTable";

// Styled components
const Seperator = tw.hr`h-6 min-h-full w-px bg-gray-200`;

// Table filter global
const GlobalFilter = ({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) => {
	const count = preGlobalFilteredRows.length; // tổng số record được search
	const [value, setValue] = useState(globalFilter); // giá trị được tìm kiếm trong toàn bộ record
	const onChange = useAsyncDebounce((value) => {
		setGlobalFilter(value || undefined);
	}, 200);
};

// Default filter component
const InputColumnFilter = ({ column: { filterable, filterValue, preFilteredRows, setFilter } }) => {
	const count = preFilteredRows.length;
	return (
		<Popover className="relative inline-block text-left" as="div">
			<Popover.Button as="div">
				<Button variant="ghost" shape="square" size="xs">
					<FunnelIcon className="h-3.5 w-3.5 text-gray-600" />
				</Button>
			</Popover.Button>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95">
				<Popover.Panel className="absolute left-0 right-0 top-8 z-10 w-[160px] rounded-md shadow-lg">
					<Input
						value={filterValue || ""}
						onChange={(e) => setFilter(e.target.value)}
						className="w-full"
						placeholder={`Tìm trong ${count} hàng...`}
					/>
				</Popover.Panel>
			</Transition>
		</Popover>
	);
};

/**
 *
 * @param {Array} columns
 * @param {any} data
 * @returns React table element
 */
const ReactTable = ({ columns, data }) => {
	const availablePageSize = useMemo(() => [10, 20, 30, 50, 100], []);

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
		// preGlobalFilteredRows,
		// setGlobalFilter,
		state: { pageIndex, pageSize },
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
			initialState: { pageSize: 6 },
			// filterTypes,
		},
		useGlobalFilter,
		useFilters,
		useSortBy,
		usePagination
	);
	return (
		<div className="invisible-scroll overflow-x-auto pb-10 [clip-path:inset(0)]">
			<Table {...getTableProps()}>
				<Table.Header>
					{headerGroups.map((headerGroup) => (
						<Table.Row className="align-top" {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => {
								return (
									<Table.Cell as="th" {...column.getHeaderProps()}>
										<div className="flex h-12 items-center justify-between gap-6">
											{column.render("Header")}
											<div className="flex items-center gap-1">
												{column.canSort && (
													<Button
														onClick={() => column.toggleSortBy()}
														{...column.getHeaderProps()}
														size="xs"
														variant="ghost"
														shape="square">
														{column.isSortedDesc ? (
															<ArrowDownIcon className="block h-3.5 w-3.5" />
														) : (
															<ArrowUpIcon className="block h-3.5 w-3.5" />
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
								{row.cells.map((cell) => (
									<Table.Cell {...cell.getCellProps()}>{cell.render("Cell")}</Table.Cell>
								))}
							</Table.Row>
						);
					})}
				</Table.Body>

				<Table.Footer>
					<Table.Row>
						<Table.Cell align="center" colSpan="100%">
							<div className="flex w-full items-center gap-6">
								<ButtonGroup>
									<ButtonGroup.Item
										variant={canPreviousPage ? "outline" : "disabled"}
										shape="square"
										onClick={() => gotoPage(0)}
										disabled={!canPreviousPage}>
										<ChevronDoubleLeftIcon className="h-4 w-4" aria-hidden="true" />
									</ButtonGroup.Item>

									<ButtonGroup.Item
										variant={canPreviousPage ? "outline" : "disabled"}
										shape="square"
										onClick={() => previousPage()}
										disabled={!canPreviousPage}>
										<ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
									</ButtonGroup.Item>
									<ButtonGroup.Item
										variant={canNextPage ? "outline" : "disabled"}
										shape="square"
										onClick={() => nextPage()}
										disabled={!canNextPage}>
										<ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
									</ButtonGroup.Item>
									<ButtonGroup.Item
										variant={canNextPage ? "outline" : "disabled"}
										shape="square"
										onClick={() => gotoPage(pageCount - 1)}
										disabled={!canNextPage}>
										<ChevronDoubleRightIcon className="h-4 w-4" aria-hidden="true" />
									</ButtonGroup.Item>
								</ButtonGroup>

								<Seperator />

								<b>
									Trang {pageIndex + 1}/{pageOptions.length}
								</b>

								<Seperator />

								<div className="flex items-center gap-2">
									<label htmlFor="page-size-select">Hiển thị</label>
									<Select
										id="page-size-select"
										onChange={(e) => setPageSize(e.target.value)}>
										{availablePageSize.map((page_size, index) => (
											<option value={page_size} key={index}>
												{page_size} hàng
											</option>
										))}
									</Select>
								</div>
							</div>
						</Table.Cell>
					</Table.Row>
				</Table.Footer>
			</Table>
		</div>
	);
};

export { InputColumnFilter, GlobalFilter };
export default memo(ReactTable);
