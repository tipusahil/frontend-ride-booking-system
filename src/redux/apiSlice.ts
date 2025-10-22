// import { createApi, fetchBaseQuery } from '@rtkjs/query/react';

// export const apiSlice = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'http://your-backend-url/api', // তোমার ব্যাকএন্ড URL
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem('token'); // JWT
//       if (token) headers.set('authorization', `Bearer ${token}`);
//       return headers;
//     },
//   }),
//   tagTypes: ['User', 'Ride', 'Driver'], // ক্যাশিং/ইনভ্যালিডেশন
//   endpoints: () => ({}), // পরে এক্সটেন্ড করবে
// });