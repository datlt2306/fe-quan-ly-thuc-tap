import classNames from 'classnames';
import { useEffect, useLayoutEffect, useMemo, useState, forwardRef } from 'react';

/**
 * @param {string} size
 * @param {string} color
 * @param {any} children
 * @returns Tailwind styled Button component
 */
const Button = (
	{
		variant,
		children,
		size = 'md',
		shape = undefined,
		className = '',
		as: Element = 'button', // Polymorphic component, display as other tag
		...props
	},
	ref
) => {
	const buttonStyles = useMemo(
		() =>
			classNames(
				{
					// default
					btn: true,

					// variant
					'btn-primary': variant === 'primary',
					'btn-secondary': variant === 'secondary',
					'btn-outline': variant === 'outline',
					'btn-ghost': variant === 'ghost',
					'btn-info': variant === 'info',
					'btn-success': variant === 'success',
					'btn-error': variant === 'error',
					'btn-disabled': variant === 'disabled',
					// shape
					'btn-square': shape === 'square',
					'btn-circle': shape === 'circle',
					'btn-pill': shape === 'pill',
					// size
					'btn-xs': size === 'xs',
					'btn-sm': size === 'sm',
					'btn-md': size === 'md',
					'btn-lg': size === 'lg'
				},
				// others
				className
			),
		[variant, shape, size]
	);
	return (
		<Element {...props} className={buttonStyles} ref={ref}>
			{children}
		</Element>
	);
};

export default forwardRef(Button);
