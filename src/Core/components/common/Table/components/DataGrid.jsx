import { ArchiveBoxXMarkIcon, ArrowDownIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { useContext } from 'react';
import Box from '../../Box';
import Button from '../../Button';
import Table from '../Table';
import { TableContext } from '../context/TableProvider';

/**
 * @typedef {import('react-table').TableInstance} TableInstance
 */

/**
 * @type {React.FC<{table: TableInstance<object>, data: Array<unknown> loading: boolean, resizable:boolean}>}
 */
const DataGrid = ({ table, columns, data, resizable, loading }) => {
	const { handleScroll } = useContext(TableContext);
	return (
		<Box
			className={classNames({
				'rounded-md border border-gray-200': data.length === 0
			})}>
			<Box
				onWheel={handleScroll}
				className={classNames('relative z-10 max-h-[60vh] min-h-[3rem] rounded-md', {
					'overflow-y-auto rounded-md border border-gray-200 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-200 scrollbar-corner-transparent  scrollbar-thumb-rounded-md':
						data.length > 0,
					'border-none scrollbar-none': data.length === 0,
					'overflow-x-auto': !loading,
					'overflow-hidden': loading
				})}>
				<Table {...table.getTableProps()}>
					<Table.Header sticky={true}>
						{table.headerGroups.map((headerGroup) => {
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

					<Table.Body {...table.getTableBodyProps()}>
						{loading ? (
							<Table.Pending prepareRows={10} prepareCols={columns?.length} loading={loading} />
						) : (
							data?.length > 0 &&
							table.page.map((row) => {
								table.prepareRow(row);
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
			</Box>
			{!loading && data.length === 0 && (
				<Box className='flex select-none items-center justify-center gap-3 p-6 text-sm text-disabled'>
					<ArchiveBoxXMarkIcon className='h-6 w-6' />
					Không có dữ liệu
				</Box>
			)}
		</Box>
	);
};

export default DataGrid;
