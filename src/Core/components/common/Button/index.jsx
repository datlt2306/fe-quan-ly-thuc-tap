import classNames from "classnames";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";

/**
 * @param {string} size
 * @param {string} color
 * @param {any} children
 * @returns Tailwind styled Button component
 */
const Button = ({
	size = "md",
	variant = "outline",
	shape = undefined,
	className = "",
	as: Element = "button", // Polymorphic component, display as other tag
	children,
	...props
}) => {
	const buttonStyles = useMemo(
		() =>
			classNames(
				{
					// default
					btn: true,
					"btn-md": !size,
					// variant
					"btn-primary": variant === "primary",
					"btn-secondary": variant === "secondary",
					"btn-outline": variant === "outline",
					"btn-ghost": variant === "ghost",
					"btn-success": variant === "success",
					"btn-error": variant === "error",
					"btn-disabled": variant === "disabled",
					// shape
					"btn-square": shape === "square",
					"btn-circle": shape === "circle",
					"btn-pill": shape === "pill",
					// size
					"btn-xs": size === "xs",
					"btn-sm": size === "sm",
					"btn-md": size === "md",
					"btn-lg": size === "lg",
				},
				// others
				className
			),
		[variant, shape, size]
	);
	return (
		<Element {...props} className={buttonStyles}>
			{children}
		</Element>
	);
};

export default Button;
