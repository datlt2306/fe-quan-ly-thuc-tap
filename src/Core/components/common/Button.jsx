import { useCallback } from "react";
import tw from "twin.macro";

const Button = ({ size, color, children }) => {
	const getSizeProp = useCallback((size) => {
		switch (size) {
			case "sm":
				return tw`px-2 py-1 text-sm`;
			case "md":
				return tw`px-3 py-2`;
			case "lg":
				return tw`px-3.5 py-2.5`;
			default:
				return tw`px-3 py-2`;
		}
	}, []);

	const getColorProp = useCallback((color) => {
		switch (color) {
			case "primary":
				return tw`bg-primary`;
			case "secondary":
				return tw`bg-secondary `;
			case "error":
				return tw`bg-error `;
			case "ghost":
				return tw`bg-transparent text-gray-600 hover:bg-gray-100`;
			case "outline":
				return tw`bg-transparent ring-1 ring-gray-300 hover:bg-gray-100 hover:ring-gray-300 text-gray-600`;
			default:
				return tw`bg-gray-700`;
		}
	}, []);

	return (
		<button
			css={[
				tw`opacity-90 hover:opacity-100 flex items-center gap-2 justify-center rounded font-semibold text-white  focus-visible:outline focus-visible:outline-2 duration-200 focus:active:scale-95`,
				getSizeProp(size),
				getColorProp(color),
			]}>
			{children}
		</button>
	);
};

export default Button;
