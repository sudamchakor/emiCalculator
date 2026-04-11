import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import emiReducer from './emiSlice';
import taxReducer from './taxSlice';

const persistConfig = {
  key: 'app_v1',
  storage,
  whitelist: ['emi', 'tax'], // Persist both slices
};

const rootReducer = combineReducers({
  emi: emiReducer,
  tax: taxReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

export const persistor = persistStore(store);
export default store;
