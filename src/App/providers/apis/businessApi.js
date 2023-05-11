import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const businessApi = createApi({
	reducerPath: "businessApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["Business"],
	endpoints: (build) => ({
		getAllCompany: build.query({
			query: () => ({ url: "/business", method: "GET"}),
			providesTags: ["Business"],
		}),
	}),
});

export const { useGetAllCompanyQuery } = businessApi;

export default businessApi;