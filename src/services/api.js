// import axios from 'axios';
// import { logout, setAuthHeader } from '../redux/auth/operations.js';
// import { store } from '../redux/store.js';

// const axiosAPI = axios.create({
//   // baseURL: 'https://vidreira-backend.onrender.com',
//   baseURL: 'http://localhost:3000',
//   withCredentials: true,
// });

// axiosAPI.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshResponse = await axios.post(
//           // 'https://vidreira-backend.onrender.com/auth/refresh',
//           'http://localhost:3000/auth/refresh',
//           {},
//           { withCredentials: true }
//         );

//         const { accessToken } = refreshResponse.data;
//         setAuthHeader(accessToken);

//         return axiosAPI(originalRequest);
//       } catch (err) {
//         store.dispatch(logout());
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export const axiosPublic = axios.create({
//   baseURL: 'http://localhost:3000',
//   withCredentials: true,
// });

// export default axiosAPI;

import axios from 'axios';
import { logout, setAuthHeader } from '../redux/auth/operations.js';
import { store } from '../redux/store.js';

const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'https://vidreira-backend.onrender.com';

const axiosAPI = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosAPI.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Якщо токен недійсний — пробуємо оновити
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
        console.warn('Не вдалося оновити сесію:', refreshError.message);

        // Якщо refresh теж не вдалий — робимо логаут
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    // Якщо користувач неавторизований або refresh не допоміг
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Сесія недійсна або користувач неавторизований');
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
