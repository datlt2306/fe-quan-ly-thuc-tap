import { GoogleOAuthProvider } from '@react-oauth/google';
import { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './App/providers/store.js';
import LoadingProgressBar from './Core/components/common/Loading/LoadingProgressBar';
import './index.css';

// eslint-disable-next-line react-refresh/only-export-components
const App = lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<Suspense fallback={<LoadingProgressBar />}>
				<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
					<App />
				</GoogleOAuthProvider>
			</Suspense>
		</PersistGate>
	</Provider>
);
