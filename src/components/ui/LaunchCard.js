import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../store/slices/favoritesSlice';

const LaunchCard = ({ launch, onClick }) => {
  const dispatch = useDispatch();
  const favoriteIds = useSelector(state => state.favorites.favoriteIds);
  const [imageError, setImageError] = useState(false);
  
  const isFavorite = favoriteIds.includes(launch.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    dispatch(toggleFavorite(launch.id));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (success) => {
    if (success === null) return 'text-gray-600 bg-gray-200';
    return success ? 'text-green-800 bg-green-200' : 'text-red-800 bg-red-200';
  };

  const getStatusIcon = (success) => {
    return ''; // Removed icons as requested
  };

  return (
    <div 
      className="bg-white border-2 border-cream-300 rounded-2xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-spacex-400 hover:shadow-spacex-200/30 group"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        {!imageError && launch.links?.patch?.small ? (
          <div className="relative">
            <img
              src={launch.links.patch.small}
              alt={launch.name}
              onError={() => setImageError(true)}
              className="w-16 h-16 object-contain rounded-lg bg-cream-100 p-2 group-hover:animate-rocket-float"
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-cream-100 border border-cream-300 rounded-lg flex items-center justify-center text-2xl group-hover:animate-rocket-float">
            🚀
          </div>
        )}
        
        <button
          className={`p-2 rounded-full transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white scale-110' 
              : 'bg-cream-100 text-cream-600 hover:bg-red-100 hover:text-red-500 hover:scale-110'
          }`}
          onClick={handleFavoriteClick}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-spacex-700 transition-colors line-clamp-2">
          {launch.name}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-2">📅</span>
            <span>{formatDate(launch.date_utc)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            <span className="mr-2"></span>
            <span>Flight #{launch.flight_number}</span>
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(launch.success)}`}>
            <span>
              {launch.success === null ? 'Status Unknown' : launch.success ? 'Successful' : 'Failed'}
            </span>
          </div>
        </div>
        
        {launch.details && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {launch.details.length > 120 
              ? `${launch.details.substring(0, 120)}...`
              : launch.details
            }
          </p>
        )}

        {/* Bottom gradient overlay for "Read more" effect */}
        <div className="pt-2 border-t border-cream-300">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Click for details</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchCard;