import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

const narrowSpecializationApi = createApi({
	reducerPath: 'narrowSpecializationApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Major'],
	endpoints: (build) => ({
		getAllNarrow: build.query({
			query: (params) => ({ url: '/narrows', method: 'GET', params }),
			providesTags: ['Narrow']
		}),
		createNarrow: build.mutation({
			query: (payload) => {
				return { url: '/narrow', method: 'POST', data: payload };
			},
			invalidatesTags: ['Narrow']
		}),
		updateNarrow: build.mutation({
			query: ({ data, id }) => {
				return { url: `/narrow/${id}`, method: 'PUT', data };
			},
			invalidatesTags: ['Narrow']
		}),
		deleteNarrow: build.mutation({
			query: (payload) => {
				return { url: `/narrow/${payload}`, method: 'DELETE' };
			},
			invalidatesTags: ['Narrow']
		})
	})
});

export const { useGetAllNarrowQuery, useCreateNarrowMutation, useUpdateNarrowMutation, useDeleteNarrowMutation } =
	narrowSpecializationApi;

export default narrowSpecializationApi;
