import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPI from '../../services/api.js';

export const getAllClients = createAsyncThunk(
  'clients/getAllClients',
  async (_, thunkAPI) => {
    try {
      const response = await axiosAPI.get('/clients');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
