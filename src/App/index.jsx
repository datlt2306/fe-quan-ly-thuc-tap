import { Slide, ToastContainer } from "react-toastify";
import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routers";
import { BrowserRouter } from "react-router-dom";
import { Fragment } from "react";
import "react-toastify/dist/ReactToastify.css";

function App() {
	return (
		<Fragment>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>

			<ToastContainer
				hideProgressBar={true}
				transition={Slide}
				limit={1}
				toastClassName="bg-white shadow-lg text-gray-800 place-content-center font-medium"
				position="top-center"
				closeButton={true}
			/>
		</Fragment>
	);
}

export default App;
