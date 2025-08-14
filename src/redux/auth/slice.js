import { createSlice } from '@reduxjs/toolkit';
import { login, logout, register } from './operations.js';

const handlePending = state => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};
const authSlice = createSlice({
  name: 'auth',

  initialState: {
    user: {
      name: null,
      role: null,
    },
    token: null,
    isLoggedIn: false,
    isRefreshing: false,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(register.pending, handlePending)

      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;

        state.isLoggedIn = true;
      })

      .addCase(register.rejected, handleRejected)

      .addCase(login.pending, handlePending)

      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.accessToken;
        state.isLoggedIn = true;
      })

      .addCase(login.rejected, handleRejected)

      .addCase(logout.pending, handlePending)

      .addCase(logout.fulfilled, state => {
        state.isLoading = false;
        state.user = { name: null, role: null };
        // state.items = [];                   -------- додати, коли буде стан для ордерс
        state.token = null;
        state.isLoggedIn = false;
      })

      .addCase(logout.rejected, handleRejected);
  },
});

export default authSlice.reducer;
