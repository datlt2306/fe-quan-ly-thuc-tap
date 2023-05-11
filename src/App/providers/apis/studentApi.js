import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const studentApi = createApi({
	reducerPath: "studentApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["Student"],
	endpoints: (build) => ({
		getStudent: build.query({
			query: (params) => ({ url: "/student", method: "GET", params }),
			providesTags: ["Student"],
		}),
		importStudent: build.mutation({
			query: (payload) => ({ url: "/student", method: "POST", data: payload }),
			invalidatesTags: ["Student"],
		}),
	}),
});

export const { useGetStudentQuery, useImportStudentMutation } = studentApi;
export default studentApi;
