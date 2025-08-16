import axios from 'axios';

const axiosAPI = axios.create({
  baseURL: 'https://vidreira-backend.onrender.com',
  withCredentials: true,
});

export default axiosAPI;
