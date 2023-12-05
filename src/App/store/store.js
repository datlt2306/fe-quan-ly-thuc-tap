import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
// APIs
import campusApi from './apis/campus.api';
import semesterApi from './apis/semester.api';
import rootReducer from './root.reducer';
import authApi from './apis/auth.api';
import businessApi from './apis/business.api';
import configTimesApi from './apis/config-times.api';
import requestStudentsApi from './apis/request-students.api';
import studentApi from './apis/student.api';
import majorApi from './apis/major.api';
import staffListApi from './apis/staff-list.api';
import internRegistrationApi from './apis/intern-registration.api';
import reportApi from './apis/report.api';
import RTKQueryLogger from './middlewares/RTKQueryLogger';

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['auth', 'campus', 'semester']
};

const persistedReducer = persistReducer(persistConfig, rootReducer); // Provide a way to combine redux's root reducer

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
			}
		}).concat([
			semesterApi.middleware,
			campusApi.middleware,
			authApi.middleware,
			businessApi.middleware,
			configTimesApi.middleware,
			requestStudentsApi.middleware,
			authApi.middleware,
			campusApi.middleware,
			semesterApi.middleware,
			businessApi.middleware,
			studentApi.middleware,
			majorApi.middleware,
			staffListApi.middleware,
			internRegistrationApi.middleware,
			reportApi.middleware,
			// logger middleware
			RTKQueryLogger
		])
});

export const persistor = persistStore(store); // Save every thing of redux store in localstorage
export default store;
