import { useState } from 'react';
import isJSON from '@/Core/utils/checkJsonType';
// Hook
export default function useLocalStorage(key, initialValue) {
	const [storedValue, setStoredValue] = useState(() => {
		const value = localStorage.getItem(key);
		if (!value) {
			localStorage.setItem(key, initialValue);
			return value;
		}

		return isJSON(value) ? JSON.parse(value) : value;
	});

	const setValue = (value) => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.log(error);
		}
	};
	return [storedValue, setValue];
}
