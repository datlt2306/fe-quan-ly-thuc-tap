import { isRejected, isRejectedWithValue } from '@reduxjs/toolkit';

const RTKQueryLogger = (api) => (next) => (action) => {
	if (isRejectedWithValue(action)) {
		console.log('Lỗi server !');
	}
	return next(action);
};

export default RTKQueryLogger;
