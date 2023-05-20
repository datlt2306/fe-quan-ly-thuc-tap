import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const requestStudentsApi = createApi({
	reducerPath: "request",
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getRequestOfStudent: build.query({
			query: () => {
				return { url: `/getRequest`, method: "GET" };
			},
		}),
		requestOfStudent: build.mutation({
			query: (payload) => {
				return { url: `/request`, method: "POST", data: payload };
			},
		}),
		resetStudentRequest: build.mutation({
			query: (userId) => {
				return { url: `/resetStudent/${userId}`, method: "PATCH" };
			},
		}),
		removeRequestApi: build.mutation({
			query: (id) => {
				return { url: `/removeRequest/${id}`, method: "PATCH" };
			},
		}),
	}),
});

export const {
	useRequestOfStudentMutation,
	useRemoveRequestApiMutation,
	useResetStudentRequestMutation,
	useGetRequestOfStudentQuery,
} = requestStudentsApi;

export default requestStudentsApi;
