import classNames from 'classnames';
import { forwardRef, useMemo } from 'react';
import { LoadingSpinner } from '../Loading/LoadingSpinner';

/**
 * @param {{as: HTMLElementTagNameMap, size: string, disabled: boolean, loading: boolean, [key: string]: React.ButtonHTMLAttributes }}
 * @returns Tailwind styled Button component
 */
const Button = (
	{
		variant,
		size = 'md',
		shape,
		disabled,
		loading,
		as: Element = 'button', // Polymorphic component, display as other tag
		...props
	},
	ref
) => {
	const buttonStyles = useMemo(
		() =>
			classNames(
				{
					btn: true,
					/* Variant */
					'btn-primary': variant === 'primary',
					'btn-secondary': variant === 'secondary',
					'btn-outline': variant === 'outline',
					'btn-ghost': variant === 'ghost',
					'btn-info': variant === 'info',
					'btn-success': variant === 'success',
					'btn-error': variant === 'error',
					'btn-disabled': variant === 'disabled',
					/* Shape */
					'btn-square': shape === 'square',
					'btn-circle': shape === 'circle',
					'btn-pill': shape === 'pill',
					/* Size */
					'btn-xs': size === 'xs',
					'btn-sm': size === 'sm',
					'btn-md': size === 'md',
					'btn-lg': size === 'lg'
				},
				props.className
			),
		[variant, shape, size]
	);
	return (
		<Element {...props} className={buttonStyles} ref={ref} disabled={variant === 'disabled' || disabled}>
			{loading && <LoadingSpinner size='sm' variant='primary' />}{' '}
			{props.icon && !loading && (
				<props.icon
					className={classNames('aspect-square', {
						'h-4': size === 'xs' || size === 'sm',
						'h-6': size === 'md' || size === 'lg'
					})}
				/>
			)}{' '}
			{props.children}
		</Element>
	);
};

export default forwardRef(Button);
