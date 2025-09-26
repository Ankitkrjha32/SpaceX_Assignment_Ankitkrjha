import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    searchQuery: '',
    launchYear: '',
    showSuccessfulOnly: false,
    showFavoritesOnly: false,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setLaunchYear: (state, action) => {
      state.launchYear = action.payload;
    },
    setSuccessFilter: (state, action) => {
      state.showSuccessfulOnly = action.payload;
    },
    toggleSuccessfulOnly: (state) => {
      state.showSuccessfulOnly = !state.showSuccessfulOnly;
    },
    toggleFavoritesOnly: (state) => {
      state.showFavoritesOnly = !state.showFavoritesOnly;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.launchYear = '';
      state.showSuccessfulOnly = false;
      state.showFavoritesOnly = false;
    },
  },
});

export const {
  setSearchQuery,
  setLaunchYear,
  setSuccessFilter,
  toggleSuccessfulOnly,
  toggleFavoritesOnly,
  clearFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;