import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

const businessApi = createApi({
	reducerPath: 'businessApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Business'],
	endpoints: (build) => ({
		getAllCompany: build.query({
			query: (params) => ({ url: '/business', method: 'GET', params }),
			providesTags: ['Business']
		}),
		getOneCompany: build.query({
			query: (payload) => ({ url: `/business/${payload.id}`, method: 'GET' })
		}),
		addCompany: build.mutation({
			query: (payload) => ({ url: '/business', method: 'PUT', data: payload }),
			invalidatesTags: ['Business']
		}),
		addArrayCompany: build.mutation({
			query: (payload) => ({ url: '/business', method: 'PUT', data: payload }),
			invalidatesTags: ['Business']
		}),
		updateCompany: build.mutation({
			query: (payload) => ({ url: `/business/${payload.id}`, method: 'PATCH', data: payload.data }),
			invalidatesTags: ['Business']
		}),
		deleteCompany: build.mutation({
			query: (payload) => ({ url: `/business/${payload.id}`, method: 'DELETE' }),
			invalidatesTags: ['Business']
		})
	})
});

export const {
	useGetAllCompanyQuery,
	useAddCompanyMutation,
	useDeleteCompanyMutation,
	useUpdateCompanyMutation,
	useGetOneCompanyQuery,
	useAddArrayCompanyMutation
} = businessApi;

export default businessApi;
