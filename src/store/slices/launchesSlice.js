import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { spacexAPI } from '../../services/spacexAPI';

// Async thunk for fetching launches
export const fetchLaunches = createAsyncThunk(
  'launches/fetchLaunches',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Redux: fetchLaunches thunk called');
      const launches = await spacexAPI.getLaunches();
      console.log('Redux: Received launches:', launches.length);
      return launches;
    } catch (error) {
      console.error('Redux: fetchLaunches error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching single launch details
export const fetchLaunchDetails = createAsyncThunk(
  'launches/fetchLaunchDetails',
  async (launchId, { rejectWithValue }) => {
    try {
      const launch = await spacexAPI.getLaunchById(launchId);
      return launch;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const launchesSlice = createSlice({
  name: 'launches',
  initialState: {
    launches: [],
    selectedLaunch: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedLaunch: (state) => {
      state.selectedLaunch = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch launches
      .addCase(fetchLaunches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaunches.fulfilled, (state, action) => {
        state.loading = false;
        state.launches = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchLaunches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch launches';
      })
      // Fetch launch details
      .addCase(fetchLaunchDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLaunchDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLaunch = action.payload;
      })
      .addCase(fetchLaunchDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch launch details';
      });
  },
});

export const { clearError, clearSelectedLaunch } = launchesSlice.actions;
export default launchesSlice.reducer;