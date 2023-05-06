import { createSlice } from "@reduxjs/toolkit";
import campusApi from "../apis/campusApi";

const campusSlice = createSlice({
	name: "campus",
	reducers: {},
	initialState: [],
	extraReducers: (build) => {
		build.addMatcher(campusApi.endpoints.getAllCampus.matchFulfilled, (state, { payload }) => {
			return payload;
		});
	},
});

export default campusSlice;
