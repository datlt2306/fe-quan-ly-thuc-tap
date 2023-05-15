import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const studentApi = createApi({
	reducerPath: "studentApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["Student"],
	endpoints: (build) => ({
		getStudents: build.query({
			query: (params) => ({ url: "/student", method: "GET", params }),
			providesTags: ["Student"],
		}),
		getOneStudent: build.query({
			query: (id) => {
				return { url: `/student/${id}`, method: "GET" };
			},
		

			providesTags: ['Students'],
		}),
		addStudents: build.mutation({
			query: (payload) => ({ url: "/student", method: "POST", data: payload }),
			invalidatesTags: ["Student"],
		}),
	}),
});

export const { useGetStudentsQuery,useGetOneStudentQuery, useAddStudentsMutation } = studentApi;
export default studentApi;
