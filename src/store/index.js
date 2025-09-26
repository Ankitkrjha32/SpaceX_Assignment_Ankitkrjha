import { configureStore } from '@reduxjs/toolkit';
import launchesReducer from './slices/launchesSlice';
import favoritesReducer from './slices/favoritesSlice';
import filtersReducer from './slices/filtersSlice';

export const store = configureStore({
  reducer: {
    launches: launchesReducer,
    favorites: favoritesReducer,
    filters: filtersReducer,
  },
});