import { createSlice } from '@reduxjs/toolkit';

import { getAllClients } from './operations.js';
import { logout } from '../auth/operations.js';

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
      })

      .addCase(logout.fulfilled, state => {
        state.clientsList = [];
      });
  },
});

export default clientsSlice.reducer;
