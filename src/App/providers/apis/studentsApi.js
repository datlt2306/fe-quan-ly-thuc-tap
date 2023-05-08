import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const studentsApi = createApi({
	reducerPath: "studentsApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getStudent: build.query({
			query: (id) => {
                console.log('id',id)
				return { url: `/student/${id}`, method: "GET" };
			},
		}),
	}),
});

export const { useGetStudentQuery } = studentsApi;

export default studentsApi;
