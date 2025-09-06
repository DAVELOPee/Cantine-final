
import React, { useState } from 'react';
import type { Cantina } from '../types';

interface CantinaDetailProps {
  cantina: Cantina;
  onBack: () => void;
}

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-brand-secondary" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" />
    </svg>
);

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);


const CantinaDetail: React.FC<CantinaDetailProps> = ({ cantina, onBack }) => {
  const [geolocationMessage, setGeolocationMessage] = useState<{ type: 'error' | 'info' | 'success'; text: string } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetDirections = () => {
    setGeolocationMessage(null);
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      setGeolocationMessage({ type: 'error', text: "La geolocalizzazione non è supportata da questo browser." });
      setIsGettingLocation(false);
      setTimeout(() => setGeolocationMessage(null), 5000);
      return;
    }
    
    setGeolocationMessage({ type: 'info', text: 'Sto cercando la tua posizione...' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGeolocationMessage({ type: 'success', text: 'Posizione trovata! Apro Google Maps...' });
        
        const destinationCoords = cantina.coordinates;
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destinationCoords}&travelmode=walking`;
        
        window.open(mapsUrl, '_blank', 'noopener,noreferrer');
        
        setIsGettingLocation(false);
        setTimeout(() => setGeolocationMessage(null), 3000);
      }, 
      (error) => {
        let message: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Hai negato il permesso per la geolocalizzazione. Abilitalo nelle impostazioni del browser per usare questa funzione.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Informazioni sulla posizione non disponibili. Riprova.";
            break;
          case error.TIMEOUT:
            message = "La richiesta per ottenere la posizione è scaduta. Riprova.";
            break;
          default:
            message = "Impossibile ottenere la posizione. Riprova.";
            break;
        }
        setGeolocationMessage({ type: 'error', text: message });
        setIsGettingLocation(false);
        setTimeout(() => setGeolocationMessage(null), 7000);
      }, 
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-secondary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-transform transform active:scale-95"
      >
        <BackIcon/>
        Tutte le Cantine
      </button>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden md:grid md:grid-cols-5">
        <div className="md:col-span-2">
            <img src={cantina.imageUrl} alt={cantina.name} className="w-full h-64 md:h-full object-cover" />
        </div>
        <div className="md:col-span-3 p-4 md:p-6 flex flex-col">
          <div className="flex-grow">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-brand-primary mb-1">{cantina.name}</h2>
            <p className="text-md text-brand-light-text font-semibold mb-3">{cantina.locationName}</p>
            
            <p className="text-brand-text leading-relaxed mb-4 text-sm md:text-base">
              {cantina.description}
            </p>
          </div>

          <div className="mt-auto pt-2">
            <div className="flex items-center text-brand-text font-medium mb-4 p-2 bg-amber-50 rounded-md text-sm">
              <ClockIcon/>
              <p>Orario: {cantina.hours}</p>
            </div>
            
            <button
              onClick={handleGetDirections}
              disabled={isGettingLocation}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-secondary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-transform transform hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              <MapPinIcon/>
              {isGettingLocation ? 'Ricerca...' : 'Vai a piedi'}
            </button>
            {geolocationMessage && (
              <div className={`mt-3 text-center p-2 px-3 text-xs rounded-md transition-all duration-300 ${
                  geolocationMessage.type === 'error' ? 'bg-red-100 text-red-800' : 
                  geolocationMessage.type === 'success' ? 'bg-green-100 text-green-800' : 
                  'bg-blue-100 text-blue-800'
              }`}>
                  {geolocationMessage.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CantinaDetail;