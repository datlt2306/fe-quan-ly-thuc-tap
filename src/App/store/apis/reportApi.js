import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

/**
 * @enum
 */
const TagTypes = {};

const reportApi = createApi({
	reducerPath: 'reportApi',
	baseQuery: axiosBaseQuery(),
	endpoints: (build) => ({
		uploadForm: build.mutation({
			query: (payload) => ({ url: '/upload/form', method: 'PATCH', data: payload })
		}),
		uploadReport: build.mutation({
			query: (payload) => ({ url: '/upload/report', method: 'PATCH', data: payload })
		})
	})
});

export const { useUploadFormMutation, useUploadReportMutation } = reportApi;

export default reportApi;
