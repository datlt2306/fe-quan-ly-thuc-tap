import classNames from 'classnames';
import { forwardRef, useMemo, useRef } from 'react';
import { LoadingSpinner } from '../Loading/LoadingSpinner';

/**
 * @typedef TButtonProps
 * @prop {keyof HTMLElementTagNameMap | React.ElementType} as
 * @prop {'xs' | 'sm' | 'md' | 'lg'} size
 * @prop {'square' | 'pill' | 'circle' | undefined} shape
 * @prop {'primary' | 'secondary' | 'info' | 'success' | 'error' | 'warning' | 'outline' | 'ghost' | 'disabled'} variant
 * @prop {React.ElementType} icon
 * @prop {boolean} loading
 * @prop {string} text
 */

/**
 * @type {React.ForwardRefExoticComponent<TButtonProps & React.HTMLAttributes<HTMLButtonElement>, React.Ref>}
 */
const Button = (
	{
		variant,
		size = 'md',
		shape,
		disabled,
		loading,
		text,
		as: Element = 'button', // Polymorphic button has behaviors as other tag
		...props
	},
	ref
) => {
	const localRef = useRef(null);
	const resolvedRef = ref || localRef;

	const buttonStyles = classNames(
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
	);

	return (
		<Element
			{...props}
			role='button'
			className={buttonStyles}
			ref={resolvedRef}
			disabled={variant === 'disabled' || disabled}>
			{loading && <LoadingSpinner size='sm' />}
			{props.icon && !loading && (
				<props.icon
					className={classNames('aspect-square', {
						'h-4': !size || size === 'xs' || size === 'sm',
						'h-6': size === 'md' || size === 'lg'
					})}
				/>
			)}
			{props.children || text}
		</Element>
	);
};

export default forwardRef(Button);
