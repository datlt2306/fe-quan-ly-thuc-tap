import { signout } from "@/App/providers/slices/authSlice";
import store from "@/App/providers/store";
import axios from "axios";

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
});

axiosClient.interceptors.request.use(
	(config) => {
		const skippingCheckTokenEndpoints = ["/login-google"]; // Do not attach access token to header with these endpoints
		if (skippingCheckTokenEndpoints.includes(config.url)) {
			return config;
		}
		const accessToken = localStorage.getItem("accessToken");
		config.headers.Authorization = accessToken;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axiosClient.interceptors.response.use(
	(config) => {
		return config.data;
	},
	(error) => {
		if (error.response.status === 401) {
			// Force signout if access token expired
			store.dispatch(signout());
			// Cancel request
			const controller = new AbortController();
			axios.request({ signal: controller.signal, ...error.config });
			return Promise.reject(error);
		}
		return Promise.reject(error);
	}
);

export default axiosClient;
