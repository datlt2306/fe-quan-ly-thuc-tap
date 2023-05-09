import { createSlice } from "@reduxjs/toolkit";
import businessApi from "../apis/businessApi";
const businessSlice = createSlice({
	name: "campus",
	reducers: {},
	initialState: [],
	extraReducers: (build) => {
		build.addMatcher(businessApi.endpoints.getAllCampus.matchFulfilled, (state, { payload }) => {
			return payload;
		});
	},
});

export default businessSlice;
