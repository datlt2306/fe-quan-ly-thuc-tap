import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../helper';

const requestStudentsApi = createApi({
	reducerPath: 'request',
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getRequestOfStudent: build.query({
			query: () => {
				return { url: `/request`, method: 'GET' };
			}
		}),
		requestOfStudent: build.mutation({
			query: (payload) => {
				return { url: `/request`, method: 'POST', data: payload };
			}
		}),
		resetStudentRequest: build.mutation({
			query: (payload) => {
				return { url: `/resetStudent/${payload.userId}`, method: 'PATCH', data: payload };
			}
		}),
		removeRequestApi: build.mutation({
			query: (id) => {
				return { url: `/removeRequest/${id}`, method: 'PATCH' };
			}
		})
	})
});

export const {
	useRequestOfStudentMutation,
	useRemoveRequestApiMutation,
	useResetStudentRequestMutation,
	useGetRequestOfStudentQuery
} = requestStudentsApi;

export default requestStudentsApi;
