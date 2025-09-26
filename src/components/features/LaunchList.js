import React from 'react';
import { useSelector } from 'react-redux';
import LaunchCard from '../ui/LaunchCard';
import LoadingSkeleton from '../ui/LoadingSkeleton';

const LaunchList = ({ onLaunchClick }) => {
  const { launches, loading, error } = useSelector(state => state.launches);
  const { searchQuery, launchYear, showSuccessfulOnly, showFavoritesOnly } = useSelector(state => state.filters);
  const favoriteIds = useSelector(state => state.favorites.favoriteIds);

  console.log('LaunchList: launches:', launches, 'loading:', loading, 'error:', error);

  // Filter launches based on current filters
  const filteredLaunches = launches.filter(launch => {
    // Search filter
    if (searchQuery && !launch.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Year filter
    if (launchYear && new Date(launch.date_utc).getFullYear().toString() !== launchYear) {
      return false;
    }
    
    // Success filter
    if (showSuccessfulOnly && !launch.success) {
      return false;
    }
    
    // Favorites filter
    if (showFavoritesOnly && !favoriteIds.includes(launch.id)) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-spacex-800">Loading Missions...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spacex-400"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-800 mb-2">Houston, we have a problem!</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!filteredLaunches || filteredLaunches.length === 0) {
    return (
      <div className="bg-cream-50 border border-cream-200 rounded-2xl p-12 text-center">
        <div className="text-cream-600 text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-spacex-800 mb-2">No missions found</h2>
        <p className="text-cream-700">
          Try adjusting your search criteria or filters to find SpaceX missions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-spacex-800">
          SpaceX Missions 
          <span className="text-spacex-500 ml-2">({filteredLaunches.length})</span>
        </h2>
        
        <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Successful</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Failed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Unknown</span>
          </div>
        </div>
      </div>

      {/* Launch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLaunches.map((launch) => (
          <LaunchCard
            key={launch.id}
            launch={launch}
            onClick={() => onLaunchClick(launch)}
          />
        ))}
      </div>

      {/* Load More Button (for future pagination) */}
      {filteredLaunches.length > 0 && (
        <div className="text-center pt-8">
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <span>Showing {filteredLaunches.length} missions</span>
            <div className="w-2 h-2 bg-spacex-blue rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaunchList;