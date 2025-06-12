import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import fleetReducer from "./Slice/fleetSlice";
import driverReducer from "./Slice/driverSlice";
import customerReducer from './Slice/customerSlice';
import bookingReducer from './Slice/bookingSlice';
import historyReducer from './Slice/historySlice';
import formReducer from './Slice/formSlice';
import messageReducer from './Slice/messageSlice';
import pricingReducer from '@/redux/Slice/pricingSlice';
import notificationReducer from '@/redux/Slice/notificationSlice';

// Persist config for reducers you want to persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['fleet', 'driver', 'customer', 'booking', 'form', 'pricing', 'message', 'history'] 
};

// Create non-persisted root reducer
const rootReducer = combineReducers({
  fleet: fleetReducer,
  driver: driverReducer,
  customer: customerReducer,
  booking: bookingReducer,
  form: formReducer,
  pricing: pricingReducer,
  message: messageReducer,
  history: historyReducer,
  notification: notificationReducer, // not persisted
});

// Apply persistReducer only to selected reducers
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
