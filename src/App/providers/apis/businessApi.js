import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const businessApi = createApi({
	reducerPath: "businessApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["business"],
	endpoints: (build) => ({
		getAllCompany: build.query({
			query: (page = 1, limit = 10) => ({
				url: `/business?page=${page}&limit=${limit}`,
				method: "GET",
			}),
			providesTags: ["business"],
		}),
	}),
});

export const { useGetAllCompanyQuery } = businessApi;

export default businessApi;
