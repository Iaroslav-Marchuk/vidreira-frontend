import { createSlice } from '@reduxjs/toolkit';
import {
  createOrder,
  deleteOrder,
  deleteOrderItem,
  getAllOrders,
  getArchive,
  getOrderById,
  getOrderHistory,
  mergeOrder,
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
    history: [],
    archive: [],
    currentOrder: null,
    isOrdersLoading: false,
    isArchiveLoading: false,
    isHistoryLoading: false,
    error: null,
    currentPage: 1,
    perPage: 10,
    totalPages: 1,
    hasNextPage: false,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    searchQuery: '',
  },

  reducers: {
    clearCurrentOrder: state => {
      state.currentOrder = null;
    },

    clearArchive: state => {
      state.archive = [];
    },

    clearHistory: state => {
      state.history = [];
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;
      state.currentPage = 1;
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getAllOrders.pending, handlePending)
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;

        const {
          data,
          page,
          perPage,
          totalPages,
          hasNextPage,
          sortBy,
          sortOrder,
        } = action.payload.orders;

        if (sortBy) state.sortBy = sortBy;
        if (sortOrder) state.sortOrder = sortOrder;

        if (page === 1) {
          state.allOrders = data;
        } else {
          const newOrders = data.filter(
            o => !state.allOrders.some(existing => existing._id === o._id)
          );
          state.allOrders = [...state.allOrders, ...newOrders];
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

      .addCase(createOrder.pending, handlePending)
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.error = null;
        const order = action.payload;
        const index = state.allOrders.findIndex(
          order => order._id === order._id
        );

        if (index !== -1) {
          state.allOrders[index] = order;
        } else {
          state.allOrders.unshift(order);
        }

        state.currentOrder = order;
      })
      .addCase(createOrder.rejected, handleRejected)

      .addCase(mergeOrder.pending, handlePending)
      .addCase(mergeOrder.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.error = null;
        const updatedOrder = action.payload;
        const index = state.allOrders.findIndex(
          order => order._id === updatedOrder._id
        );

        if (index !== -1) {
          state.allOrders[index] = updatedOrder;
        } else {
          state.allOrders.unshift(updatedOrder);
        }

        state.currentOrder = updatedOrder;
      })
      .addCase(mergeOrder.rejected, handleRejected)

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
            state.allOrders[index] = { ...updatedOrder };
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
      .addCase(deleteOrderItem.rejected, handleRejected)

      .addCase(getOrderHistory.pending, state => {
        state.isHistoryLoading = true;
        state.error = null;
      })
      .addCase(getOrderHistory.fulfilled, (state, action) => {
        state.isHistoryLoading = false;
        state.history = action.payload.history;
      })
      .addCase(getOrderHistory.rejected, (state, action) => {
        state.isHistoryLoading = false;
        state.error = action.payload;
      })

      .addCase(getArchive.pending, state => {
        (state.isArchiveLoading = true), (state.error = null);
      })
      .addCase(getArchive.fulfilled, (state, action) => {
        state.isArchiveLoading = false;

        const {
          data,
          page,
          perPage,
          totalPages,
          hasNextPage,
          sortBy,
          sortOrder,
        } = action.payload.archive;
        if (sortBy) state.sortBy = sortBy;
        if (sortOrder) state.sortOrder = sortOrder;

        if (page === 1) {
          state.archive = data;
        } else {
          const newOrders = data.filter(
            o => !state.archive.some(existing => existing._id === o._id)
          );
          state.archive = [...state.archive, ...newOrders];
        }
        state.currentPage = page;
        state.perPage = perPage;
        state.totalPages = totalPages;
        state.hasNextPage = hasNextPage;
      })
      .addCase(getArchive.rejected, (state, action) => {
        state.isArchiveLoading = false;
        state.error = action.payload;
      });
  },
});

export default ordersSlice.reducer;
export const {
  clearCurrentOrder,
  clearHistory,
  clearArchive,
  setCurrentPage,
  setSearchQuery,
  setSorting,
} = ordersSlice.actions;
