import classNames from 'classnames';
import { useMemo } from 'react';
import tw from 'twin.macro';

export const Spinner = tw.div`pointer-events-none animate-spin rounded-full border-[3px] border-gray-100 `;

export const LoadingSpinner = ({ size, variant }) => {
	const loadingStyles = useMemo(
		() =>
			classNames({
				loading: true,
				'loading-primary loading-md': !variant && !size,

				// size
				'loading-sm': size === 'sm',
				'loading-md': size === 'md',
				'loading-lg': size === 'lg',
				// variant
				'loading-primary': variant === 'primary',
				'loading-secondary': variant === 'secondary'
			}),
		[variant, size]
	);

	return <div className={loadingStyles} />;
};
