import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

/**
 * @enum
 */
const TagTypes = {
	SEMESTERS: 'Semesters'
};

const semesterApi = createApi({
	reducerPath: 'semesterApi',
	tagTypes: [TagTypes.SEMESTERS],
	keepUnusedDataFor: 60 * 60 * 60,
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getAllSemesters: build.query({
			query: (params) => ({ url: '/semester', method: 'GET', params }),
			providesTags: [TagTypes.SEMESTERS]
		}),
		addSemester: build.mutation({
			query: (payload) => {
				return { url: '/semester', method: 'POST', data: payload };
			},
			invalidatesTags: (_result, error, _data) => (error ? [] : [TagTypes.SEMESTERS])
		}),
		updateSemester: build.mutation({
			query: ({ id, payload }) => {
				return { url: '/semester/' + id, method: 'PATCH', data: payload };
			},
			invalidatesTags: (_result, error, _data) => (error ? [] : [TagTypes.SEMESTERS])
		})
	})
});
export const { useGetAllSemestersQuery, useAddSemesterMutation, useUpdateSemesterMutation } = semesterApi;

export default semesterApi;
