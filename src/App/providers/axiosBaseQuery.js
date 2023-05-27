import axiosClient from '@/Core/configs/axiosConfig';

// custom base query with axios
export default function axiosBaseQuery() {
	return async ({ url, method, data, params }) => {
		try {
			const response = await axiosClient.request({
				url: url,
				method,
				data,
				params // query string object
			});
			return { data: response };
		} catch (error) {
			const axiosError = error;
			return {
				error: {
					status: axiosError.response?.data?.status,
					data: axiosError.response?.data || error.message
				}
			};
		}
	};
}
