import { createSlice } from '@reduxjs/toolkit';
import {
  createOrMergeOrder,
  deleteOrder,
  deleteOrderItem,
  getAllOrders,
  getOrderById,
  updateItemStatus,
  updateOrder,
  updateOrderItem,
} from './operations.js';
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
    currentPage: 1,
    perPage: 10,
    hasNextPage: false,
    totalPages: 1,
  },

  reducers: {
    clearCurrentOrder: state => {
      state.currentOrder = null;
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getAllOrders.pending, handlePending)
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        const { data, page, perPage, totalPages, hasNextPage } =
          action.payload.orders;
        if (page === 1) {
          state.allOrders = data;
        } else {
          state.allOrders = [...state.allOrders, ...data];
        }
        state.currentPage = page;
        state.perPage = perPage;
        state.totalPages = totalPages;
        state.hasNextPage = hasNextPage;
      })
      .addCase(getAllOrders.rejected, handleRejected)

      .addCase(getOrderById.pending, handlePending)
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.currentOrder = action.payload.order;
      })
      .addCase(getOrderById.rejected, handleRejected)

      .addCase(logout.fulfilled, state => {
        state.allOrders = [];
        state.currentOrder = null;
        state.currentPage = 1;
        state.totalPages = 1;
      })

      .addCase(createOrMergeOrder.pending, handlePending)
      .addCase(createOrMergeOrder.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.error = null;
        const newOrder = action.payload;
        const index = state.allOrders.findIndex(
          order => order._id === newOrder._id
        );
        if (index !== -1) {
          state.allOrders[index] = newOrder;
        } else {
          state.allOrders.push(newOrder);
        }

        state.currentOrder = newOrder;
      })
      .addCase(createOrMergeOrder.rejected, handleRejected)

      .addCase(updateOrder.pending, handlePending)
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.error = null;
        const updatedOrder = action.payload;
        const index = state.allOrders.findIndex(
          order => order._id === updatedOrder._id
        );
        if (index !== -1) {
          state.allOrders[index] = updatedOrder;
        }
        if (state.currentOrder?._id === updatedOrder._id) {
          state.currentOrder = updatedOrder;
        }
      })
      .addCase(updateOrder.rejected, handleRejected)

      .addCase(updateOrderItem.pending, handlePending)
      .addCase(updateOrderItem.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.error = null;
        const updatedOrder = action.payload;
        const index = state.allOrders.findIndex(
          order => order._id === updatedOrder._id
        );
        if (index !== -1) {
          state.allOrders[index] = updatedOrder;
        }

        if (state.currentOrder?._id === updatedOrder._id) {
          state.currentOrder = updatedOrder;
        }
      })
      .addCase(updateOrderItem.rejected, handleRejected)

      .addCase(updateItemStatus.pending, handlePending)
      .addCase(updateItemStatus.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.error = null;
        const updatedOrder = action.payload;
        const index = state.allOrders.findIndex(
          order => order._id === updatedOrder._id
        );
        if (index !== -1) {
          state.allOrders[index] = updatedOrder;
        }
        if (state.currentOrder?._id === updatedOrder._id) {
          state.currentOrder = updatedOrder;
        }
      })
      .addCase(updateItemStatus.rejected, handleRejected)

      .addCase(deleteOrder.pending, handlePending)
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.error = null;
        const deletedId = action.payload;
        state.allOrders = state.allOrders.filter(
          order => order._id != deletedId
        );
        if (state.currentOrder?._id === deletedId) {
          state.currentOrder = null;
        }
      })
      .addCase(deleteOrder.rejected, handleRejected)

      .addCase(deleteOrderItem.pending, handlePending)
      .addCase(deleteOrderItem.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.error = null;
        const { updatedOrder } = action.payload;
        if (updatedOrder) {
          const index = state.allOrders.findIndex(
            order => order._id === updatedOrder._id
          );
          if (index !== -1) {
            state.allOrders[index] = { ...updatedOrder }; // Копія для ререндеру
          }
          if (state.currentOrder?._id === updatedOrder._id) {
            state.currentOrder = { ...updatedOrder };
          }
        } else {
          state.allOrders = state.allOrders.filter(
            order => order._id !== action.meta.arg.orderId
          );
          if (state.currentOrder?._id === action.meta.arg.orderId) {
            state.currentOrder = null;
          }
        }
      })
      .addCase(deleteOrderItem.rejected, handleRejected);
  },
});

export default ordersSlice.reducer;
export const { clearCurrentOrder, setCurrentPage } = ordersSlice.actions;
