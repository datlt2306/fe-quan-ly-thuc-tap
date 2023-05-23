import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

const reportApi = createApi({
	reducerPath: 'reportApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['Report'],
	endpoints: (build) => ({
		uploadForm: build.mutation({
			query: (payload) => ({ url: '/upload/form', method: 'PATCH', data: payload }),
			invalidatesTags: ['Report']
		})
	})
});

export const { useUploadFormMutation } = reportApi;

export default reportApi;
