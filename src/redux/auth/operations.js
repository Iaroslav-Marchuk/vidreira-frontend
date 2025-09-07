import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPI from '../../services/api.js';

const setAuthHeader = token => {
  axiosAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  axiosAPI.defaults.headers.common.Authorization = '';
};

export const register = createAsyncThunk(
  'auth/register',
  async (values, thunkAPI) => {
    try {
      const response = await axiosAPI.post('/auth/register', values);
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (values, thunkAPI) => {
    try {
      const loginResponse = await axiosAPI.post('/auth/login', values);
      setAuthHeader(loginResponse.data.accessToken);

      const profileResponse = await axiosAPI.get('/auth/currentUser', {
        withCredentials: true,
      });

      return {
        accessToken: loginResponse.data.accessToken,
        user: profileResponse.data.user,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await axiosAPI.post('/auth/logout', {}, { withCredentials: true });
    clearAuthHeader();
    return;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const getUser = createAsyncThunk(
  'auth/currentUser',
  async (_, thunkAPI) => {
    try {
      const response = await axiosAPI.get('/auth/currentUser', {
        withCredentials: true,
      });

      const { accessToken } = response.data;
      if (accessToken) setAuthHeader(accessToken);

      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export { setAuthHeader };
