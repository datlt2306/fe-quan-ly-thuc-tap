import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../helper';
import getPaginationIndex from '@/Core/utils/getPaginationIndex';
import { RoleStaffEnum } from '@/App/constants/userRoles';

/**
 * @enum
 */
const TagTypes = {
	MANAGERS: 'Managers'
};

const staffListApi = createApi({
	reducerPath: 'managerApi',
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getAllStaff: build.query({
			query: (params) => ({ url: '/manager', method: 'GET', params }),
			transformResponse: (response, _meta, arg) => transformResponseData(response, arg),
			providesTags: Object.values(TagTypes)
		}),
		updateStaff: build.mutation({
			query: ({ id, payload }) => ({ url: '/manager/' + id, method: 'PATCH', data: payload }),
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		addStaff: build.mutation({
			query: (payload) => ({ url: '/manager', method: 'POST', data: payload }),
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		deleteStaff: build.mutation({
			query: (id) => ({ url: '/manager/' + id, method: 'DELETE' }),
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		getAllManager: build.query({
			query: (params) => ({ url: '/admin/manager', method: 'GET', params }),
			transformResponse: (response, _meta, arg) => transformResponseData(response, arg),
			providesTags: Object.values(TagTypes)
		}),
		addManager: build.mutation({
			query: (payload) => ({ url: '/admin/manager', method: 'POST', data: payload }),
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		updateManager: build.mutation({
			query: ({ id, payload }) => ({ url: '/admin/manager/' + id, method: 'PATCH', data: payload }),
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		})
	})
});

const transformResponseData = (response, arg) => {
	{
		const { limit, page } = arg;
		if (!limit || !page) return response;
		if (response && Array.isArray(response.data))
			response.data = response.data.map((staff, index) => ({
				...staff,
				index: getPaginationIndex(limit, page, index),
				role: RoleStaffEnum[staff.role]
			}));
		return response;
	}
};

export const {
	useGetAllStaffQuery,
	useUpdateStaffMutation,
	useAddStaffMutation,
	useDeleteStaffMutation,
	useGetAllManagerQuery,
	useAddManagerMutation,
	useUpdateManagerMutation
} = staffListApi;

export default staffListApi;
