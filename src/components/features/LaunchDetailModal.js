import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../../store/slices/favoritesSlice';

const LaunchDetailModal = ({ launch, onClose }) => {
  const dispatch = useDispatch();
  const favoriteIds = useSelector(state => state.favorites.favoriteIds);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Handle escape key to close modal
  useEffect(() => {
    if (!launch) return; // Don't set up listeners if no launch
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [launch, onClose]);

  // Return null if no launch data
  if (!launch) {
    return null;
  }
  
  const isFavorite = favoriteIds.includes(launch.id);

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(launch.id));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (success) => {
    if (success === null) return 'text-gray-600';
    return success ? 'text-yellow-800 ' : 'text-red-800';
  };

  const getStatusIcon = (success) => {
    if (success === null) return '❓';
    return success ? '' : '';
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white border-2 border-cream-300 rounded-3xl max-w-4xl w-full max-h-[75vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-cream-300 p-6 rounded-t-3xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{launch.name}</h2>
              <div className="flex items-center space-x-4 text-sm">
                <span className={`flex items-center space-x-1 ${getStatusColor(launch.success)}`}>
                  <span>{getStatusIcon(launch.success)}</span>
                  <span>{launch.success === null ? 'Status Unknown' : launch.success ? 'Successful' : 'Failed'}</span>
                </span>
                <span className="text-gray-600">
                  Flight #{launch.flight_number}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleToggleFavorite}
                className={`p-3 rounded-full transition-all duration-200 ${
                  isFavorite 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-cream-100 hover:bg-red-100 text-gray-600 hover:text-red-500 border border-cream-300'
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
              
              <button
                onClick={onClose}
                className="p-3 bg-cream-100 hover:bg-cream-200 text-gray-600 hover:text-gray-800 rounded-full transition-colors border border-cream-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto scrollbar-hide" style={{ height: 'calc(75vh - 120px)' }}>
          <div className="p-6 space-y-4">
          {/* Mission Image */}
          {launch.links?.patch?.large && (
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={launch.links.patch.large}
                  alt={launch.name}
                  className={`w-24 h-24 object-contain transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-cream-200 rounded-lg animate-pulse"></div>
                )}
              </div>
            </div>
          )}

          {/* Mission Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-spacex-600 mb-3">Launch Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900">{formatDate(launch.date_utc)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flight Number:</span>
                    <span className="text-gray-900">#{launch.flight_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rocket:</span>
                    <span className="text-gray-900">{launch.rocket?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Launchpad:</span>
                    <span className="text-gray-900">{launch.launchpad?.name || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              {/* Links */}
              {(launch.links?.webcast || launch.links?.wikipedia || launch.links?.article) && (
                <div>
                  <h3 className="text-lg font-semibold text-spacex-600 mb-3">Links</h3>
                  <div className="space-y-2">
                    {launch.links?.webcast && (
                      <a
                        href={launch.links.webcast}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span>Watch Launch</span>
                      </a>
                    )}
                    {launch.links?.wikipedia && (
                      <a
                        href={launch.links.wikipedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-spacex-600 hover:text-spacex-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.624 5.367 11.99 11.988 11.99s11.99-5.366 11.99-11.99C24.007 5.367 18.641.001 12.017.001zM9.68 17.696c-.045-.085-.005-.183.078-.25.492-.403 1.206-.882 1.746-1.308.54-.426 1.477-.968 1.477-.968.084-.053.19-.026.238.058.052.084.016.19-.08.242 0 0-.937.542-1.477.968-.54.426-1.254.905-1.746 1.308-.083.067-.123.165-.078.25-.045.085-.112.139-.196.139a.223.223 0 0 1-.2-.14c-.046-.084-.006-.182.076-.248.485-.403 1.199-.882 1.739-1.308.54-.426 1.47-.968 1.47-.968.084-.053.19-.026.237.058.053.084.017.19-.079.242 0 0-.93.542-1.47.968-.54.426-1.254.905-1.739 1.308a.223.223 0 0 1-.313-.11zm5.131-6.832c-1.06-.146-2.278.214-2.955.766-.677.552-.916 1.326-.887 2.03.028.704.338 1.38.887 2.03.549.65 1.457 1.128 2.955 1.274 1.498.146 2.726-.21 3.25-.89.524-.68.464-1.598-.13-2.527-.594-.93-1.662-1.537-3.12-1.683zm-.494 5.14c-.93-.102-1.68-.424-2.072-.893-.392-.469-.35-1.004-.005-1.473.345-.469 1.095-.791 2.072-.893.977-.102 1.826.066 2.218.373.392.307.342.772-.113 1.286-.455.514-1.323.802-2.1.6z"/>
                        </svg>
                        <span>Wikipedia</span>
                      </a>
                    )}
                    {launch.links?.article && (
                      <a
                        href={launch.links.article}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                        <span>Article</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Payloads */}
              {launch.payloads && launch.payloads.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-spacex-blue mb-3">Payloads</h3>
                  <div className="space-y-3">
                    {launch.payloads.map((payload, index) => (
                      <div key={index} className="bg-cream-100 rounded-lg p-3 border border-cream-200">
                        <div className="font-medium text-gray-900">{payload.name}</div>
                        <div className="text-sm text-gray-600">{payload.type}</div>
                        {payload.mass_kg && (
                          <div className="text-sm text-gray-600">
                            Mass: {payload.mass_kg} kg
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cores */}
              {launch.cores && launch.cores.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-spacex-blue mb-3">Boosters</h3>
                  <div className="space-y-3">
                    {launch.cores.map((core, index) => (
                      <div key={index} className="bg-cream-100 rounded-lg p-3 border border-cream-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900">Core #{index + 1}</span>
                          <span className={`text-sm px-2 py-1 rounded ${
                            core.landing_success === null 
                              ? 'bg-gray-200 text-gray-700'
                              : core.landing_success 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-red-200 text-red-800'
                          }`}>
                            {core.landing_success === null ? 'No Landing' : core.landing_success ? 'Landed' : 'Lost'}
                          </span>
                        </div>
                        {core.flight && (
                          <div className="text-sm text-gray-600">
                            Flight #{core.flight}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mission Description */}
          {launch.details && (
            <div>
              <h3 className="text-lg font-semibold text-spacex-blue mb-3">Mission Details</h3>
              <div className="bg-cream-100 rounded-lg p-4 border border-cream-200">
                <p className="text-gray-700 leading-relaxed">{launch.details}</p>
              </div>
            </div>
          )}

          {/* Flickr Images */}
          {launch.links?.flickr?.original && launch.links.flickr.original.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-spacex-blue mb-3">Mission Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {launch.links.flickr.original.slice(0, 6).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${launch.name} mission ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => window.open(image, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchDetailModal;