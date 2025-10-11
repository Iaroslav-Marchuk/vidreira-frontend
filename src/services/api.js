import axios from 'axios';
import { logout, setAuthHeader } from '../redux/auth/operations.js';
import { store } from '../redux/store.js';

const axiosAPI = axios.create({
  // baseURL: 'https://vidreira-backend.onrender.com',
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

axiosAPI.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axiosAPI.post(
          '/auth/refresh',
          {},
          { withCredentials: true }
        );
        const { accessToken } = refreshResponse.data;

        setAuthHeader(accessToken);
        return axiosAPI(originalRequest);
      } catch (error) {
        store.dispatch(logout());
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosAPI;
