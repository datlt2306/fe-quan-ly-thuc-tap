import classNames from 'classnames';

export const Skeleton = (props) => (
	<div
		{...props}
		className={classNames(
			"relative my-2 h-3 w-full rounded-sm bg-gray-100 before:absolute before:h-full before:w-1/2 before:animate-slide before:bg-gradient-to-r before:from-transparent before:via-gray-50 before:to-transparent before:[content:'*']",
			props.className
		)}></div>
);
