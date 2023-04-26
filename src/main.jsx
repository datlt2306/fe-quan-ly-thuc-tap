import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App/App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './App/providers/Redux/store.js';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);
