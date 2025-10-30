import { createSlice } from '@reduxjs/toolkit';
import { getAllRoles } from './operations.js';

const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    rolesList: [],
    isRolesLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllRoles.pending, state => {
        state.isRolesLoading = true;
        state.error = null;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.isRolesLoading = false;
        state.rolesList = action.payload.roles;
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.isRolesLoading = false;
        state.error = action.payload;
      });
  },
});

export default rolesSlice.reducer;
