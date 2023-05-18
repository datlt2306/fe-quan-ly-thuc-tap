import { LoadingSpinner } from "./LoadingSpinner";
const ModalLoading = () => {
	return (
		<div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center bg-gray-800  bg-opacity-80">
			
		<div className="flex flex-col items-center  justify-center gap-2">
		<LoadingSpinner variant={"primary"} size="lg"/>
			<h2 className="text-center text-white text-xl font-semibold ">Loading...</h2>
		</div>
		</div>
	);
};

export default ModalLoading;

