import classNames from 'classnames';
import React from 'react';

/**
 *
 * @typedef TTextProps
 * @prop {keyof HTMLElementTagNameMap} as
 * @prop {'base' | 'primary' | 'secondary' | 'info' | 'success' | 'error' | 'disabled'} color
 */

/**
 * @type {React.FC<TTextProps & React.CSSProperties & React.HTMLAttributes<HTMLParagraphElement | HTMLSpanElement>>}
 */
const Text = ({ as: Element, color, ...props }) => {
	const className = classNames(props.className, {
		'text-base-content': color.includes('base'),
		'text-primary': color.includes('primary'),
		'text-secondary': color.includes('secondary'),
		'text-info': color.includes('info'),
		'text-success': color.includes('success'),
		'text-error': color.includes('error'),
		'text-disabled': color.includes('disabled')
	});
	return (
		<Element {...props} className={className} style={props.style}>
			{props.children}
		</Element>
	);
};

Text.defaultProps = {
	color: 'base',
	textAlign: 'left',
	as: 'span'
};

export default Text;
