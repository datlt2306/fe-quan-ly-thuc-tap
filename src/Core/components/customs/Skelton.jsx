export const Skeleton = ({ height = 1, shape, ...props }) => (
	<div
		style={{ height: `${height}rem` }}
		{...props}
		className="
		relative
		my-2
      w-full
		rounded-sm
		bg-gray-100
		before:absolute
      before:h-full
		before:w-1/2
		before:animate-slide
		before:bg-gradient-to-r
		before:from-transparent
		before:via-gray-50
		before:to-transparent
		before:[content:'*']
		"></div>
);
