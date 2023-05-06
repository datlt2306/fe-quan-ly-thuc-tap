import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const semesterApi = createApi({
	reducerPath: "semesterApi",
	tagTypes: ["Semester"],
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getDefaultSemester: build.query({
			query: (params) => ({ url: "/semester", method: "GET", params }),
		}),
	}),
});
export const { useGetDefaultSemesterQuery } = semesterApi;

export default semesterApi;
