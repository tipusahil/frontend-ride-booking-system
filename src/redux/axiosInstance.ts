import config from "@/config/env";
import axios from "axios"

export const axionsInstance = axios.create({
  baseURL:config.baseUrl,
  timeout: 10000,
  // headers: {'X-Custom-Header': 'foobar'},
  withCredentials:true,

});


// -----------axios interceptor -------------------
// Add a request interceptor
axionsInstance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
  // { synchronous: true, runWhen: () => /* This function returns true */}
);

// Add a response interceptor
axionsInstance.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
