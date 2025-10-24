
import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery_fromRedux from "./axiosBaseQuery_fromRedux";

export const baseApi =createApi({
    reducerPath: "baseApi",
    // baseQuery: fetchBaseQuery({baseUrl: config.baseUrl, credentials:"include"}),// redux-tookit er fetchBaseQuery use korle emn 
    baseQuery: axiosBaseQuery_fromRedux(),// axios use korle AxiosInstance er vitore (withCredentials:true)
   tagTypes:["USER"],
    endpoints:()=>({}),
})

