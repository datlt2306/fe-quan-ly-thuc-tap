import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const majorApi = createApi({
	reducerPath: "majorApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["Major"],
	endpoints: (build) => ({
		getAllMajor: build.query({
			query: (params) => ({ url: "/major", method: "GET" , params}),
			providesTags: ["Major"],
		}),
	}),
});

export const { useGetAllMajorQuery } = majorApi;

export default majorApi;
