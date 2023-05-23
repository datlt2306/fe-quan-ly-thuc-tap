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
<<<<<<< HEAD
import reportApi from './apis/reportApi';
=======
import registerInternApi from './apis/internRegistrationApi';
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['auth', 'campus']
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
<<<<<<< HEAD
			reportApi.middleware
		]),
=======
			registerInternApi.middleware
		])
>>>>>>> ce685e144a4331e6d4bb4388f1b2289e9b18ccec
});

export const persistor = persistStore(store); // Save every thing of redux store in localstorage
export default store;
