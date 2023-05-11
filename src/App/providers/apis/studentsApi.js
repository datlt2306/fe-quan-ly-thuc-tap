import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const studentsApi = createApi({
	reducerPath: "studentsApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Students'],
	endpoints: (build) => ({
		getStudent: build.query({
			query: (id) => {
				return { url: `/student/${id}`, method: "GET" };
			},
		

			providesTags: ['Students'],
		}),
	}),
});

export const { useGetStudentQuery } = studentsApi;

export default studentsApi;
