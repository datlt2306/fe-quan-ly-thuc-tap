import _ from 'lodash';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * @param  {...string} path
 * @returns {[Record<string, string>, (key: string, value: any) => void, (key: string) => void]}
 */
export default function useQueryParams(...path) {
	const [searchParmams, setSearchParams] = useSearchParams();
	const params =
		path.length === 0
			? Object.fromEntries(searchParmams.entries())
			: _.pick(Object.fromEntries(searchParmams.entries()), path);

	const setParam = (key, value) =>
		setSearchParams((params) => {
			params.set(key, value);
			return params;
		});

	const removeParam = (key) => {
		setSearchParams((params) => {
			params.delete(key);
			return params;
		});
	};

	return [params, setParam, removeParam];
}
