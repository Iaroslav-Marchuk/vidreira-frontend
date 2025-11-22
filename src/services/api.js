import axios from 'axios';
import { logout, setAuthHeader } from '../redux/auth/operations.js';
import { store } from '../redux/store.js';

// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'https://vidreira-backend.onrender.com';

const axiosAPI = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosAPI.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshResponse.data;
        setAuthHeader(accessToken);

        return axiosAPI(originalRequest);
      } catch (refreshError) {
        console.log('Failed to refresh the session:', refreshError.message);

        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Session is invalid or the user is not authorized');
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default axiosAPI;
