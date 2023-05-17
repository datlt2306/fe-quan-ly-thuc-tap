import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const uploadDriveApi = createApi({
   reducerPath: "uploadDriveApi",
   baseQuery: axiosBaseQuery(),
   tagTypes: ["uploadDrive"],
   endpoints: (build) => ({
      uploadDrive: build.mutation({
         query: (payload) => {
            return { url: `/drive/upload`, method: "POST", data: payload };
         },
         providesTags: ["uploadDrive"],
      }),
   }),
});

export const { useUploadDriveMutation } = uploadDriveApi;
export default uploadDriveApi;


