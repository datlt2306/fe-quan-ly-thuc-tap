import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
const App = lazy(() => import("./App"));
import "./index.css";
import { Provider } from "react-redux";
import store, { persistor } from "./App/providers/store.js";
import LoadingProgressBar from "./Core/components/common/Loading/LoadingProgressBar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
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
