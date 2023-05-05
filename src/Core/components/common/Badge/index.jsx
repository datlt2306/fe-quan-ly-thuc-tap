import classNames from "classnames";
import React from "react";

const Badge = ({ variant, ...props }) => {
	return (
		<span
			className={classNames(
				"inline-flex items-center gap-x-1.5 rounded-full px-1.5 py-1 text-xs font-medium",
				{
					"bg-primary/25 text-primary": variant === "primary",
					"bg-success/25 text-success": variant === "success",
					"bg-error/25 text-error": variant === "error",
					"bg-warning/25 text-warning": variant === "warning",
					"bg-disabled/25 text-disabled": variant === "disabled",
				}
			)}>
			{props.children}
		</span>
	);
};

export default Badge;
