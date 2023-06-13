import { LoadingSpinner } from '@/Core/components/common/Loading/LoadingSpinner';
import {
	CheckCircleIcon,
	ExclamationTriangleIcon,
	InformationCircleIcon,
	XCircleIcon
} from '@heroicons/react/20/solid';
import { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './routers';

function App() {
	return (
		<Fragment>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>

			<ToastContainer
				hideProgressBar={true}
				transition={Slide}
				toastClassName='bg-white shadow-lg text-base-content place-content-center font-medium z-[9999]'
				position='top-center'
				closeButton={true}
				autoClose={1000}
				icon={({ type }) => {
					switch (type) {
						case 'success':
							return <CheckCircleIcon className='h-8 w-8 text-success' />;
						case 'warning':
							return <ExclamationTriangleIcon className='h-8 w-8 text-warning' />;
						case 'error':
							return <XCircleIcon className='h-8 w-8 text-error' />;
						case 'info':
							return <InformationCircleIcon className='h-8 w-8 text-secondary' />;
						case 'loading':
							return <LoadingSpinner size='sm' variant='primary' />;
						default:
							return <LoadingSpinner size='sm' variant='primary' />;
					}
				}}
			/>
		</Fragment>
	);
}

export default App;
