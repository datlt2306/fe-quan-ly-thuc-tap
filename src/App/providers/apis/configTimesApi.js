import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
const configTimesApi = createApi({
	reducerPath: "timesApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getSetTime: build.query({
			query: (queryString) => {
				const { typeNumber,...props } = queryString;
				return { url: `/settime/byNumber`, method: "GET",params:{
					typeNumber,
					props
				} };
			},
		}),
	}),
});
export const { useGetSetTimeQuery } = configTimesApi;

export default configTimesApi;
