import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="bg-white border border-cream-200 rounded-2xl p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 bg-cream-200 rounded-lg"></div>
        <div className="w-10 h-10 bg-cream-200 rounded-full"></div>
      </div>

      {/* Title skeleton */}
      <div className="space-y-3">
        <div className="h-6 bg-cream-200 rounded w-3/4"></div>
        
        {/* Details skeleton */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-cream-200 rounded"></div>
            <div className="h-4 bg-cream-200 rounded w-24"></div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-cream-200 rounded"></div>
            <div className="h-4 bg-cream-200 rounded w-20"></div>
          </div>
          
          <div className="h-6 bg-cream-200 rounded-full w-24"></div>
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2 pt-2">
          <div className="h-4 bg-cream-200 rounded w-full"></div>
          <div className="h-4 bg-cream-200 rounded w-5/6"></div>
          <div className="h-4 bg-cream-200 rounded w-2/3"></div>
        </div>

        {/* Footer skeleton */}
        <div className="pt-2 border-t border-cream-200 flex justify-between items-center">
          <div className="h-3 bg-cream-200 rounded w-24"></div>
          <div className="w-4 h-4 bg-cream-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;