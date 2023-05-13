import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import semesterApi from "./apis/semesterApi";
import campusApi from "./apis/campusApi";
import campusSlice from "./slices/campusSlice";
import studentsApi from "./apis/studentsApi";
import businessApi from "./apis/businessApi";
import configTimesApi from "./apis/configTimesApi";
import authApi from "./apis/authApi";
import requestStudentsApi from "./apis/requestStudentsApi";
import studentApi from "./apis/studentApi";
import semesterSlice from "./slices/semesterSlice";

const rootReducer = combineReducers({
	// Auth reducers
	[authSlice.name]: authSlice.reducer,
	[campusSlice.name]: campusSlice.reducer,
	
	[authApi.reducerPath]: authApi.reducer,
	// Semester reducers
	[semesterApi.reducerPath]: semesterApi.reducer,
	[semesterSlice.name]: semesterSlice.reducer,
	// Campus reducers
	[campusApi.reducerPath]: campusApi.reducer,
	[studentsApi.reducerPath]: studentsApi.reducer,
	[businessApi.reducerPath]: businessApi.reducer,
	[configTimesApi.reducerPath]: configTimesApi.reducer,
	[requestStudentsApi.reducerPath]: requestStudentsApi.reducer,
	[campusSlice.name]: campusSlice.reducer,
	// Student reducers
	[studentApi.reducerPath]: studentApi.reducer,
});

export default rootReducer;
