import React, { useState, useCallback } from 'react';

// Debounce hook for search input
const useDebounce = (callback, delay) => {
  const [debounceTimer, setDebounceTimer] = useState(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      const newTimer = setTimeout(() => {
        callback(...args);
      }, delay);
      
      setDebounceTimer(newTimer);
    },
    [callback, delay, debounceTimer]
  );

  return debouncedCallback;
};

const SearchInput = ({ 
  value = '',
  onChange,
  placeholder = 'Search missions...', 
  className = '',
  debounceMs = 300,
  ...props 
}) => {
  // Debounced search function
  const debouncedSearch = useDebounce((query) => {
    onChange(query);
  }, debounceMs);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`relative max-w-md ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        {/* Input Field */}
        <input
          type="text"
          className="w-full pl-10 pr-10 py-3 border border-cream-300 rounded-xl bg-white text-spacex-800 placeholder-cream-600 focus:ring-2 focus:ring-spacex-300 focus:border-spacex-400 transition-all duration-200 shadow-sm"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          {...props}
        />
        
        {/* Clear Button */}
        {value && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;