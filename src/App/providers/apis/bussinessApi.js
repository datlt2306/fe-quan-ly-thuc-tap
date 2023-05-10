import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const bussinessApi = createApi({
	reducerPath: "bussinessApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getBusiness: build.query({
			query: () => {
				return { url: `/business`, method: "GET" };
			},
		}),
	}),
});

export const { useGetBusinessQuery } = bussinessApi;

export default bussinessApi;
