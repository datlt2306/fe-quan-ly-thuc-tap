import classNames from 'classnames';
import React from 'react';

const Text = ({ as: Element = 'span', align = 'left', color = 'default', tw, ...props }) => {
	const styles = classNames(props.className, {
		'text-left': align.includes('left'),
		'text-right': align.includes('right'),
		'text-center': align.includes('center'),
		// color
		'text-base-content': color.includes('default'),
		'text-primary': color.includes('primary'),
		'text-secondary': color.includes('secondary'),
		'text-info': color.includes('info'),
		'text-success': color.includes('success'),
		'text-error': color.includes('error'),
		'text-disabled': color.includes('disabled')
	});
	return (
		<Element {...props} className={styles}>
			{props.children}
		</Element>
	);
};

export default Text;
