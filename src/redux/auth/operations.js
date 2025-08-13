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
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (values, thunkAPI) => {
    try {
      const response = await axiosAPI.post('/auth/login', values);
      setAuthHeader(response.data.accessToken);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  clearAuthHeader();
});
