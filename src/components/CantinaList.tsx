
import React from 'react';
import CantinaCard from './CantinaCard';
import type { Cantina } from '../types';

interface CantinaListProps {
  cantine: Cantina[];
  onSelectCantina: (cantina: Cantina) => void;
}

const CantinaList: React.FC<CantinaListProps> = ({ cantine, onSelectCantina }) => {
  return (
    <>
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold text-brand-primary mb-2">Scopri le Cantine</h2>
        <p className="text-brand-light-text">Clicca su una cantina per vedere i dettagli.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {cantine.map((cantina) => (
          <CantinaCard 
            key={cantina.id} 
            cantina={cantina} 
            onSelect={onSelectCantina}
          />
        ))}
      </div>
    </>
  );
};

export default CantinaList;