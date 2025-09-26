import { createSlice } from '@reduxjs/toolkit';

// Load favorites from localStorage
const loadFavoritesFromStorage = () => {
  try {
    const favorites = localStorage.getItem('spacex-favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

// Save favorites to localStorage
const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem('spacex-favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    favoriteIds: loadFavoritesFromStorage(),
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const launchId = action.payload;
      const index = state.favoriteIds.indexOf(launchId);
      
      if (index === -1) {
        // Add to favorites
        state.favoriteIds.push(launchId);
      } else {
        // Remove from favorites
        state.favoriteIds.splice(index, 1);
      }
      
      // Persist to localStorage
      saveFavoritesToStorage(state.favoriteIds);
    },
    clearAllFavorites: (state) => {
      state.favoriteIds = [];
      saveFavoritesToStorage([]);
    },
  },
});

export const { toggleFavorite, clearAllFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;