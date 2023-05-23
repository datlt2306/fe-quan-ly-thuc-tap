import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

const staffListApi = createApi({
	reducerPath: 'managerApi',
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getAllStaff: build.query({
			query: (params) => ({ url: '/manager', method: 'GET', params }),
			providesTags: ['Manager']
		}),
		updateStaff: build.mutation({
			query: ({ id, payload }) => {
				return { url: '/manager/' + id, method: 'PATCH', data: payload };
			},
			invalidatesTags: ['Manager']
		}),
		addStaff: build.mutation({
			query: (payload) => {
				return { url: '/manager', method: 'POST', data: payload };
			},
			invalidatesTags: ['Manager']
		}),
		deleteStaff: build.mutation({
			query: (id) => {
				return { url: '/manager/' + id, method: 'DELETE' };
			},
			invalidatesTags: ['Manager']
		})
	})
});

export const { useGetAllStaffQuery, useUpdateStaffMutation, useAddStaffMutation, useDeleteStaffMutation } =
	staffListApi;

export default staffListApi;
