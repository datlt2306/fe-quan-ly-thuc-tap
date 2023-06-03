import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

/**
 * @enum
 */
const TagTypes = {
	BUSINESS: 'Business'
};

const businessApi = createApi({
	reducerPath: 'businessApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: Object.values(TagTypes),
	endpoints: (build) => ({
		getAllCompany: build.query({
			query: (params) => ({ url: '/business', method: 'GET', params }),
			providesTags: Object.values(TagTypes)
		}),
		getOneCompany: build.query({
			query: (payload) => ({ url: `/business/${payload.id}`, method: 'GET' })
		}),
		addCompany: build.mutation({
			query: (payload) => ({ url: '/business', method: 'PUT', data: payload }),
			invalidatesTags: Object.values(TagTypes)
		}),
		addArrayCompany: build.mutation({
			query: (payload) => ({ url: '/business', method: 'PUT', data: payload }),
			invalidatesTags: Object.values(TagTypes)
		}),
		updateCompany: build.mutation({
			query: (payload) => ({ url: `/business/${payload.id}`, method: 'PATCH', data: payload.data }),
			invalidatesTags: Object.values(TagTypes)
		}),
		deleteCompany: build.mutation({
			query: (payload) => ({ url: `/business/${payload.id}`, method: 'DELETE' }),
			invalidatesTags: Object.values(TagTypes)
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
