import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosAPI from '../../services/api.js';

export const getAllOrders = createAsyncThunk(
  'orders/getAllOrders',
  async ({ page = 1, perPage = 10 } = {}, thunkAPI) => {
    try {
      const response = await axiosAPI.get('/orders', {
        params: { page, perPage },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response.data.message || error.message
      );
    }
  }
);

export const getOrderById = createAsyncThunk(
  'orders/getOrderById',
  async (orderId, thunkAPI) => {
    try {
      const response = await axiosAPI.get(`/orders/${orderId}`);
      return response.data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const createOrMergeOrder = createAsyncThunk(
  'orders/createOrMergeOrder',
  async (values, thunkAPI) => {
    try {
      const response = await axiosAPI.post('/orders', values);
      return response.data.newOrder;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ orderId, values }, thunkAPI) => {
    try {
      const response = await axiosAPI.patch(`/orders/${orderId}`, values);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateOrderItem = createAsyncThunk(
  'orders/updateOrderItem',
  async ({ orderId, itemId, values }, thunkAPI) => {
    try {
      const response = await axiosAPI.patch(
        `/orders/${orderId}/${itemId}`,
        values
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateItemStatus = createAsyncThunk(
  'orders/updateItemStatus',
  async ({ orderId, itemId, status }, thunkAPI) => {
    try {
      const response = await axiosAPI.patch(`/orders/${orderId}/status`, {
        itemId,
        status,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId, thunkAPI) => {
    try {
      const response = await axiosAPI.delete(`/orders/${orderId}`);
      return response.data.orderId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteOrderItem = createAsyncThunk(
  'orders/deleteOrderItem',
  async ({ orderId, itemId }, thunkAPI) => {
    try {
      const response = await axiosAPI.delete(`/orders/${orderId}/${itemId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
