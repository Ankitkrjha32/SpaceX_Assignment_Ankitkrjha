import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LaunchDetailModal from '../components/launches/LaunchDetailModal';
import favoritesReducer from '../store/slices/favoritesSlice';

// Mock launch data for testing
const mockLaunch = {
  id: 'test-launch-1',
  name: 'Falcon Heavy Test Flight',
  date_utc: '2018-02-06T20:45:00.000Z',
  success: true,
  upcoming: false,
  flight_number: 1,
  launchpad: 'KSC LC-39A',
  rocket: {
    name: 'Falcon Heavy',
    type: 'Heavy Lift Vehicle'
  },
  details: 'The Falcon Heavy test flight was the first attempt by SpaceX to launch their most powerful rocket. The test was a resounding success, with all three cores performing nominally.',
  links: {
    patch: {
      small: 'https://example.com/patch-small.png',
      large: 'https://example.com/patch-large.png'
    },
    webcast: 'https://youtube.com/watch-test',
    wikipedia: 'https://wikipedia.org/test-launch',
    article: 'https://spacenews.com/test-article'
  }
};

// Helper function to create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      favorites: favoritesReducer,
    },
    preloadedState: {
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

describe('LaunchDetailModal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test('renders launch details correctly when open', () => {
    renderWithStore(
      <LaunchDetailModal 
        isOpen={true} 
        onClose={mockOnClose} 
        launch={mockLaunch} 
      />
    );
    
    // Check if basic launch information is displayed
    expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument();
    expect(screen.getByText(/February 6, 2018/)).toBeInTheDocument();
    expect(screen.getByText(/Rocket:.*Falcon Heavy/)).toBeInTheDocument();
    expect(screen.getByText(/Flight Number:.*1/)).toBeInTheDocument();
    expect(screen.getByText(/Launchpad:.*KSC LC-39A/)).toBeInTheDocument();
  });

  test('displays mission details section when details are available', () => {
    renderWithStore(
      <LaunchDetailModal 
        isOpen={true} 
        onClose={mockOnClose} 
        launch={mockLaunch} 
      />
    );
    
    expect(screen.getByText('Mission Details')).toBeInTheDocument();
    expect(screen.getByText(mockLaunch.details)).toBeInTheDocument();
  });

  test('displays links section with all available links', () => {
    renderWithStore(
      <LaunchDetailModal 
        isOpen={true} 
        onClose={mockOnClose} 
        launch={mockLaunch} 
      />
    );
    
    expect(screen.getByText('Links & Resources')).toBeInTheDocument();
    
    // Check if all link types are present
    const webcastLink = screen.getByRole('link', { name: /watch webcast/i });
    expect(webcastLink).toHaveAttribute('href', mockLaunch.links.webcast);
    expect(webcastLink).toHaveAttribute('target', '_blank');
    
    const wikipediaLink = screen.getByRole('link', { name: /wikipedia/i });
    expect(wikipediaLink).toHaveAttribute('href', mockLaunch.links.wikipedia);
    
    const articleLink = screen.getByRole('link', { name: /read article/i });
    expect(articleLink).toHaveAttribute('href', mockLaunch.links.article);
  });

  test('shows success badge for successful launch', () => {
    renderWithStore(
      <LaunchDetailModal 
        isOpen={true} 
        onClose={mockOnClose} 
        launch={mockLaunch} 
      />
    );
    
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  test('shows failed badge for failed launch', () => {
    const failedLaunch = { ...mockLaunch, success: false };
    
    renderWithStore(
      <LaunchDetailModal 
        isOpen={true} 
        onClose={mockOnClose} 
        launch={failedLaunch} 
      />
    );
    
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  test('shows TBD badge for launch with undefined success status', () => {
    const tbdLaunch = { ...mockLaunch, success: null };
    
    renderWithStore(
      <LaunchDetailModal 
        isOpen={true} 
        onClose={mockOnClose} 
        launch={tbdLaunch} 
      />
    );
    
    expect(screen.getByText('TBD')).toBeInTheDocument();
  });

  test('shows upcoming badge for upcoming launches', () => {
    const upcomingLaunch = { ...mockLaunch, upcoming: true };
    
    renderWithStore(
      <LaunchDetailModal 
        isOpen={true} 
        onClose={mockOnClose} 
        launch={upcomingLaunch} 
      />
    );
    
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  test('handles favorite toggle correctly', () => {
    const { store } = renderWithStore(
      <LaunchDetailModal 
        isOpen={true} 
        onClose={mockOnClose} 
        launch={mockLaunch} 
      />
    );
    
    // Initially not favorited
    expect(screen.queryByText('★ Favorite')).not.toBeInTheDocument();
    
    // Click favorite button
    const favoriteButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(favoriteButton);
    
    // Check if launch is now favorited in store
    const state = store.getState();
    expect(state.favorites.favoriteIds).toContain(mockLaunch.id);
  });

  test('shows favorite badge when launch is already favorited', () => {
    const initialState = {
      favorites: {
        favoriteIds: [mockLaunch.id],
      },
    };
    
    renderWithStore(
      <LaunchDetailModal 
        isOpen={true} 
        onClose={mockOnClose} 
        launch={mockLaunch} 
      />,
      initialState
    );
    
    expect(screen.getByText('★ Favorite')).toBeInTheDocument();
    expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument();
  });

  test('closes modal when close button is clicked', () => {
    renderWithStore(
      <LaunchDetailModal 
        isOpen={true} 
        onClose={mockOnClose} 
        launch={mockLaunch} 
      />
    );
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('handles missing mission patch gracefully', () => {
    const launchWithoutPatch = {
      ...mockLaunch,
      links: {
        ...mockLaunch.links,
        patch: null
      }
    };
    
    renderWithStore(
      <LaunchDetailModal 
        isOpen={true} 
        onClose={mockOnClose} 
        launch={launchWithoutPatch} 
      />
    );
    
    // Should still render without crashing
    expect(screen.getByText('Falcon Heavy Test Flight')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    renderWithStore(
      <LaunchDetailModal 
        isOpen={false} 
        onClose={mockOnClose} 
        launch={mockLaunch} 
      />
    );
    
    expect(screen.queryByText('Falcon Heavy Test Flight')).not.toBeInTheDocument();
  });

  test('handles null launch prop gracefully', () => {
    renderWithStore(
      <LaunchDetailModal 
        isOpen={true} 
        onClose={mockOnClose} 
        launch={null} 
      />
    );
    
    // Should not crash, but also should not render anything
    expect(screen.queryByText('Mission Details')).not.toBeInTheDocument();
  });

  test('displays rocket information section when available', () => {
    renderWithStore(
      <LaunchDetailModal 
        isOpen={true} 
        onClose={mockOnClose} 
        launch={mockLaunch} 
      />
    );
    
    expect(screen.getByText('Rocket Information')).toBeInTheDocument();
    expect(screen.getByText(/Name:.*Falcon Heavy/)).toBeInTheDocument();
    expect(screen.getByText(/Type:.*Heavy Lift Vehicle/)).toBeInTheDocument();
  });
});