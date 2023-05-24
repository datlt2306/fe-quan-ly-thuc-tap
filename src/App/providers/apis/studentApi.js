import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

const studentApi = createApi({
	reducerPath: 'studentApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Students', 'StudentReviewCV'],
	keepUnusedDataFor: 60 * 60 * 60,
	endpoints: (build) => ({
		getStudents: build.query({
			query: (params) => ({ url: '/student', method: 'GET', params }),
			providesTags: ['Students']
		}),
		getOneStudent: build.query({
			query: (id) => ({ url: `/student/${id}`, method: 'GET' })
		}),
		getStudentReviewCV: build.query({
			query: () => ({ url: '/student/reviewcv', method: 'GET' }),
			providesTags: ['StudentReviewCV']
		}),
		updateReview: build.mutation({
			query: (payload) => ({ url: '/student/status', method: 'PATCH', data: payload }),
			invalidatesTags: ['StudentReviewCV', 'Students']
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
	useGetStudentReviewCVQuery,
	useUpdateReviewMutation
} = studentApi;
export default studentApi;
