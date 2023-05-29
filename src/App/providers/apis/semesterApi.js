import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

const semesterApi = createApi({
	reducerPath: 'semesterApi',
	tagTypes: ['Semesters'],
	keepUnusedDataFor: 60 * 60 * 60,
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getAllSemesters: build.query({
			query: (params) => ({ url: '/smester', method: 'GET', params }),
			providesTags: ['Semesters']
		}),
		addSemester: build.mutation({
			query: (payload) => {
				return { url: '/add-mester', method: 'POST', data: payload };
			},
			invalidatesTags: ['Semesters']
		}),
		updateSemester: build.mutation({
			query: ({ id, payload }) => {
				return { url: '/update-mester/' + id, method: 'PATCH', data: payload };
			},
			invalidatesTags: ['Semesters']
		})
	})
});
export const { useGetAllSemestersQuery, useAddSemesterMutation, useUpdateSemesterMutation } = semesterApi;

export default semesterApi;
