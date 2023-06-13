import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';
import getPaginationIndex from '@/Core/utils/getPaginationIndex';

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
			transformResponse: (response, _meta, arg) => transformResponseData(response, arg),
			providesTags: Object.values(TagTypes)
		}),
		getOneCompany: build.query({
			query: (payload) => ({ url: `/business/${payload.id}`, method: 'GET' })
		}),
		addCompany: build.mutation({
			query: (payload) => ({ url: '/business', method: 'PUT', data: payload }),
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		addArrayCompany: build.mutation({
			query: (payload) => ({ url: '/business', method: 'PUT', data: payload }),
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		updateCompany: build.mutation({
			query: (payload) => ({ url: `/business/${payload.id}`, method: 'PATCH', data: payload.data }),
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		deleteCompany: build.mutation({
			query: (payload) => ({ url: `/business/${payload.id}`, method: 'DELETE' }),
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		})
	})
});

const transformResponseData = (response, arg) => {
	if (response && Array.isArray(response)) {
		return response.map((company, index) => ({
			...company,
			campus_id: company.campus_id?.name,
			semester_id: company.semester_id?.name ? company.semester_id?.name?.toUpperCase() : company.semester_id?.name,
			index: index + 1
		}));
	}
	return [];
};

export const {
	useGetAllCompanyQuery,
	useAddCompanyMutation,
	useDeleteCompanyMutation,
	useUpdateCompanyMutation,
	useGetOneCompanyQuery,
	useAddArrayCompanyMutation
} = businessApi;

export default businessApi;
