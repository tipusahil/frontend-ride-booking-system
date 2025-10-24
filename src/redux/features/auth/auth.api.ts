import { baseApi } from "@/redux/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/register",
        method: "POST",
        data: userInfo,// baseApi.ts file (baseQuery: axiosBaseQuery_fromRedux()) eta use kore data key er maddome data backend e patate hoi, ar redux er ( baseQuery: fetchBaseQuery({baseUrl: config.baseUrl}) )  eta use korle (body) key er maddome data backend e patate hoi,
        // data:loginInfo // redux er builder hole data key te store korte hoi,
      }),
      invalidatesTags:["USER"],
    }),
    // ----2.
    login: builder.mutation({
      query: (loginInfo) => ({
        url: "/auth/login",
        method: "POST",
        data: loginInfo, // baseApi.ts file (baseQuery: axiosBaseQuery_fromRedux()) eta use kore data key er maddome data backend e patate hoi and (withCredentials:true) dite hoi, ar redux er ( baseQuery: fetchBaseQuery({baseUrl: config.baseUrl}) )  eta use korle (body) key er maddome data backend e patate hoi,and (credentials:"include") dite hoi, 
        // data:loginInfo // redux er builder hole data key te store korte hoi,
      }),
      invalidatesTags:["USER"],
    }),

    // ----3. get user data 
    getMeOrGetUserInfo: builder.query({
        query: ()=> ({
            url: "/users/me",
            method:"GET",
        }),
        providesTags:["USER"],
    }),

    // ----4. logout 
    logout: builder.mutation({
        query: ()=> ({
            url: "/auth/logout",
            method:"POST",
        }),
        invalidatesTags: ["USER"], // ager data clear korbe.
    })
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetMeOrGetUserInfoQuery, useLogoutMutation } = authApi;
