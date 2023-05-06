import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const campusApi = createApi({
	reducerPath: "campusApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["Campus"],
	endpoints: (build) => ({
		getAllCampus: build.query({
			query: () => ({ url: "/cumpus", method: "GET" }),
			providesTags: ["Campus"],
		}),
	}),
});

export const { useGetAllCampusQuery } = campusApi;

export default campusApi;
