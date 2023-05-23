import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axiosBaseQuery';

<<<<<<< HEAD
const registerInternAPI = createApi({
	reducerPath: 'registerInternAPI',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['registerIntern'],
=======
const registerInternApi = createApi({
	reducerPath: 'registerInternApi',
	baseQuery: axiosBaseQuery(),
	tagTypes: ['RegisterIntern'],
>>>>>>> d9c780983b704e9aae04b622bedc398cb9bc0b54
	endpoints: (build) => ({
		uploadCv: build.mutation({
			query: (payload) => {
				return { url: '/intern/support', method: 'PATCH', data: payload };
			},
<<<<<<< HEAD
			invalidatesTags: ['registerIntern']
=======
			invalidatesTags: ['RegisterIntern']
>>>>>>> d9c780983b704e9aae04b622bedc398cb9bc0b54
		})
	})
});

<<<<<<< HEAD
export const { useUploadCvMutation } = registerInternAPI;

export default registerInternAPI;
=======
export const { useUploadCvMutation } = registerInternApi;

export default registerInternApi;
>>>>>>> d9c780983b704e9aae04b622bedc398cb9bc0b54
