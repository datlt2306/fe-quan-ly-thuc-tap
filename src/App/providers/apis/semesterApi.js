import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

const semesterApi = createApi({
	reducerPath: 'semesterApi',
	tagTypes: ['Semester'],
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		getAllSemesters: build.query({
			query: (params) => ({ url: '/smester', method: 'GET', params })
		})
	})
});
export const { useGetAllSemestersQuery } = semesterApi;

export default semesterApi;
