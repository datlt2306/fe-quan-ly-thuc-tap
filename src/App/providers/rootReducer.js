import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";

const rootReducer = combineReducers({
	[authSlice.name]: authSlice.reducer,
});

export default rootReducer;
