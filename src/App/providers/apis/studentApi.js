import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

const studentApi = createApi({
	reducerPath: 'studentApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Students', 'StudentsToReview'],
	keepUnusedDataFor: 60 * 60 * 60,
	endpoints: (build) => ({
		getStudents: build.query({
			query: (params) => ({ url: '/student', method: 'GET', params }),
			providesTags: ['Students']
		}),
		getOneStudent: build.query({
			query: (id) => ({ url: `/student/${id}`, method: 'GET' })
		}),
		getStudentsToReview: build.query({
			query: (params) => ({ url: '/student/reviews', method: 'GET', params }),
			providesTags: ['StudentsToReview']
		}),
		updateReview: build.mutation({
			query: (payload) => ({ url: '/student/status', method: 'PATCH', data: payload }),
			invalidatesTags: ['StudentsToReview', 'Students']
		}),
		addStudents: build.mutation({
			query: (payload) => ({ url: '/student', method: 'POST', data: payload }),
			invalidatesTags: ['Students']
		})
	})
});

export const {
	useGetStudentsQuery,
	useGetOneStudentQuery,
	useAddStudentsMutation,
	useGetStudentsToReviewQuery,
	useUpdateReviewMutation
} = studentApi;

export default studentApi;
