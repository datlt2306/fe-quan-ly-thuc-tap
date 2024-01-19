import { createContext, useState, useRef } from 'react';

export const TableContext = createContext();

export const TableProvider = ({ children }) => {
	const [isScrolling, setIsScrolling] = useState(false);
	const timeoutRef = useRef();

	const handleScroll = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setIsScrolling(true);
		timeoutRef.current = setTimeout(() => {
			setIsScrolling(false);
		}, 100);
	};

	return <TableContext.Provider value={{ isScrolling, handleScroll }}>{children}</TableContext.Provider>;
};
