import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic } from '../../services/api.js';

export const getAllRoles = createAsyncThunk(
  'roles/getAllRoles',
  async (_, thunkAPI) => {
    try {
      const response = await axiosPublic.get('/roles');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
