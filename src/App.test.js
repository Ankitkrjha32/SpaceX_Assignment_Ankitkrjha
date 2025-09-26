import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import * as spacexAPI from './services/spacexAPI';

// Mock the spacexAPI
jest.mock('./services/spacexAPI');

const mockLaunches = [
  {
    id: '1',
    name: 'Test Launch 1',
    date_utc: '2023-01-01T12:00:00.000Z',
    success: true,
    upcoming: false,
    rocket: { name: 'Falcon 9' },
    details: 'Test launch details',
  },
];

describe('App Integration Tests', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock successful API response
    spacexAPI.spacexAPI.getLaunches.mockResolvedValue(mockLaunches);
  });

  test('renders SpaceX Mission Explorer title', async () => {
    render(<App />);
    
    expect(screen.getByText(/SpaceX Mission Explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore SpaceX launches, rockets, and missions/i)).toBeInTheDocument();
  });

  test('loads and displays launches on app start', async () => {
    render(<App />);
    
    // Wait for launches to load
    await waitFor(() => {
      expect(screen.getByText('Test Launch 1')).toBeInTheDocument();
    });

    // Verify API was called
    expect(spacexAPI.spacexAPI.getLaunches).toHaveBeenCalledTimes(1);
  });

  test('shows loading state initially', () => {
    render(<App />);
    
    // Should show loading skeletons initially
    expect(document.querySelector('.launch-list-skeleton')).toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    // Mock API error
    spacexAPI.spacexAPI.getLaunches.mockRejectedValue(new Error('API Error'));
    
    render(<App />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });
  });

  test('renders search and filter components', async () => {
    render(<App />);
    
    // Wait for app to load
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search missions/i)).toBeInTheDocument();
    });

    // Check for filter elements
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/successful only/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/favorites only/i)).toBeInTheDocument();
  });
});
