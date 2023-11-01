import removeVietnameseTones from '@/Core/utils/removeVietnameseTones';
import { useMemo } from 'react';

export default function useCustomFilterTypes() {
	function fuzzyTextFilterFn(rows, id, filterValue) {
		return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
	}
	fuzzyTextFilterFn.autoRemove = (val) => !val; // Let the table remove the filter if the string is empty

	const customFilterTypes = useMemo(
		() => ({
			fuzzyText: fuzzyTextFilterFn,
			fullTextSearch: (rows, id, filterValue) => {
				const regex = new RegExp(removeVietnameseTones(filterValue), 'gi');
				return rows.filter((row) => {
					const rowValue = row.values[id];
					return rowValue !== undefined ? regex.test(removeVietnameseTones(rowValue)) : true;
				});
			}
		}),
		[]
	);

	return customFilterTypes;
}
