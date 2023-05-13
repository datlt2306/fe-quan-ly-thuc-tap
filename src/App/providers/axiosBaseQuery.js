import axiosClient from "@/Core/configs/axiosConfig";

// custom base query with axios
export default function axiosBaseQuery() {
	return async ({ url, method, data, params }) => {
		try {
			const response = await axiosClient.request({
				url: url,
				method,
				data,
				params, // query string object
			});
			return { data: response };
		} catch (error) {
			if (error.response) {
				console.log({
					data: error.response?.data,
					status: error.response?.status,
					headers: error.response?.headers,
				});
			} else if (error.request) {
				console.log(error.request);
			} else {
				console.log(error.message);
			}
			console.log(error.config);
			return {
				status: error.response?.status,
				data: error.response?.data || error.message,
			};
		}
	};
}
