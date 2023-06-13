import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		signin: build.mutation({
			query: (payload) => {
				return { url: '/login-google', method: 'POST', data: payload };
			}
		}),
		adminSignin: build.mutation({
			query: (payload) => {
				return { url: '/login-admin', method: 'POST', data: payload };
			}
		})
	})
});

export const { useSigninMutation, useAdminSigninMutation } = authApi;

export default authApi;
