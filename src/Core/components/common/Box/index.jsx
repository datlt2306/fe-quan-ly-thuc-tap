import React, { forwardRef, useRef } from 'react';

/**
 * @type {React.FC<React.CSSProperties & React.PropsWithChildren & React.HTMLAttributes<HTMLDivElement>>}
 */
const Box = forwardRef(({ children, className, style, ...props }, ref) => {
	const localRef = useRef(null);
	const resolvedRef = ref || localRef;
	return (
		<div className={className} style={style} {...props} ref={resolvedRef}>
			{children}
		</div>
	);
});

Box.defaultProps = {
	className: '',
	style: {}
};

export default Box;
