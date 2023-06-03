import React from 'react';
import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';

const LoadingData = () => {
	return (
		<div className='flex items-center justify-center gap-2'>
			<LoadingSpinner variant={'primary'} size='md' />
		</div>
	);
};

export default LoadingData;
