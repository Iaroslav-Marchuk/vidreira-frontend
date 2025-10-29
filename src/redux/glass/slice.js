import { createSlice } from '@reduxjs/toolkit';
import { getGlassOptions } from './operations.js';
import { logout } from '../auth/operations.js';

const glassSlice = createSlice({
  name: 'glassOptions',
  initialState: {
    glass: [],
    isGlassLoading: false,
    error: null,
  },

  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getGlassOptions.pending, state => {
        state.isGlassLoading = true;
        state.error = null;
      })
      .addCase(getGlassOptions.fulfilled, (state, action) => {
        state.isGlassLoading = false;
        state.glass = action.payload.glassOptions;
      })
      .addCase(getGlassOptions.rejected, (state, action) => {
        state.isGlassLoading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, state => {
        state.glass = [];
      });
  },
});

export default glassSlice.reducer;
