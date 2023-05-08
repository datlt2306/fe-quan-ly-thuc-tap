import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import semesterApi from "./apis/semesterApi";
import campusApi from "./apis/campusApi";
import campusSlice from "./slices/campusSlice";
import studentsApi from "./apis/studentsApi";
const rootReducer = combineReducers({
	[authSlice.name]: authSlice.reducer,
	[campusSlice.name]: campusSlice.reducer,
	[semesterApi.reducerPath]: semesterApi.reducer,
	[campusApi.reducerPath]: campusApi.reducer,
	[studentsApi.reducerPath]: studentsApi.reducer,
});

export default rootReducer;
