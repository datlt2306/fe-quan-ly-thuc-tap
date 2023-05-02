import classNames from "classnames";
import { useEffect, useLayoutEffect, useState } from "react";

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
	as: Element = "button",
	children,
	...props
}) => {
	const getVariantProp = (value) => {
		switch (value) {
			case "primary":
				return "btn-primary";
			case "secondary":
				return "btn-secondary";
			case "outline":
				return "btn-outline";
			case "ghost":
				return "btn-ghost";
			case "success":
				return "btn-success";
			case "error":
				return "btn-error";
			case "disabled":
				return "btn-disabled";
			default:
				return "btn-default";
		}
	};
	const getSizeProp = (value) => {
		switch (value) {
			case "xs":
				return "btn-xs";
			case "sm":
				return "btn-sm";
			case "md":
				return "btn-md";
			case "lg":
				return "btn-lg";
			default:
				return "btn-md";
		}
	};
	const getShapeProp = (value) => {
		switch (value) {
			case "square":
				return "btn-square";
			case "circle":
				return "btn-circle";
			case "pill":
				return "btn-pill";
			default:
				return "";
		}
	};

	return (
		<Element
			{...props}
			className={classNames(
				"btn",
				getVariantProp(variant),
				getSizeProp(size),
				getShapeProp(shape),
				className
			)}>
			{children}
		</Element>
	);
};

export default Button;
