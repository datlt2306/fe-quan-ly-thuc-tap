import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../axiosBaseQuery";
import { build } from "vite";

const reportApi = createApi({
   reducerPath: "campusApi",
   baseQuery: axiosBaseQuery(),
   tagTypes: ["Campus"],
   endpoints: (build) => ({

   })
})

export default reportApi;