import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../helper';

/**
 * @enum
 */
const TagTypes = {
	TIME_CONFIG: 'TIME_CONFIG'
};

const configTimesApi = createApi({
	reducerPath: 'timesApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: Object.values(TagTypes),
	endpoints: (build) => ({
		getSetTime: build.query({
			query: (params) => {
				return { url: `/settime/byNumber`, method: 'GET', params };
			}
		}),
		getAllSetTime: build.query({
			query: (params) => ({ url: '/settime', method: 'GET', params }),
			providesTags: Object.values(TagTypes)
		}),
		putSetTime: build.mutation({
			query: (payload) => ({ url: `/settime`, method: 'PUT', data: payload }),
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		})
	})
});

export const { useGetSetTimeQuery, useGetAllSetTimeQuery, usePutSetTimeMutation } = configTimesApi;

export default configTimesApi;
