import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';
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
			transformResponse: (response, meta, arg) => {
				const { limit, page } = arg;
				if (response && Array.isArray(response.list))
					response.list = response.list.map((staff, index) => ({
						...staff,
						index: getPaginationIndex(limit, page, index),
						role: RoleStaffEnum[staff.role]
					}));
				return response;
			},

			providesTags: Object.values(TagTypes)
		}),
		updateStaff: build.mutation({
			query: ({ id, payload }) => {
				return { url: '/manager/' + id, method: 'PATCH', data: payload };
			},
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		addStaff: build.mutation({
			query: (payload) => {
				return { url: '/manager', method: 'POST', data: payload };
			},
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		deleteStaff: build.mutation({
			query: (id) => {
				return { url: '/manager/' + id, method: 'DELETE' };
			},
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		getAllManager: build.query({
			query: (params) => {
				return { url: '/admin/manager', method: 'GET', params };
			},
			providesTags: Object.values(TagTypes)
		}),
		addManager: build.mutation({
			query: (payload) => {
				return { url: '/admin/manager', method: 'POST', data: payload };
			},
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		updateManager: build.mutation({
			query: ({ id, payload }) => {
				return { url: '/admin/manager/' + id, method: 'PATCH', data: payload };
			},
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		})
	})
});

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
