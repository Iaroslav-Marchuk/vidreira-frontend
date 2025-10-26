import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/slice.js';
import ordersReducer from './orders/slice.js';
import statsReducer from './stats/slice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    stats: statsReducer,
  },
});
