import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import semesterApi from "./apis/semesterApi";
import campusApi from "./apis/campusApi";
import campusSlice from "./slices/campusSlice";
import studentApi from "./apis/studentApi";
import semesterSlice from "./slices/semesterSlice";
import businessApi from "./apis/businessApi";
import majorApi from "./apis/majorApi";

const rootReducer = combineReducers({
	// Auth reducers
	[authSlice.name]: authSlice.reducer,
	// Semester reducers
	[semesterApi.reducerPath]: semesterApi.reducer,
	[semesterSlice.name]: semesterSlice.reducer,
	// Business reducers
	[businessApi.reducerPath]: businessApi.reducer,
	// Campus reducers
	[campusApi.reducerPath]: campusApi.reducer,
	[campusSlice.name]: campusSlice.reducer,
	// Student reducers
	[studentApi.reducerPath]: studentApi.reducer,
	//major reducer
	[majorApi.reducerPath]: majorApi.reducer,
});

export default rootReducer;
