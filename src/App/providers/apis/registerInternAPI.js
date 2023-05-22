import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

const registerInternApi = createApi({
	reducerPath: 'registerInternApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['RegisterIntern'],
	endpoints: (build) => ({
		uploadCv: build.mutation({
			query: (payload) => {
				return { url: '/intern/support', method: 'PATCH', data: payload };
			},
			invalidatesTags: ['RegisterIntern']
		})
	})
});

export const { useUploadCvMutation } = registerInternApi;

export default registerInternApi;
