import React from 'react';
import { css } from 'twin.macro';

/**
 * @type {React.FC<React.CSSProperties & React.PropsWithChildren & React.HTMLAttributes<HTMLDivElement>>}
 */
const Box = ({ children, className, style, ...props }) => {
	return (
		<div className={className} style={props.style} {...props}>
			{children}
		</div>
	);
};

Box.defaultProps = {
	className: '',
	style: {}
};

export default Box;
