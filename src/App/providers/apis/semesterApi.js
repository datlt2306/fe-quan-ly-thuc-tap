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
		})
	})
});
export const { useGetAllSemestersQuery } = semesterApi;

export default semesterApi;
