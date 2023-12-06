import { UserRoleEnum } from '@/App/constants/userRoles';
import { createSlice } from '@reduxjs/toolkit';
import authApi from '../apis/auth.api';

const initialState = {
	isSignedIn: false,
	user: {
		name: null,
		picture: null,
		role: null
	}
};
const authSlice = createSlice({
	name: 'auth',
	reducers: {
		signout: () => initialState,
		registerAppPassword: (state, action) => ({ ...state, hasRegisteredAppPassword: action.payload })
	},
	initialState: initialState,
	extraReducers: (build) => {
		build.addMatcher(authApi.endpoints.signin.matchFulfilled, (state, { payload }) => {
			if (payload.isAdmin) {
				console.log(payload);
				const optionalPayload =
					payload.manager?.role === 1 ? { hasRegisteredAppPassword: payload.hasRegisteredAppPassword } : {};
				console.log(optionalPayload);
				return {
					isSignedIn: payload.success,
					user: {
						id: payload.manager?._id,
						displayName: payload.name,
						email: payload.manager?.email,
						picture: payload.picture,
						role:
							payload.manager?.role === 1
								? UserRoleEnum.STAFF
								: payload.manager?.role === 2
								? UserRoleEnum.MANAGER
								: UserRoleEnum.ADMIN
					},
					...optionalPayload
				};
			}
			return {
				isSignedIn: payload.success,
				user: {
					id: payload.student?._id,
					displayName: payload.name,
					email: payload.student?.email,
					picture: payload.picture,
					role: UserRoleEnum.STUDENT
				}
			};
		});
		build.addMatcher(authApi.endpoints.adminSignin.matchFulfilled, (state, { payload }) => {
			if (payload.isAdmin) {
				return {
					isSignedIn: payload.success,
					user: {
						id: payload.manager?._id,
						displayName: payload.name,
						email: payload.manager?.email,
						picture: payload.picture,
						role: UserRoleEnum.ADMIN
					}
				};
			}
		});
	}
});

export const { signout, registerAppPassword } = authSlice.actions;
export default authSlice;
