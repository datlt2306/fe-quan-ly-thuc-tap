import { createSlice } from "@reduxjs/toolkit";
import { auth } from "/db.json";
const authSlice = createSlice({
	name: "auth",
	reducers: {},
	initialState: {
		isLoggedIn: true,
		user: auth,
	},
	extraReducers: (builder) => {},
});

export default authSlice;
