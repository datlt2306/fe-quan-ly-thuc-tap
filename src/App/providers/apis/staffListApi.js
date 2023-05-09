import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const staffListApi = createApi({
	reducerPath: "staffListApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getAllStaff: build.query({
			query: () => {
				return { url: "/manager", method: "GET" }
			},
		}),
	}),
});

export const { useGetAllStaffQuery } = staffListApi;

export default staffListApi;
