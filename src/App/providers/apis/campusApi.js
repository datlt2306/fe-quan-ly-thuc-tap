import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

const campusApi = createApi({
	reducerPath: 'campusApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Campus'],
	endpoints: (build) => ({
		getAllCampus: build.query({
			query: (params) => ({ url: '/campus', method: 'GET', params }),
			providesTags: ['Campus']
		}),
		addCampus: build.mutation({
			query: (payload) => {
				return { url: '/campus', method: 'POST', data: payload };
			},
			invalidatesTags: ['Campus']
		}),
		updateCampus: build.mutation({
			query: ({ id, payload }) => {
				return { url: '/campus/' + id, method: 'PATCH', data: payload };
			},
			invalidatesTags: ['Campus']
		}),
		deleteCampus: build.mutation({
			query: (id) => {
				return { url: '/campus/' + id, method: 'DELETE' };
			},
			invalidatesTags: ['Campus']
		})
	})
});

export const { useGetAllCampusQuery, useAddCampusMutation, useDeleteCampusMutation, useUpdateCampusMutation } =
	campusApi;

export default campusApi;
