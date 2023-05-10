import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import semesterApi from "./apis/semesterApi";
import campusApi from "./apis/campusApi";
import campusSlice from "./slices/campusSlice";
import studentsApi from "./apis/studentsApi";
import bussinessApi from "./apis/bussinessApi";
import configTimes from "./apis/configTimes";
const rootReducer = combineReducers({
	[authSlice.name]: authSlice.reducer,
	[campusSlice.name]: campusSlice.reducer,
	[semesterApi.reducerPath]: semesterApi.reducer,
	[campusApi.reducerPath]: campusApi.reducer,
	[studentsApi.reducerPath]: studentsApi.reducer,
	[bussinessApi.reducerPath]: bussinessApi.reducer,
	[configTimes.reducerPath]: configTimes.reducer,

});

export default rootReducer;
