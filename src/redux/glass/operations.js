import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPI from '../../services/api.js';

export const getGlassOptions = createAsyncThunk(
  'glass/getGlassOptions',
  async (_, thunkAPI) => {
    try {
      const response = await axiosAPI.get('/glass');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
