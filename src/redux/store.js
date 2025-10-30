import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/slice.js';
import ordersReducer from './orders/slice.js';
import statsReducer from './stats/slice.js';
import glassReducer from './glass/slice.js';
import rolesReducer from './roles/slice.js';
import clientsReducer from './clients/slice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    stats: statsReducer,
    glassOptions: glassReducer,
    roles: rolesReducer,
    clients: clientsReducer,
  },
});
