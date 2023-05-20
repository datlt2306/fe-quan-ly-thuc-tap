import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
const configTimesApi = createApi({
	reducerPath: "timesApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getSetTime: build.query({
			query: (queryString) => {
				return { url: `/settime/byNumber`, method: 'GET', params: queryString };
			}
		})
	})
});

export const { useGetSetTimeQuery } = configTimesApi;

export default configTimesApi;
