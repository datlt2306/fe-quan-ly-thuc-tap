import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

/**
 * @enum
 */
const TagTypes = {
	MAJOR: 'Major'
};

const majorApi = createApi({
	reducerPath: 'majorApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: Object.values(TagTypes),
	endpoints: (build) => ({
		getAllMajor: build.query({
			query: (params) => ({ url: '/major', method: 'GET', params }),
			providesTags: Object.values(TagTypes)
		}),
		createMajor: build.mutation({
			query: (payload) => {
				return { url: '/major', method: 'POST', data: payload };
			},
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		updateMajor: build.mutation({
			query: ({ data, id }) => {
				return { url: `/major/${id}`, method: 'PATCH', data };
			},
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		deleteMajor: build.mutation({
			query: (payload) => {
				return { url: `/major/${payload}`, method: 'DELETE' };
			},
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		})
	})
});

export const { useGetAllMajorQuery, useCreateMajorMutation, useUpdateMajorMutation, useDeleteMajorMutation } = majorApi;

export default majorApi;
