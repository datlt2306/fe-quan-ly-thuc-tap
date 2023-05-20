import classNames from "classnames";
import { useLayoutEffect, useState } from "react";
import Button from ".";
import tw from "twin.macro";

const ButtonGroup = ({ children, ...props }) => {
	return (
		<div
			{...props}
			className="isolate grid w-fit auto-cols-fr grid-flow-col items-center divide-x divide-gray-300 rounded-[4px] ring-[1px] ring-gray-300 [&>*]:rounded-none [&>:first-child]:rounded-l-[4px] [&>:last-child]:rounded-r-[4px]">
			{children}
		</div>
	);
};

ButtonGroup.Item = Button;

export default ButtonGroup;
