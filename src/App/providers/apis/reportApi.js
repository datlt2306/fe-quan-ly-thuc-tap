import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";

const reportApi = createApi({
   reducerPath: "reportApi",
   baseQuery: axiosBaseQuery(),
   tagTypes: ["Report"],
   endpoints: (build) => ({
      uploadFormFile: build.mutation({
         query: (payload) => ({url: '/drive/upload', method: "POST", data: payload})
      }),
      uploadForm: build.mutation({
         query: (payload) => ({url: '/form', method: "PATCH", data: payload})
      })
   })
})

export const {useUploadFormFileMutation, useUploadFormMutation} = reportApi

export default reportApi;