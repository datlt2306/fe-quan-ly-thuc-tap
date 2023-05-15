import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import semesterApi from "./apis/semesterApi";
import campusApi from "./apis/campusApi";
import campusSlice from "./slices/campusSlice";
import staffListApi from "./apis/staffListApi";
import studentApi from "./apis/studentApi";
import semesterSlice from "./slices/semesterSlice";
import businessApi from "./apis/businessApi";
import majorApi from "./apis/majorApi";
import authApi from "./apis/authApi";
import configTimesApi from "./apis/configTimesApi";
const rootReducer = combineReducers({
	// Auth reducers
	[authSlice.name]: authSlice.reducer,
	[campusSlice.name]: campusSlice.reducer,
	
	[authApi.reducerPath]: authApi.reducer,
	// Semester reducers
	[semesterApi.reducerPath]: semesterApi.reducer,
	[semesterSlice.name]: semesterSlice.reducer,
	// Business reducers
	[businessApi.reducerPath]: businessApi.reducer,
	// Campus reducers
	[campusApi.reducerPath]: campusApi.reducer,
	[businessApi.reducerPath]: businessApi.reducer,
	[configTimesApi.reducerPath]: configTimesApi.reducer,
	[campusSlice.name]: campusSlice.reducer,
	[studentApi.reducerPath]: studentApi.reducer,
	//major reducer
	[majorApi.reducerPath]: majorApi.reducer,
	[staffListApi.reducerPath]: staffListApi.reducer,
});

export default rootReducer;
