import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
const App = lazy(() => import("./App"));
import "./index.css";
import { Provider } from "react-redux";
import store from "./App/providers/store.js";
import LoadingProgressBar from "./Core/components/common/Loading/LoadingProgressBar";

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<Suspense fallback={<LoadingProgressBar />}>
			<App />
		</Suspense>
	</Provider>
);
