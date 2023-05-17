
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const registerInternAPI = createApi({
   reducerPath: "registerInternAPI",
   baseQuery: axiosBaseQuery(),
   tagTypes: ["registerIntern"],
   endpoints: (build) => ({
      upload: build.mutation({
         query: (payload) => ({ url: "/intern/support", method: "PATCH" , data:payload}),
         invalidatesTags: ["providesTags"],
      }),
   }),
});

export const { useUploadMutation } = registerInternAPI;

export default registerInternAPI;



