import classNames from 'classnames';
import React, { useMemo } from 'react';

const Typography = ({
	fontWeight = 'medium',
	textAlign = 'left',
	verticalAlign = 'middle',
	level = 1,
	color = 'default',
	...props
}) => {
	const Variant = useMemo(() => {
		switch (level) {
			case 1:
				return 'h1';
			case 2:
				return 'h2';
			case 3:
				return 'h3';
			case 4:
				return 'h4';
			case 5:
				return 'h5';
			case 6:
				return 'h6';
			default:
				return 'h1';
		}
	}, [level]);
	const styles = useMemo(() =>
		classNames(props.className, {
			'font-medium': fontWeight.includes('medium'),
			'font-semibold': fontWeight.includes('semibold'),
			'font-bold': fontWeight.includes('bold'),
			'font-extrabold': fontWeight.includes('extrabold'),
			// text align
			'text-center': textAlign.includes('center'),
			'font-left': textAlign.includes('left'),
			'font-right': textAlign.includes('right'),
			// vertical align
			'align-bottom': verticalAlign.includes('bottom'),
			'align-center': verticalAlign.includes('center'),
			'align-top': verticalAlign.includes('top'),
			// color
			'text-base-content': color.includes('default'),
			'text-primary': color.includes('primary'),
			'text-secondary': color.includes('secondary'),
			'text-info': color.includes('info'),
			'text-success': color.includes('success'),
			'text-error': color.includes('error'),
			'text-disabled': color.includes('disabled'),
			// size
			'text-6xl sm:text-4xl': level === 1,
			'text-5xl sm:text-3xl': level === 2,
			'text-4xl sm:text-2xl': level === 3,
			'text-3xl sm:text-xl': level === 4,
			'text-2xl sm:text-lg': level === 5,
			'text-xl sm:text-base': level === 6
		})
	);
	return (
		<Variant className={styles} {...props}>
			{props.children}
		</Variant>
	);
};

export default Typography;
