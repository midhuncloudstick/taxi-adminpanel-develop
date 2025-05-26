import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import fleetReducer from "./Slice/fleetSlice";
import driverReducer from "./Slice/driverSlice"
import customerReducer from './Slice/customerSlice'
import bookingReducer from './Slice/bookingSlice'
import historyReducer from './Slice/historySlice'
import { drivers } from "@/data/mockData";

// Combine all reducers
const rootReducer = combineReducers({
  fleet: fleetReducer,
  driver: driverReducer,
  customer:customerReducer,
  booking:bookingReducer,
  history:historyReducer, // Assuming you have a historyReducer
  // Add other slices here like `user: userReducer`
});

const persistConfig = {
  key: "root",
  storage,
};

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
