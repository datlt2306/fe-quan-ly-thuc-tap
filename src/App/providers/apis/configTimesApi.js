import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';
const configTimesApi = createApi({
	reducerPath: 'timesApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: 'Times',
	endpoints: (build) => ({
		getSetTime: build.query({
			query: (queryString) => {
				return { url: `/settime/byNumber`, method: 'GET', params: queryString };
			}
		}),
		getAllSetTime: build.query({
			query: (params) => ({ url: '/settime', method: 'GET', params }),
			providesTags: ['Times']
		}),
		putSetTime: build.mutation({
			query: (payload) => ({ url: `/settime`, method: 'PUT', data: payload }),
			invalidatesTags: ['Times']
		})
	})
});

export const { useGetSetTimeQuery, useGetAllSetTimeQuery, usePutSetTimeMutation } = configTimesApi;

export default configTimesApi;
