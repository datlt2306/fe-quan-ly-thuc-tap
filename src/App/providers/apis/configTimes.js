import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const configTimes = createApi({
	reducerPath: "timesApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getSetTime: build.query({
			query: () => {
				return { url: `/settime`, method: "GET" };
			},
		}),
	}),
});

export const { useGetSetTimeQuery } = configTimes;

export default configTimes;
