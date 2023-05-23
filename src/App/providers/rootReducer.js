import { combineReducers } from '@reduxjs/toolkit';
<<<<<<< HEAD
import authSlice from './slices/authSlice';
import semesterApi from './apis/semesterApi';
import campusApi from './apis/campusApi';
import campusSlice from './slices/campusSlice';
import studentApi from './apis/studentApi';
import businessApi from './apis/businessApi';
import configTimesApi from './apis/configTimesApi';
import authApi from './apis/authApi';
import requestStudentsApi from './apis/requestStudentsApi';
import staffListApi from './apis/staffListApi';
import semesterSlice from './slices/semesterSlice';
import majorApi from './apis/majorApi';
import registerInternAPI from './apis/registerInternAPI';
=======
import authApi from './apis/authApi';
import businessApi from './apis/businessApi';
import campusApi from './apis/campusApi';
import configTimesApi from './apis/configTimesApi';
import majorApi from './apis/majorApi';

import requestStudentsApi from './apis/requestStudentsApi';
import semesterApi from './apis/semesterApi';
import staffListApi from './apis/staffListApi';
import studentApi from './apis/studentApi';
import authSlice from './slices/authSlice';
import campusSlice from './slices/campusSlice';
import semesterSlice from './slices/semesterSlice';
import registerInternApi from './apis/registerInternApi';
>>>>>>> d9c780983b704e9aae04b622bedc398cb9bc0b54

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
<<<<<<< HEAD
	//upload drive

	[registerInternAPI.reducerPath]: registerInternAPI.reducer,

=======
	[registerInternApi.reducerPath]: registerInternApi.reducer,
>>>>>>> d9c780983b704e9aae04b622bedc398cb9bc0b54
	[businessApi.reducerPath]: businessApi.reducer,
	[staffListApi.reducerPath]: staffListApi.reducer
});

export default rootReducer;
