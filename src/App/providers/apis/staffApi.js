import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const staffApi = createApi({
	reducerPath: "staffApi",
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getAllStaff: build.query({
			query: () => {
				return { url: "/staff", method: "GET"}
			},
		}),
	}),
});

export const { useGetAllStaffQuery } = staffApi;

export default staffApi;
