import { createSlice } from '@reduxjs/toolkit';
import { login, logout, register, getUser } from './operations.js';

const handlePending = state => {
  state.isUserLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isUserLoading = false;
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
    isUserLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload;
        state.isLoggedIn = false;
      })
      .addCase(register.rejected, handleRejected)

      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.isLoggedIn = true;
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, handleRejected)

      .addCase(logout.pending, handlePending)
      .addCase(logout.fulfilled, state => {
        state.isUserLoading = false;
        state.user = { name: null, role: null };
        state.token = null;
        state.isLoggedIn = false;
        state.error = null;
      })

      .addCase(logout.rejected, handleRejected)

      .addCase(getUser.pending, state => {
        state.isUserLoading = true;
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.isRefreshing = false;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.isRefreshing = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
