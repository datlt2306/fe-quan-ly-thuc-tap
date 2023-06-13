import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

/**
 * @enum
 */
const TagTypes = {
	CAMPUS: 'Campus'
};

const campusApi = createApi({
	reducerPath: 'campusApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: Object.values(TagTypes),
	endpoints: (build) => ({
		getAllCampus: build.query({
			query: (params) => ({ url: '/campus', method: 'GET', params }),
			transformResponse: (response) => {
				return Array.isArray(response) ? response.map((campus, index) => ({ ...campus, index: index + 1 })) : [];
			},
			providesTags: Object.values(TagTypes)
		}),
		addCampus: build.mutation({
			query: (payload) => {
				return { url: '/campus', method: 'POST', data: payload };
			},
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		updateCampus: build.mutation({
			query: ({ id, payload }) => {
				return { url: '/campus/' + id, method: 'PATCH', data: payload };
			},
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		deleteCampus: build.mutation({
			query: (id) => {
				return { url: '/campus/' + id, method: 'DELETE' };
			},
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		})
	})
});

export const { useGetAllCampusQuery, useAddCampusMutation, useDeleteCampusMutation, useUpdateCampusMutation } =
	campusApi;

export default campusApi;
