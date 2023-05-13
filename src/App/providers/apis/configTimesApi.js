import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const configTimesApi = createApi({
	reducerPath: "timesApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getSetTime: build.query({
			query: (queryString) => {
				const { typeNumber, semester_id,campus_id } = queryString;
				return { url: `/settime`, method: "GET",params:{
					typeNumber,semester_id,campus_id

				} };
			},
		}),
	}),
});

export const { useGetSetTimeQuery } = configTimesApi;

export default configTimesApi;
