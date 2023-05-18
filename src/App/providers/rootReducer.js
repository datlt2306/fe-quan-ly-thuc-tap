import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import semesterApi from "./apis/semesterApi";
import campusApi from "./apis/campusApi";
import campusSlice from "./slices/campusSlice";
import studentApi from "./apis/studentApi";
import businessApi from "./apis/businessApi";
import configTimesApi from "./apis/configTimesApi";
import authApi from "./apis/authApi";
import requestStudentsApi from "./apis/requestStudentsApi";
import staffListApi from "./apis/staffListApi";
import semesterSlice from "./slices/semesterSlice";
import majorApi from "./apis/majorApi";
import registerInternAPI from "./apis/registerInternAPI";

const rootReducer = combineReducers({
	// Auth reducers
	[authSlice.name]: authSlice.reducer,
	[campusSlice.name]: campusSlice.reducer,
	
	[authApi.reducerPath]: authApi.reducer,
	// Semester reducers
	[semesterApi.reducerPath]: semesterApi.reducer,
	[semesterSlice.name]: semesterSlice.reducer,
	// Business reducers
	// Campus reducers
	[campusApi.reducerPath]: campusApi.reducer,
	[studentApi.reducerPath]: studentApi.reducer,
	[configTimesApi.reducerPath]: configTimesApi.reducer,
	[requestStudentsApi.reducerPath]: requestStudentsApi.reducer,
	[campusSlice.name]: campusSlice.reducer,
	//major reducer
	[majorApi.reducerPath]: majorApi.reducer,
	[staffListApi.reducerPath]: staffListApi.reducer,
	//upload drive
	
	[registerInternAPI.reducerPath]: registerInternAPI.reducer,

	
	[businessApi.reducerPath]: businessApi.reducer,
	[configTimesApi.reducerPath]: configTimesApi.reducer,
	[campusSlice.name]: campusSlice.reducer,
	//major reducer
	[majorApi.reducerPath]: majorApi.reducer,
	[staffListApi.reducerPath]: staffListApi.reducer,
});

export default rootReducer;
