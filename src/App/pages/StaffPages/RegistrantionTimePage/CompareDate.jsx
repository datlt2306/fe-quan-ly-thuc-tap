import Badge from '@/Core/components/common/Badge';
import React from 'react';

const CompareDate = ({ start, end }) => {
	if (!start || !end) {
		return (
			<Badge variant='disabled' size='sm'>
				Chưa có
			</Badge>
		);
	}
	const currentDate = new Date();
	const startComparisonDate = new Date(start);
	const endComparisonDate = new Date(end);
	if (currentDate < startComparisonDate) {
		return (
			<Badge variant='info' size='sm'>
				Sắp tới
			</Badge>
		);
	} else if (currentDate > endComparisonDate) {
		return (
			<Badge variant='error' size='sm'>
				Đã kết thúc
			</Badge>
		);
	} else {
		return (
			<Badge variant='success' size='sm'>
				Đang hoạt động
			</Badge>
		);
	}
};

export default CompareDate;
