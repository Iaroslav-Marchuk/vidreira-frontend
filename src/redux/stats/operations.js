import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPI from '../../services/api.js';

export const getStats = createAsyncThunk(
  'stats/getStats',
  async (_, thunkAPI) => {
    try {
      const response = await axiosAPI.get('/stats');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
