import { createSlice } from '@reduxjs/toolkit';
import { getStats } from './operations.js';

const statsSlice = createSlice({
  name: 'stats',

  initialState: {
    allStats: {},
    isStatsLoading: false,
    error: null,
  },

  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getStats.pending, state => {
        state.isStatsLoading = true;
        state.error = null;
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.isStatsLoading = false;
        state.allStats = action.payload.stats;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.isStatsLoading = false;
        state.error = action.payload;
      });
  },
});

export default statsSlice.reducer;
