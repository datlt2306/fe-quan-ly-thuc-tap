import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

const registerInternAPI = createApi({
	reducerPath: 'registerInternAPI',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['registerIntern'],
	endpoints: (build) => ({
		uploadCv: build.mutation({
			query: (payload) => {
				return { url: '/intern/support', method: 'PATCH', data: payload };
			},
			invalidatesTags: ['registerIntern']
		})
	})
});

export const { useUploadCvMutation } = registerInternAPI;

export default registerInternAPI;
