import classNames from 'classnames';
import React, { memo } from 'react';

/**
 * @typedef TTooltipProps
 * @prop {string} message
 * @prop {'top' | 'bottom' | 'right' | 'left'} position
 */

/**
 *  @type {React.FC<TTooltipProps & React.PropsWithChildren & React.HTMLAttributes<HTMLDivElement>> }
 */

const Tooltip = ({ children, className, style, position, ...props }) => {
	return (
		<div role='tooltip' className={className} style={style} {...props}>
			<div className='group relative'>
				{children}
				<div
					className={classNames('tooltip', {
						'tooltip-top': position === 'top',
						'tooltip-bottom': position === 'bottom',
						'tooltip-right': position === 'right',
						'tooltip-left': position === 'left'
					})}>
					{props.message}
				</div>
			</div>
		</div>
	);
};

Tooltip.defaultProps = {
	className: '',
	position: 'right'
};

export default memo(Tooltip);
