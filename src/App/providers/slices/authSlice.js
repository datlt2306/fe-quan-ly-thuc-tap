import { createSlice } from "@reduxjs/toolkit";
import authApi from "../apis/authApi";
import { UserRoleEnum } from "@/Core/constants/userRoles";
import useLocalStorage from "@/App/hooks/useLocalstorage";

const initialState = {
	isSignedIn: false,
	user: {
		name: null,
		picture: null,
		role: null,
	},
};
const authSlice = createSlice({
	name: "auth",
	reducers: {
		signout: (state, { payload }) => initialState,
	},
	initialState: initialState,
	extraReducers: (build) => {
		build.addMatcher(authApi.endpoints.signin.matchFulfilled, (state, { payload }) => {
			if (payload.isAdmin) {
				return {
					isSignedIn: payload.success,
					user: {
						displayName: payload.name,
						email: payload.manager?.email,
						picture: payload.picture,
						role: payload.manager?.role === 1 ? UserRoleEnum.STAFF : UserRoleEnum.MANAGER,
					},
				};
			}
			return {
				isSignedIn: payload.success,
				user: {
					displayName: payload.name,
					email: payload.student?.email,
					picture: payload.picture,
					role: UserRoleEnum.STUDENT,
				},
			};
		});
	},
});

export const { signout } = authSlice.actions;
export default authSlice;
