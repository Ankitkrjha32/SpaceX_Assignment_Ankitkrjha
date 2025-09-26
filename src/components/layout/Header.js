import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-lg border-b border-cream-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-spacex-300 to-spacex-400 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-spacex-400 to-spacex-600 bg-clip-text text-transparent">
                SpaceX Mission Explorer
              </h1>
              <p className="text-cream-700 text-sm">Explore SpaceX launches and missions</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="bg-cream-100 border border-cream-300 rounded-lg px-4 py-2">
              <span className="text-spacex-600 font-medium">Next Launch:</span>
              <span className="ml-2 text-spacex-800">Starship IFT-4</span>
            </div>
          </div>
        </div>
        
        {/* Animated rocket */}
        <div className="absolute top-4 right-4 text-spacex-400 animate-rocket-float">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9l-5.91 1.74L12 17l-4.09-6.26L2 9l6.91-0.74L12 2z"/>
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;