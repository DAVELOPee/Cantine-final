import React, { useState, useEffect } from 'react';
import CantinaList from './CantinaList';
import CantinaDetail from './CantinaDetail';
import type { Cantina } from '../types';
import { CANTINE_DATA } from '../constants';

const CantinePage: React.FC = () => {
  const [selectedCantina, setSelectedCantina] = useState<Cantina | null>(null);

  useEffect(() => {
    // Scroll to top when the view changes
    window.scrollTo(0, 0);
  }, [selectedCantina]);

  const handleSelectCantina = (cantina: Cantina) => {
    setSelectedCantina(cantina);
  };

  const handleCloseDetail = () => {
    setSelectedCantina(null);
  };

  return (
    <>
      {selectedCantina ? (
        <CantinaDetail 
          cantina={selectedCantina} 
          onBack={handleCloseDetail} 
        />
      ) : (
        <CantinaList 
          cantine={CANTINE_DATA} 
          onSelectCantina={handleSelectCantina} 
        />
      )}
    </>
  );
};

export default CantinePage;