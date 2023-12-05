import { combineReducers } from '@reduxjs/toolkit';
import authApi from './apis/auth.api';
import businessApi from './apis/business.api';
import campusApi from './apis/campus.api';
import configTimesApi from './apis/config-times.api';
import majorApi from './apis/major.api';
import requestStudentsApi from './apis/request-students.api';
import semesterApi from './apis/semester.api';
import staffListApi from './apis/staff-list.api';
import studentApi from './apis/student.api';
import authSlice from './slices/auth.slice';
import campusSlice from './slices/campus.slice';
import semesterSlice from './slices/semester.slice';
import internRegistrationApi from './apis/intern-registration.api';
import reportApi from './apis/report.api';

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
	[internRegistrationApi.reducerPath]: internRegistrationApi.reducer,
	[businessApi.reducerPath]: businessApi.reducer,
	[staffListApi.reducerPath]: staffListApi.reducer,
	[reportApi.reducerPath]: reportApi.reducer
});

export default rootReducer;
