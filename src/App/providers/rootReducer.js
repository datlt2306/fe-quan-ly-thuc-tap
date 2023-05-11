import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import semesterApi from "./apis/semesterApi";
import campusApi from "./apis/campusApi";
import campusSlice from "./slices/campusSlice";
import studentsApi from "./apis/studentsApi";
import bussinessApi from "./apis/bussinessApi";
import configTimesApi from "./apis/configTimesApi";
import authApi from "./apis/authApi";
import requestStudentsApi from "./apis/requestStudentsApi";
const rootReducer = combineReducers({
	[authSlice.name]: authSlice.reducer,
	[campusSlice.name]: campusSlice.reducer,
	
	[authApi.reducerPath]: authApi.reducer,
	[semesterApi.reducerPath]: semesterApi.reducer,
	[campusApi.reducerPath]: campusApi.reducer,
	[studentsApi.reducerPath]: studentsApi.reducer,
	[bussinessApi.reducerPath]: bussinessApi.reducer,
	[configTimesApi.reducerPath]: configTimesApi.reducer,
	[requestStudentsApi.reducerPath]: requestStudentsApi.reducer,
});

export default rootReducer;
