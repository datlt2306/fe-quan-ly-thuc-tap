import tw from "twin.macro";

export const Spinner = tw.div`pointer-events-none animate-spin rounded-full border-[3px] border-gray-100 `;

export const LoadingSpinner = ({ size, color }) => {
	const getSizeProp = (sizeProp) => {
		switch (sizeProp) {
			case "sm":
				return tw`h-4 w-4`;
			case "md":
				return tw`h-6 w-6`;
			case "md":
				return tw`h-8 w-8`;
			default:
				return tw`h-4 w-4`;
		}
	};

	const getColorProp = (colorProp) => {
		switch (colorProp) {
			case "primary":
				return tw`border-r-primary border-t-primary`;
			case "primary":
				return tw`border-r-secondary border-t-secondary`;
			default:
				return tw`border-r-primary border-t-primary`;
		}
	};

	return <Spinner css={[getColorProp(color), getSizeProp(size)]} />;
};
