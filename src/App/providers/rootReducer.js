import { combineReducers } from '@reduxjs/toolkit';
import authApi from './apis/authApi';
import businessApi from './apis/businessApi';
import campusApi from './apis/campusApi';
import configTimesApi from './apis/configTimesApi';
import majorApi from './apis/majorApi';
import registerInternApi from './apis/internRegistrationApi';
import requestStudentsApi from './apis/requestStudentsApi';
import semesterApi from './apis/semesterApi';
import staffListApi from './apis/staffListApi';
import studentApi from './apis/studentApi';
import authSlice from './slices/authSlice';
import campusSlice from './slices/campusSlice';
import semesterSlice from './slices/semesterSlice';

const rootReducer = combineReducers({
	[authSlice.name]: authSlice.reducer,
	[campusSlice.name]: campusSlice.reducer,
	[campusSlice.name]: campusSlice.reducer,
	[semesterSlice.name]: semesterSlice.reducer,
	[authApi.reducerPath]: authApi.reducer,
	[semesterApi.reducerPath]: semesterApi.reducer,
	[campusApi.reducerPath]: campusApi.reducer,
	[studentApi.reducerPath]: studentApi.reducer,
	[configTimesApi.reducerPath]: configTimesApi.reducer,
	[requestStudentsApi.reducerPath]: requestStudentsApi.reducer,
	[majorApi.reducerPath]: majorApi.reducer,
	[registerInternApi.reducerPath]: registerInternApi.reducer,
	[businessApi.reducerPath]: businessApi.reducer,
	[staffListApi.reducerPath]: staffListApi.reducer
});

export default rootReducer;
