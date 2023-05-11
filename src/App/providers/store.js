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
import studentApi from "./apis/studentApi";

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
			authApi.middleware,
			campusApi.middleware,
			semesterApi.middleware,
			studentApi.middleware,
		]),
});

export const persistor = persistStore(store); // Save every thing of redux store in localstorage
export default store;
