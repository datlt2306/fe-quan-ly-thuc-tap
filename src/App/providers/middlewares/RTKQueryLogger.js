import { isRejected, isRejectedWithValue } from '@reduxjs/toolkit';

const RTKQueryLogger = (api) => (next) => (action) => {
	if (isRejectedWithValue(action) && import.meta.env.VITE_ENV === 'development') {
		console.log('Lỗi server !');
	}
	return next(action);
};

export default RTKQueryLogger;
