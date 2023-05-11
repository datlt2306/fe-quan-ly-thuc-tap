import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const configTimesApi = createApi({
	reducerPath: "timesApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getSetTime: build.query({
			query: (queryString) => {
				return { url: `/settime?${queryString}`, method: "GET" };
			},
		}),
	}),
});

export const { useGetSetTimeQuery } = configTimesApi;

export default configTimesApi;
