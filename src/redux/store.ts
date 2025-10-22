// import { configureStore } from '@reduxjs/toolkit';
// import { setupListeners } from '@rtkjs/query';
// import { apiSlice } from '../services/apiSlice';

// export const store = configureStore({
//   reducer: {
//     [apiSlice.reducerPath]: apiSlice.reducer,
//     // পরে অথ স্লাইস যোগ করো
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(apiSlice.middleware),
// });

// setupListeners(store.dispatch);
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;