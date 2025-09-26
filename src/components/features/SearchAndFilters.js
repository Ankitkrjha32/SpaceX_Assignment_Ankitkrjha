import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setLaunchYear, setSuccessFilter, toggleFavoritesOnly } from '../../store/slices/filtersSlice';
import SearchInput from '../ui/SearchInput';

const SearchAndFilters = () => {
  const dispatch = useDispatch();
  const { searchQuery, launchYear, showSuccessfulOnly, showFavoritesOnly } = useSelector(state => state.filters);

  const handleYearChange = (e) => {
    dispatch(setLaunchYear(e.target.value));
  };

  const handleSuccessChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      dispatch(setSuccessFilter(false));
    } else {
      dispatch(setSuccessFilter(value === 'true'));
    }
  };

  const handleSearchChange = (value) => {
    dispatch(setSearchQuery(value));
  };

  const handleFavoritesToggle = () => {
    dispatch(toggleFavoritesOnly());
  };

  const clearFilters = () => {
    dispatch(setSearchQuery(''));
    dispatch(setLaunchYear(''));
    dispatch(setSuccessFilter(false));
    if (showFavoritesOnly) {
      dispatch(toggleFavoritesOnly());
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-cream-200 rounded-2xl p-6 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
        {/* Search */}
        <div className="flex-1 w-full lg:w-auto">
          <label className="block text-sm font-medium mb-2">
            Search Missions
          </label>
          <SearchInput 
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by mission name..."
          />
        </div>

        {/* Year Filter */}
        <div className="w-full lg:w-48">
          <label className="block text-sm font-medium text-spacex-700 mb-2">
            Launch Year
          </label>
          <select
            value={launchYear}
            onChange={handleYearChange}
            className="w-full bg-white border border-cream-300 text-spacex-800 rounded-lg px-4 py-3 focus:outline-none focus:border-spacex-400 focus:ring-1 focus:ring-spacex-400 transition-colors"
          >
            <option value="">All Years</option>
            {Array.from({ length: new Date().getFullYear() - 2005 }, (_, i) => 2006 + i)
              .reverse()
              .map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
          </select>
        </div>

        {/* Success Filter */}
        <div className="w-full lg:w-48">
          <label className="block text-sm font-medium text-spacex-700 mb-2">
            Mission Status
          </label>
          <select
            value={showSuccessfulOnly ? 'true' : ''}
            onChange={handleSuccessChange}
            className="w-full bg-white border border-cream-300 text-spacex-800 rounded-lg px-4 py-3 focus:outline-none focus:border-spacex-400 focus:ring-1 focus:ring-spacex-400 transition-colors"
          >
            <option value="">All Missions</option>
            <option value="true">Successful</option>
            <option value="false">Failed</option>
          </select>
        </div>

        {/* Favorites Filter */}
        <div className="w-full lg:w-auto">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={handleFavoritesToggle}
              className="sr-only"
            />
            <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              showFavoritesOnly ? 'bg-red-500' : 'bg-cream-300'
            }`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                showFavoritesOnly ? 'translate-x-6' : 'translate-x-0'
              }`}>
                <svg className={`w-3 h-3 absolute top-1 left-1 transition-colors ${
                  showFavoritesOnly ? 'text-red-500' : 'text-cream-400'
                }`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
            <span className="ml-3 text-sm font-medium text-spacex-700">
              Favorites Only
            </span>
          </label>
        </div>

        {/* Clear Filters */}
        <div className="w-full lg:w-auto">
          <button
            onClick={clearFilters}
            className="w-full lg:w-auto bg-cream-100 hover:bg-cream-200 text-spacex-700 hover:text-spacex-800 border border-cream-300 hover:border-cream-400 px-6 py-3 rounded-lg transition-all duration-200 font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || launchYear || showSuccessfulOnly || showFavoritesOnly) && (
        <div className="mt-4 pt-4 border-t border-cream-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchQuery && (
              <span className="bg-spacex-blue/20 text-spacex-blue px-3 py-1 rounded-full text-sm border border-spacex-blue/30">
                Search: "{searchQuery}"
              </span>
            )}
            {launchYear && (
              <span className="bg-spacex-blue/20 text-spacex-blue px-3 py-1 rounded-full text-sm border border-spacex-blue/30">
                Year: {launchYear}
              </span>
            )}
            {showSuccessfulOnly && (
              <span className="bg-spacex-blue/20 text-spacex-blue px-3 py-1 rounded-full text-sm border border-spacex-blue/30">
                Status: Successful Only
              </span>
            )}
            {showFavoritesOnly && (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm border border-red-200">
                ❤️ Favorites Only
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;