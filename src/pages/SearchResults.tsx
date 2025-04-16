
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VehicleSelection from '@/components/VehicleSelection';

const SearchResults = () => {
  const location = useLocation();
  const searchParams = location.state;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container-custom py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Search Results</h2>
          <p className="text-muted-foreground">
            From: {searchParams?.from || 'N/A'} - To: {searchParams?.to || 'N/A'}
          </p>
        </div>
        <VehicleSelection />
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;
