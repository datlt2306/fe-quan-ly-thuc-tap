import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useQueryParams = (...path) => {
	const { search } = useLocation();
	if (!path) {
		return {};
	}
	const query = useMemo(() => new URLSearchParams(search), [search]);
	const queryObject = path.reduce((prevQuery, currentQuery) => {
		return { ...prevQuery, [currentQuery]: query.get(currentQuery) };
	}, {});
	return queryObject;
};
export default useQueryParams;
