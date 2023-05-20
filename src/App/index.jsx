import { Slide, ToastContainer } from "react-toastify";
import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routers";
import { BrowserRouter } from "react-router-dom";
import { Fragment } from "react";
import "react-toastify/dist/ReactToastify.css";
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { LoadingSpinner } from "@/Core/components/common/Loading/LoadingSpinner";

function App() {
	return (
		<Fragment>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>

			<ToastContainer
				hideProgressBar={true}
				transition={Slide}
				toastClassName="bg-white shadow-lg text-gray-500 place-content-center font-medium"
				position="top-center"
				closeButton={true}
				autoClose={1000}
				icon={({ type }) => {
					switch (type) {
						case "success":
							return <CheckCircleIcon className="h-8 w-8 text-success" />;
						case "warning":
							return <ExclamationTriangleIcon className="h-8 w-8 text-warning" />;
						case "error":
							return <XCircleIcon className="h-8 w-8 text-error" />;
						case "info":
							return <InformationCircleIcon className="h-8 w-8 text-secondary" />;
						case "loading":
							return <LoadingSpinner size="sm" variant="primary" />;
						default:
							return <LoadingSpinner size="sm" variant="primary" />;
					}
				}}
			/>
		</Fragment>
	);
}

export default App;
