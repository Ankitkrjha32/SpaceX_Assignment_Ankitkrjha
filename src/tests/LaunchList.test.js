import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LaunchList from '../components/launches/LaunchList';
import launchesReducer from '../store/slices/launchesSlice';
import filtersReducer from '../store/slices/filtersSlice';
import favoritesReducer from '../store/slices/favoritesSlice';

// Mock launch data
const mockLaunches = [
  {
    id: '1',
    name: 'Falcon Heavy Test Flight',
    date_utc: '2018-02-06T20:45:00.000Z',
    success: true,
    upcoming: false,
    rocket: { name: 'Falcon Heavy', type: 'Heavy Lift' },
    details: 'First test flight of Falcon Heavy',
    links: {
      patch: { small: 'https://example.com/patch1.png' },
      webcast: 'https://youtube.com/watch1'
    }
  },
  {
    id: '2',
    name: 'Starship SN15',
    date_utc: '2021-05-05T23:24:00.000Z',
    success: false,
    upcoming: false,
    rocket: { name: 'Starship', type: 'Super Heavy Lift' },
    details: 'High altitude test flight',
    links: {
      patch: { small: 'https://example.com/patch2.png' },
      webcast: 'https://youtube.com/watch2'
    }
  },
  {
    id: '3',
    name: 'Crew Dragon Demo-2',
    date_utc: '2020-05-30T19:22:00.000Z',
    success: true,
    upcoming: false,
    rocket: { name: 'Falcon 9', type: 'Medium Lift' },
    details: 'First crewed mission to ISS',
    links: {
      patch: { small: 'https://example.com/patch3.png' },
      webcast: 'https://youtube.com/watch3'
    }
  }
];

// Helper function to create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      launches: launchesReducer,
      filters: filtersReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      launches: {
        launches: mockLaunches,
        selectedLaunch: null,
        loading: false,
        error: null,
        lastUpdated: null,
      },
      filters: {
        searchQuery: '',
        launchYear: '',
        showSuccessfulOnly: false,
        showFavoritesOnly: false,
      },
      favorites: {
        favoriteIds: [],
      },
      ...initialState,
    },
  });
};

// Helper function to render component with Redux store
const renderWithStore = (component, initialState = {}) => {
  const store = createTestStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        {component}
      </Provider>
    ),
    store,
  };
};

describe('LaunchList Component', () => {
  const mockOnLaunchClick = jest.fn();

  beforeEach(() => {
    mockOnLaunchClick.mockClear();
  });

  test('renders launch list with correct number of launches', () => {
    renderWithStore(<LaunchList onLaunchClick={mockOnLaunchClick} />);
    
    // Check if the correct number of launches are displayed
    expect(screen.getByText('3 missions found')).toBeInTheDocument();
    expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument();
    expect(screen.getByText('Starship SN15')).toBeInTheDocument();
    expect(screen.getByText('Crew Dragon Demo-2')).toBeInTheDocument();
  });

  test('filters launches by success status', () => {
    const initialState = {
      filters: {
        searchQuery: '',
        launchYear: '',
        showSuccessfulOnly: true,
        showFavoritesOnly: false,
      },
    };

    renderWithStore(<LaunchList onLaunchClick={mockOnLaunchClick} />, initialState);
    
    // Should only show successful launches (2 out of 3)
    expect(screen.getByText('2 missions found')).toBeInTheDocument();
    expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument();
    expect(screen.getByText('Crew Dragon Demo-2')).toBeInTheDocument();
    expect(screen.queryByText('Starship SN15')).not.toBeInTheDocument();
  });

  test('filters launches by search query', () => {
    const initialState = {
      filters: {
        searchQuery: 'dragon',
        launchYear: '',
        showSuccessfulOnly: false,
        showFavoritesOnly: false,
      },
    };

    renderWithStore(<LaunchList onLaunchClick={mockOnLaunchClick} />, initialState);
    
    // Should only show launches matching "dragon"
    expect(screen.getByText('1 mission found')).toBeInTheDocument();
    expect(screen.getByText('Crew Dragon Demo-2')).toBeInTheDocument();
    expect(screen.queryByText('Falcon Heavy Test Flight')).not.toBeInTheDocument();
    expect(screen.queryByText('Starship SN15')).not.toBeInTheDocument();
  });

  test('shows favorites only when filter is active', () => {
    const initialState = {
      filters: {
        searchQuery: '',
        launchYear: '',
        showSuccessfulOnly: false,
        showFavoritesOnly: true,
      },
      favorites: {
        favoriteIds: ['1', '3'], // Falcon Heavy and Crew Dragon are favorites
      },
    };

    renderWithStore(<LaunchList onLaunchClick={mockOnLaunchClick} />, initialState);
    
    // Should show "Favorite Missions" title and only favorited launches
    expect(screen.getByText('Favorite Missions')).toBeInTheDocument();
    expect(screen.getByText('2 missions found')).toBeInTheDocument();
    expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument();
    expect(screen.getByText('Crew Dragon Demo-2')).toBeInTheDocument();
    expect(screen.queryByText('Starship SN15')).not.toBeInTheDocument();
  });

  test('handles launch card click correctly', () => {
    renderWithStore(<LaunchList onLaunchClick={mockOnLaunchClick} />);
    
    // Click on a launch card
    const launchCard = screen.getByText('Falcon Heavy Test Flight').closest('.card');
    fireEvent.click(launchCard);
    
    // Check if onLaunchClick was called with the correct launch data
    expect(mockOnLaunchClick).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        name: 'Falcon Heavy Test Flight',
      })
    );
  });

  test('shows loading state correctly', () => {
    const initialState = {
      launches: {
        launches: [],
        selectedLaunch: null,
        loading: true,
        error: null,
        lastUpdated: null,
      },
    };

    renderWithStore(<LaunchList onLaunchClick={mockOnLaunchClick} />, initialState);
    
    // Should show loading skeletons
    expect(document.querySelector('.launch-list-skeleton')).toBeInTheDocument();
  });

  test('shows error state correctly', () => {
    const initialState = {
      launches: {
        launches: [],
        selectedLaunch: null,
        loading: false,
        error: 'Failed to fetch launches',
        lastUpdated: null,
      },
    };

    renderWithStore(<LaunchList onLaunchClick={mockOnLaunchClick} />, initialState);
    
    // Should show error message
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch launches')).toBeInTheDocument();
  });

  test('shows empty state when no launches match filters', () => {
    const initialState = {
      filters: {
        searchQuery: 'nonexistent',
        launchYear: '',
        showSuccessfulOnly: false,
        showFavoritesOnly: false,
      },
    };

    renderWithStore(<LaunchList onLaunchClick={mockOnLaunchClick} />, initialState);
    
    // Should show empty state message
    expect(screen.getByText('No matches found')).toBeInTheDocument();
  });
});