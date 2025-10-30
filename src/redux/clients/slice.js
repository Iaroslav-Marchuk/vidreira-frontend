import { createSlice } from '@reduxjs/toolkit';

import { getAllClients } from './operations.js';

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    clientsList: [],
    isClientsLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllClients.pending, state => {
        state.isClientsLoading = true;
        state.error = null;
      })
      .addCase(getAllClients.fulfilled, (state, action) => {
        state.isClientsLoading = false;
        state.clientsList = action.payload.clients;
      })
      .addCase(getAllClients.rejected, (state, action) => {
        state.isClientsLoading = false;
        state.error = action.payload;
      });
  },
});

export default clientsSlice.reducer;
