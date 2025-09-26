import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchLaunches } from '../store/slices/launchesSlice';
import Header from '../components/layout/Header';
import SearchAndFilters from '../components/features/SearchAndFilters';
import LaunchList from '../components/features/LaunchList';
import LaunchDetailModal from '../components/features/LaunchDetailModal';

const HomePage = () => {
  const dispatch = useDispatch();
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log('HomePage: Dispatching fetchLaunches');
    dispatch(fetchLaunches());
  }, [dispatch]);

  const handleLaunchClick = (launch) => {
    setSelectedLaunch(launch);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLaunch(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchAndFilters />
        <LaunchList onLaunchClick={handleLaunchClick} />
      </main>

      {isModalOpen && selectedLaunch && (
        <LaunchDetailModal
          launch={selectedLaunch}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default HomePage;