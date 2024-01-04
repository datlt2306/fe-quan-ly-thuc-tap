import { GoogleOAuthProvider } from '@react-oauth/google';
import { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import LoadingProgressBar from './Core/components/common/Loading/LoadingProgressBar';
import './index.css';
import store, { persistor } from './App/store/store';

// eslint-disable-next-line react-refresh/only-export-components
const App = lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
				<Suspense fallback={<LoadingProgressBar />}>
					<App />
				</Suspense>
			</GoogleOAuthProvider>
		</PersistGate>
	</Provider>
);
