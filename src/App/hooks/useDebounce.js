import { useState, useEffect } from "react";

/**
 *
 * @param {any} value
 * @param {number} delay
 * @param {(...prams)=> any} callback
 * @returns
 */
export const useDebounce = (value, delay, callback) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(async () => {
			setDebouncedValue(value);
			await callback(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};
