import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
// APIs
import campusApi from './apis/campusApi';
import semesterApi from './apis/semesterApi';
import rootReducer from './rootReducer';
import authApi from './apis/authApi';
import businessApi from './apis/businessApi';
import configTimesApi from './apis/configTimesApi';
import requestStudentsApi from './apis/requestStudentsApi';
import studentApi from './apis/studentApi';
import majorApi from './apis/majorApi';
import staffListApi from './apis/staffListApi';
import registerInternApi from './apis/internRegistrationApi';

const persistConfig = {
	key: 'root',
	storage
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
			registerInternApi.middleware
		])
});

export const persistor = persistStore(store); // Save every thing of redux store in localstorage
export default store;
