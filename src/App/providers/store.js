import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
	FLUSH,
	PAUSE,
	PERSIST,
	persistReducer,
	persistStore,
	PURGE,
	REGISTER,
	REHYDRATE,
} from "redux-persist";
// APIs
import campusApi from "./apis/campusApi";
import semesterApi from "./apis/semesterApi";
import rootReducer from "./rootReducer";
import authApi from "./apis/authApi";
import studentsApi from "./apis/studentsApi";
import businessApi from "./apis/businessApi";
import configTimesApi from "./apis/configTimesApi";
import requestStudentsApi from "./apis/requestStudentsApi";

const persistConfig = {
	key: "root",
	storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer); // Provide a way to combine redux's root reducer

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat([
			semesterApi.middleware,
			campusApi.middleware,
			authApi.middleware,
			studentsApi.middleware,
			businessApi.middleware,
			configTimesApi.middleware,
			requestStudentsApi.middleware,
		]),
});

export const persistor = persistStore(store); // Save every thing of redux store in localstorage
export default store;
