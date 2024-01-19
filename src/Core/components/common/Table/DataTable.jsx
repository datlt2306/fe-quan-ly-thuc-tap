import useQueryParams from '@/App/hooks/useQueryParams';
import { memo, useEffect, useMemo } from 'react';
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
import DataGrid from './components/DataGrid';
import TablePagination from './components/TablePagination';
import TableToolbar from './components/TableToolbar';
import useCustomFilterTypes from './hooks/useCustomFilter';
import useCustomSortTypes from './hooks/useCustomSort';
import { TableProvider } from './context/TableProvider';

/**
 * @typedef {import('@reduxjs/toolkit/dist/query').QueryDefinition} QueryDefinition
 */

/**
 * @typedef TReactTableProps
 * @prop {()=> QueryActionCreatorResult<QueryDefinition<any, ({ url, method, data, params }: {
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
 * @prop {(arg: any, options?: PrefetchOptions) => void} onPrefetch
 */

/**
 * Core data table component with Tanstack table v7
 * @type {React.FC<TReactTableProps>}
 */
const DataTable = ({
	columns,
	data,
	loading,
	manualPagination,
	paginationState,
	resizable,
	stickyColumn = false,
	onHandleRefetch: handleRefetch,
	onPrefetch: handlePrefetch,
	onGetSelectedRows: handleGetSelectedRows
}) => {
	const extraPlugins = useMemo(
		() => [
			{ enable: resizable, plugins: [useResizeColumns] },
			{ enable: stickyColumn, plugins: [useSticky] },
			{ enable: resizable | stickyColumn, plugins: [useBlockLayout] }
		],
		[stickyColumn]
	);
	const [params] = useQueryParams('page', 'limit');
	const filterTypes = useCustomFilterTypes();
	const sortTypes = useCustomSortTypes();
	const table = useTable(
		{
			columns,
			data,
			initialState: {
				pagination: {
					page: Boolean(params.page) ? +params.page - 1 : 0,
					limit: Boolean(params.limit) ? +params.limit : 10
				}
			},
			manualPagination,
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

	useEffect(() => {
		if (handleGetSelectedRows) handleGetSelectedRows(table.selectedFlatRows.map((d) => d.original));
	}, [table.selectedFlatRows]);

	return (
		<Box className='isolate flex max-h-[75vh] flex-col items-stretch bg-white'>
			<TableToolbar table={table} loading={loading} handleRefetch={handleRefetch} />
			<TableProvider>
				<DataGrid table={table} loading={loading} data={data} columns={columns} resizable={resizable} />
			</TableProvider>
			<TablePagination
				table={table}
				manualPagination={Boolean(manualPagination)}
				onPrefetch={handlePrefetch}
				{...paginationState}
			/>
		</Box>
	);
};

export default memo(DataTable);
