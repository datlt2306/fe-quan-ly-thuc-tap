import classNames from 'classnames';
import React from 'react';

const Badge = ({ variant, ...props }) => {
	return (
		<span
			className={classNames('inline-flex items-center gap-x-1.5 rounded-sm px-1.5 py-1 text-xs font-semibold', {
				'bg-primary/10 text-primary': variant === 'primary',
				'bg-success/10 text-success': variant === 'success',
				'bg-info/10 text-info': variant === 'info',
				'bg-error/10 text-error': variant === 'error',
				'bg-warning/10 text-warning': variant === 'warning',
				'bg-disabled/10 text-disabled': variant === 'disabled'
			})}>
			{props.children}
		</span>
	);
};

export default Badge;
