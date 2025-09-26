import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer, { toggleFavorite, clearAllFavorites } from '../store/slices/favoritesSlice';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Favorites functionality', () => {
  let store;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    
    // Create a fresh store
    store = configureStore({
      reducer: {
        favorites: favoritesReducer,
      },
    });
  });

  test('initializes with empty favorites when localStorage is empty', () => {
    const state = store.getState();
    expect(state.favorites.favoriteIds).toEqual([]);
  });

  test('loads favorites from localStorage on initialization', () => {
    // Pre-populate localStorage
    localStorage.setItem('spacex-favorites', JSON.stringify(['launch1', 'launch2']));
    
    // Create new store (this should load from localStorage)
    const newStore = configureStore({
      reducer: {
        favorites: favoritesReducer,
      },
    });
    
    const state = newStore.getState();
    expect(state.favorites.favoriteIds).toEqual(['launch1', 'launch2']);
  });

  test('adds launch to favorites', () => {
    const launchId = 'test-launch-1';
    
    store.dispatch(toggleFavorite(launchId));
    
    const state = store.getState();
    expect(state.favorites.favoriteIds).toContain(launchId);
    
    // Check localStorage persistence
    const storedFavorites = JSON.parse(localStorage.getItem('spacex-favorites'));
    expect(storedFavorites).toContain(launchId);
  });

  test('removes launch from favorites when already favorited', () => {
    const launchId = 'test-launch-1';
    
    // Add to favorites first
    store.dispatch(toggleFavorite(launchId));
    let state = store.getState();
    expect(state.favorites.favoriteIds).toContain(launchId);
    
    // Remove from favorites
    store.dispatch(toggleFavorite(launchId));
    state = store.getState();
    expect(state.favorites.favoriteIds).not.toContain(launchId);
    
    // Check localStorage persistence
    const storedFavorites = JSON.parse(localStorage.getItem('spacex-favorites'));
    expect(storedFavorites).not.toContain(launchId);
  });

  test('handles multiple favorites correctly', () => {
    const launchIds = ['launch1', 'launch2', 'launch3'];
    
    // Add multiple favorites
    launchIds.forEach(id => {
      store.dispatch(toggleFavorite(id));
    });
    
    const state = store.getState();
    expect(state.favorites.favoriteIds).toEqual(launchIds);
    
    // Check localStorage persistence
    const storedFavorites = JSON.parse(localStorage.getItem('spacex-favorites'));
    expect(storedFavorites).toEqual(launchIds);
  });

  test('clears all favorites', () => {
    // Add some favorites first
    ['launch1', 'launch2', 'launch3'].forEach(id => {
      store.dispatch(toggleFavorite(id));
    });
    
    // Verify favorites were added
    let state = store.getState();
    expect(state.favorites.favoriteIds.length).toBe(3);
    
    // Clear all favorites
    store.dispatch(clearAllFavorites());
    
    state = store.getState();
    expect(state.favorites.favoriteIds).toEqual([]);
    
    // Check localStorage is cleared
    const storedFavorites = JSON.parse(localStorage.getItem('spacex-favorites'));
    expect(storedFavorites).toEqual([]);
  });

  test('handles localStorage errors gracefully', () => {
    // Mock localStorage to throw an error
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = jest.fn(() => {
      throw new Error('localStorage error');
    });
    
    // Should not crash and should return empty array
    const newStore = configureStore({
      reducer: {
        favorites: favoritesReducer,
      },
    });
    
    const state = newStore.getState();
    expect(state.favorites.favoriteIds).toEqual([]);
    
    // Restore original localStorage
    localStorage.getItem = originalGetItem;
  });

  test('handles invalid JSON in localStorage', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('spacex-favorites', 'invalid-json');
    
    // Should not crash and should return empty array
    const newStore = configureStore({
      reducer: {
        favorites: favoritesReducer,
      },
    });
    
    const state = newStore.getState();
    expect(state.favorites.favoriteIds).toEqual([]);
  });

  test('persists favorites correctly when localStorage setItem fails', () => {
    // Mock localStorage setItem to throw an error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = jest.fn(() => {
      throw new Error('localStorage setItem error');
    });
    
    const launchId = 'test-launch';
    store.dispatch(toggleFavorite(launchId));
    
    // State should still be updated even if localStorage fails
    const state = store.getState();
    expect(state.favorites.favoriteIds).toContain(launchId);
    
    // Should log error
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error saving favorites to localStorage:',
      expect.any(Error)
    );
    
    // Restore mocks
    localStorage.setItem = originalSetItem;
    consoleSpy.mockRestore();
  });
});