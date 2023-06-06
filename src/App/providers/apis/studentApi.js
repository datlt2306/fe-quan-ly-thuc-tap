import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';
import { InternSupportType, StudentStatusEnum } from '@/App/constants/studentConstants';
import { formatDate } from '@/Core/utils/formatDate';

/**
 * @enum
 */
const TagTypes = {
	STUDENTS: 'Students',
	STUDENTS_TO_REVIEW: 'StudentsToReview'
};

/**
 * * Do not call api to fetch data again if error
 * * Example: invalidatesTags: (_result, error, _data) => (error ? [] : ['Some_tag'])
 */

const studentApi = createApi({
	reducerPath: 'studentApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: Object.values(TagTypes),
	keepUnusedDataFor: 60 * 60 * 60,
	endpoints: (build) => ({
		getStudents: build.query({
			query: (params) => ({ url: '/student', method: 'GET', params }),
			transformResponse: (response) => transformStudentListData(response),
			providesTags: [TagTypes.STUDENTS]
		}),
		getOneStudent: build.query({
			query: (id) => ({ url: `/student/${id}`, method: 'GET' })
		}),
		getStudentsToReview: build.query({
			query: (params) => ({ url: '/student/reviews', method: 'GET', params }),
			transformResponse: (response) => transformStudentListData(response),
			providesTags: [TagTypes.STUDENTS_TO_REVIEW]
		}),
		updateStudent: build.mutation({
			query: ({ id, payload }) => ({ url: `/student/${id}`, method: 'PATCH', data: payload }),
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		updateReview: build.mutation({
			query: (payload) => ({ url: '/student/status', method: 'PATCH', data: payload }),
			invalidatesTags: (_result, error, _data) => (error ? [] : Object.values(TagTypes))
		}),
		addStudents: build.mutation({
			query: (payload) => ({ url: '/student', method: 'POST', data: payload }),
			invalidatesTags: (_result, error, _data) => (error ? [] : [TagTypes.STUDENTS])
		})
	})
});

function transformStudentListData(data) {
	return Array.isArray(data)
		? data.map((student, index) => {
				const companyStudentApplyFor =
					student.support === 1
						? {
								nameCompany: student.business?.name,
								taxCode: student.business?.tax_code,
								addressCompany: student.business?.address
						  }
						: student.support === 0
						? {
								nameCompany: student?.nameCompany,
								taxCode: student?.taxCode,
								addressCompany: student?.addressCompany
						  }
						: null;

				return {
					...student,
					index: index + 1,
					createdAt: formatDate(student.createdAt),
					statusCheck: StudentStatusEnum[student.statusCheck],
					support: InternSupportType[student.support],
					...companyStudentApplyFor
				};
		  })
		: [];
}

export const {
	useGetStudentsQuery,
	useGetOneStudentQuery,
	useAddStudentsMutation,
	useUpdateStudentMutation,
	useGetStudentsToReviewQuery,
	useUpdateReviewMutation
} = studentApi;

export default studentApi;
