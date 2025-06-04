import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';

const apiUrl = "https://brisbane.cloudhousetechnologies.com"

const ApiClient: AxiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

// ✅ Request interceptor to always get the latest token
ApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Always fetch latest
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response interceptor
ApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.data.message === 'token expired' && error.config && !error.config.__isRetryRequest) {
      console.log('Error: token expired');
    }
    if (error.response?.status === 403) {
      console.log('Error: 403 Forbidden');
    }
    return Promise.reject(error);
  }
);

// ✅ API methods
const api = {
  getEvents(url: string) {
    return ApiClient.get(url);
  },
  postEvents(url: string, data: Record<string, unknown> | FormData | unknown[], config?: AxiosRequestConfig) {
    return ApiClient.post(url, data, config);
  },
  deleteEvents(url: string) {
    return ApiClient.delete(url);
  },
  patchEvent(url: string, data: Record<string, unknown> | FormData | unknown[], config?: AxiosRequestConfig) {
    return ApiClient.patch(url, data,config);
  },
  putEvent(url: string, data: Record<string, unknown> | FormData, config?: AxiosRequestConfig) {
    return ApiClient.put(url, data,config);
  },
};

export { ApiClient, api };
