import { createSlice } from '@reduxjs/toolkit';
import { getAllOrders, getOrderById } from './operations.js';
import { logout } from '../auth/operations.js';

const handlePending = state => {
  state.isOrdersLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.isOrdersLoading = false;
  state.error = action.payload;
};

const ordersSlice = createSlice({
  name: 'orders',

  initialState: {
    allOrders: [],
    currentOrder: null,
    isOrdersLoading: false,
    error: null,
  },

  reducers: {
    clearCurrentOrder: state => {
      state.currentOrder = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getAllOrders.pending, handlePending)
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.allOrders = action.payload.orders.data;
      })
      .addCase(getAllOrders.rejected, handleRejected)

      .addCase(getOrderById.pending, handlePending)
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(getOrderById.rejected, handleRejected)

      .addCase(logout.fulfilled, state => {
        (state.allOrders = []), (state.currentOrder = null);
      });
  },
});

export default ordersSlice.reducer;
export const { clearCurrentOrder } = ordersSlice.actions;
