import { Slide, ToastContainer } from 'react-toastify';
import MainLayout from './layouts/MainLayout';
import AppRoutes from './routers';
import { BrowserRouter } from 'react-router-dom';
import { Fragment } from 'react';

function App() {
	return (
		<Fragment>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>

			<ToastContainer
				hideProgressBar={true}
				transition={Slide}
				autoClose={1000}
				limit={1}
				toastClassName={() => ``}
				position="top-center"
				closeButton={true}
			/>
		</Fragment>
	);
}

export default App;
