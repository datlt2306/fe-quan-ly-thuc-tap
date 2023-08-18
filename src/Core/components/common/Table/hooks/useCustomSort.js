import moment from 'moment';
import { useMemo } from 'react';

export default function useCustomSortTypes() {
	const customSortTypes = useMemo(
		() => ({
			fullTextSort: (rowA, rowB, id) => rowA.values[id].localeCompare(rowB.values[id])
		}),
		[]
	);

	return customSortTypes;
}
