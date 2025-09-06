import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, OverlayViewF } from '@react-google-maps/api';
import { CANTINE_DATA, ENTRY_POINTS } from '../constants';
import type { Cantina } from '../types';

interface EntryPoint {
    id: string;
    name: string;
    coordinates: string;
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const IS_API_KEY_MISSING = !API_KEY || API_KEY === "INSERISCI_LA_TUA_CHIAVE_API_QUI";


const ApiKeyInstructions: React.FC = () => (
    <div className="text-center p-4 md:p-8 bg-white rounded-lg shadow-lg animate-fade-in text-brand-text">
        <h3 className="text-2xl font-bold text-red-600 mb-4">⚠️ Configurazione Mappa Richiesta</h3>
        <p className="mb-4">
            Per visualizzare la mappa, è necessaria una chiave API di Google Maps.
        </p>
        <div className="text-left bg-amber-50 p-4 rounded-md border border-amber-200">
            <p className="font-bold mb-2">Segui questi semplici passaggi:</p>
            <ol className="list-decimal list-inside space-y-2">
                <li>
                    Nella cartella principale del progetto, trova o crea un file chiamato <code className="bg-amber-200 p-1 rounded font-mono text-sm">.env</code>.
                </li>
                <li>
                    Apri il file <code className="bg-amber-200 p-1 rounded font-mono text-sm">.env</code> e aggiungi la seguente riga, sostituendo <code className="bg-amber-200 p-1 rounded font-mono text-sm">LA_TUA_CHIAVE_API</code> con la tua chiave API di Google Maps:
                </li>
                <pre className="bg-gray-800 text-white p-2 rounded-md my-2 text-sm">
                    <code>VITE_GOOGLE_MAPS_API_KEY="LA_TUA_CHIAVE_API"</code>
                </pre>
                <li>
                    Salva il file e ricarica l'applicazione.
                </li>
            </ol>
        </div>
    </div>
);


const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 42.3658,
  lng: 10.9005,
};

const mapOptions = {
    mapId: 'b7075aa5ee498286',
    mapTypeId: 'satellite',
    center: center,
    zoom: 2,
    tilt: 0,
    gestureHandling: 'none', // Disable interaction during animation
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
};

// Define libraries array outside the component to prevent re-renders from recreating it.
const libraries: ('marker')[] = ['marker'];

const getPixelPositionOffset = (width: number, height: number) => ({
    x: -(width / 2),
    y: -(height + 45), // Position it above the marker's anchor
});

const Spinner = () => (
    <div className="flex justify-center items-center w-full h-[calc(100vh-220px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-primary"></div>
    </div>
);

const MapPage: React.FC = () => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY || "",
        libraries,
        preventGoogleFontsLoading: true,
    });

    const [map, setMap] = useState<any | null>(null);
    const [userPosition, setUserPosition] = useState<{ lat: number; lng: number; } | null>(null);
    const [activeCantina, setActiveCantina] = useState<Cantina | null>(null);
    const [activeEntryPoint, setActiveEntryPoint] = useState<EntryPoint | null>(null);
    const [geolocationMessage, setGeolocationMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
    const [animationComplete, setAnimationComplete] = useState(false);

    const mapContainerRef = useRef<HTMLDivElement>(null);

    // Refs to hold marker instances, preventing re-renders
    const cantinaMarkersRef = useRef<any[]>([]);
    const entryPointMarkersRef = useRef<any[]>([]);
    const userMarkerRef = useRef<any | null>(null);

    const onLoad = useCallback((mapInstance: any) => {
        setMap(mapInstance);
    
        const DURATION = 4000; // 4 seconds
        const START_TIME = performance.now();
    
        const START_ZOOM = 2;
        const END_ZOOM = 17.5;
    
        const START_TILT = 0;
        const END_TILT = 45;
        
        const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
        const animate = (currentTime: number) => {
            const elapsedTime = currentTime - START_TIME;
            const progress = Math.min(elapsedTime / DURATION, 1);
            const easedProgress = easeInOutCubic(progress);
    
            const currentZoom = START_ZOOM + (END_ZOOM - START_ZOOM) * easedProgress;
            const currentTilt = START_TILT + (END_TILT - START_TILT) * easedProgress;
            
            mapInstance.moveCamera({
                center: center,
                zoom: currentZoom,
                tilt: currentTilt,
            });
    
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                mapInstance.setOptions({ gestureHandling: 'greedy' });
                setAnimationComplete(true);
            }
        };
    
        requestAnimationFrame(animate);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);
    
    useEffect(() => {
        if (!isLoaded || !map || !animationComplete) return;

        if (!(window as any).google?.maps?.marker) {
            console.error("Advanced Markers library not loaded.");
            return;
        }

        cantinaMarkersRef.current.forEach(marker => marker.map = null);
        cantinaMarkersRef.current = [];

        CANTINE_DATA.forEach(cantina => {
            let [lat, lng] = cantina.coordinates.split(',').map(Number);
            
            switch (cantina.id) {
                case 3: lng -= 0.00006; break;
                case 5: lng += 0.00006; break;
                case 8: lat -= 0.00008; break;
            }
            
            const icon = document.createElement('div');
            icon.style.width = '40px';
            icon.style.height = '40px';
            icon.style.display = 'flex';
            icon.style.alignItems = 'center';
            icon.style.justifyContent = 'center';
            icon.style.cursor = 'pointer';
            
            let iconEmoji: string;
            switch (cantina.id) {
                case 1: case 3: iconEmoji = '🐟'; break;
                case 2: iconEmoji = '🍆'; break;
                case 4: iconEmoji = '🍝'; break;
                case 5: iconEmoji = '🍰'; break;
                case 6: iconEmoji = '🍷'; break;
                case 7: iconEmoji = '🥩'; break;
                case 8: iconEmoji = '🍺'; break;
                default: iconEmoji = '🍇';
            }
            
            icon.innerHTML = `<span style="font-size: 32px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${iconEmoji}</span>`;
            
            const marker = new (window as any).google.maps.marker.AdvancedMarkerElement({
                position: { lat, lng }, map, title: cantina.name, content: icon,
            });

            marker.addListener('click', () => handleMarkerClick(cantina));
            cantinaMarkersRef.current.push(marker);
        });

        return () => { cantinaMarkersRef.current.forEach(marker => marker.map = null); };
    }, [isLoaded, map, animationComplete]);

    useEffect(() => {
        if (!isLoaded || !map || !animationComplete) return;
        if (!(window as any).google?.maps?.marker) return;

        entryPointMarkersRef.current.forEach(marker => marker.map = null);
        entryPointMarkersRef.current = [];

        ENTRY_POINTS.forEach(point => {
            const [lat, lng] = point.coordinates.split(',').map(Number);
            const icon = document.createElement('div');
            icon.style.width = '40px';
            icon.style.height = '40px';
            icon.style.display = 'flex';
            icon.style.alignItems = 'center';
            icon.style.justifyContent = 'center';
            icon.style.cursor = 'pointer';
            icon.innerHTML = `<span style="font-size: 32px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">📍</span>`;
            
            const marker = new (window as any).google.maps.marker.AdvancedMarkerElement({
                position: { lat, lng }, map, title: point.name, content: icon,
            });

            marker.addListener('click', () => handleEntryPointClick(point));
            entryPointMarkersRef.current.push(marker);
        });

        return () => { entryPointMarkersRef.current.forEach(marker => marker.map = null); };
    }, [isLoaded, map, animationComplete]);

    useEffect(() => {
        if (!isLoaded || !map || !animationComplete) return;
        if (!(window as any).google?.maps?.marker) return;

        if (userMarkerRef.current) userMarkerRef.current.map = null;

        if (userPosition) {
            const icon = document.createElement('div');
            icon.innerHTML = `<span style="font-size: 34px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">🧍</span>`;
            userMarkerRef.current = new (window as any).google.maps.marker.AdvancedMarkerElement({
                position: userPosition, map, content: icon, zIndex: 999,
            });
        } else {
            userMarkerRef.current = null;
        }
    }, [isLoaded, map, userPosition, animationComplete]);

    const handleGeolocationError = (error: GeolocationPositionError) => {
        let message = "Impossibile ottenere la posizione.";
        switch (error.code) {
            case error.PERMISSION_DENIED: message = "Permesso di geolocalizzazione negato. Controlla le impostazioni del tuo browser."; break;
            case error.POSITION_UNAVAILABLE: message = "Informazioni sulla posizione non disponibili al momento."; break;
            case error.TIMEOUT: message = "La richiesta per ottenere la posizione è scaduta."; break;
        }
        setGeolocationMessage({ type: 'error', text: message });
        setTimeout(() => setGeolocationMessage(null), 7000);
    };
    
    const handleGetDirections = (destination: Cantina | EntryPoint) => {
        setGeolocationMessage(null);
        if (!navigator.geolocation) {
            setGeolocationMessage({ type: 'error', text: "La geolocalizzazione non è supportata da questo browser." });
            setTimeout(() => setGeolocationMessage(null), 5000);
            return;
        }
        setGeolocationMessage({ type: 'info', text: 'Sto cercando la tua posizione...' });
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserPosition({ lat: latitude, lng: longitude });
                setGeolocationMessage({ type: 'success', text: 'Posizione trovata! Apro Google Maps...' });
                setTimeout(() => setGeolocationMessage(null), 3000);
                const userCoords = `${latitude},${longitude}`;
                const destinationCoords = destination.coordinates;
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userCoords}&destination=${destinationCoords}&travelmode=walking`;
                window.open(mapsUrl, '_blank', 'noopener,noreferrer');
            }, 
            handleGeolocationError,
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleFlyToUserLocation = () => {
        setGeolocationMessage(null);
        if (!navigator.geolocation) {
            setGeolocationMessage({ type: 'error', text: "Geolocalizzazione non supportata dal tuo browser." });
            setTimeout(() => setGeolocationMessage(null), 3000);
            return;
        }
        setGeolocationMessage({ type: 'info', text: 'Sto cercando la tua posizione...' });
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const pos = { lat: latitude, lng: longitude };
            setUserPosition(pos);
            map?.panTo(pos);
            map?.setZoom(18);
            setGeolocationMessage({ type: 'success', text: 'Posizione trovata!' });
            setTimeout(() => setGeolocationMessage(null), 3000);
        }, handleGeolocationError, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    };

    const handleMarkerClick = (cantina: Cantina) => {
        setActiveEntryPoint(null); setActiveCantina(cantina);
        const [lat, lng] = cantina.coordinates.split(',').map(Number);
        map?.panTo({ lat, lng });
    };

    const handleEntryPointClick = (point: EntryPoint) => {
        setActiveCantina(null); setActiveEntryPoint(point);
        const [lat, lng] = point.coordinates.split(',').map(Number);
        map?.panTo({ lat, lng });
    }

    const handleInfoWindowClose = () => {
        setActiveCantina(null); setActiveEntryPoint(null);
    };
    
    if (IS_API_KEY_MISSING) return <ApiKeyInstructions />;
    if (loadError) return (
        <div className="text-center p-4 md:p-8 bg-white rounded-lg shadow-lg animate-fade-in">
            <h3 className="text-2xl font-bold text-red-600 mb-4">⚠️ Errore di Caricamento Mappa</h3>
            <p className="text-brand-text">
                Impossibile caricare la mappa. Controlla la tua connessione internet e assicurati che la chiave API di Google Maps sia valida e che le API necessarie siano abilitate nel tuo progetto Google Cloud.
            </p>
        </div>
    );
    if (!isLoaded) return <Spinner />;
    
    return (
        <div ref={mapContainerRef} className="relative w-full h-[calc(100vh-220px)] rounded-lg shadow-lg overflow-hidden animate-fade-in">
             <GoogleMap mapContainerStyle={containerStyle} options={mapOptions} onLoad={onLoad} onUnmount={onUnmount}>
                {animationComplete && activeCantina && (
                     <OverlayViewF
                        position={{
                            lat: parseFloat(activeCantina.coordinates.split(',')[0]),
                            lng: parseFloat(activeCantina.coordinates.split(',')[1]),
                        }}
                        mapPaneName={'floatPane'}
                        getPixelPositionOffset={getPixelPositionOffset}
                    >
                        <div style={{
                            position: 'relative',
                            background: 'white',
                            padding: '16px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            fontFamily: 'Roboto, sans-serif',
                            color: '#4B2A1E',
                            width: '240px',
                            textAlign: 'center',
                        }}>
                             <button
                                onClick={handleInfoWindowClose}
                                aria-label="Chiudi"
                                style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '20px',
                                    lineHeight: 1,
                                    cursor: 'pointer',
                                    color: '#4B2A1E',
                                    padding: '4px'
                                }}
                            >
                                &times;
                            </button>
                            <h3 style={{ color: '#8C2D19', fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '1.1rem' }}>{activeCantina.name}</h3>
                            <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem' }}>{activeCantina.locationName}</p>
                            <button
                                onClick={() => handleGetDirections(activeCantina)}
                                style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    backgroundColor: '#8C2D19',
                                    color: 'white',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    fontSize: '0.9rem',
                                    fontWeight: 500
                                }}
                            >
                                Percorso a piedi
                            </button>
                        </div>
                    </OverlayViewF>
                )}
                {animationComplete && activeEntryPoint && (
                    <OverlayViewF
                        position={{ lat: parseFloat(activeEntryPoint.coordinates.split(',')[0]), lng: parseFloat(activeEntryPoint.coordinates.split(',')[1]) }}
                        mapPaneName={'floatPane'}
                        getPixelPositionOffset={getPixelPositionOffset}
                    >
                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            background: 'white',
                            padding: '16px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            fontFamily: 'Roboto, sans-serif',
                            color: '#4B2A1E',
                            width: '280px',
                        }}>
                             <button
                                onClick={handleInfoWindowClose}
                                aria-label="Chiudi"
                                style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '20px',
                                    lineHeight: 1,
                                    cursor: 'pointer',
                                    color: '#4B2A1E',
                                    padding: '4px'
                                }}
                            >
                                &times;
                            </button>
                            <div style={{ fontSize: '40px', marginRight: '16px', lineHeight: 1 }}>
                                <span role="img" aria-label="Ingresso">📍</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ color: '#D97706', fontWeight: 'bold', margin: '0 0 10px 0', fontSize: '1rem' }}>{activeEntryPoint.name}</h3>
                                <button
                                    onClick={() => handleGetDirections(activeEntryPoint)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 10px',
                                        backgroundColor: '#D97706',
                                        color: 'white',
                                        borderRadius: '4px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        fontSize: '0.85rem',
                                        fontWeight: 500
                                    }}
                                >
                                    Percorso a piedi
                                </button>
                            </div>
                        </div>
                    </OverlayViewF>
                )}
            </GoogleMap>
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-wrap justify-center gap-2 transition-opacity duration-500 ${animationComplete ? 'opacity-100' : 'opacity-0'}`}>
                <button onClick={handleFlyToUserLocation} className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-brand-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all transform hover:scale-105">
                    <span className="mr-1.5 text-lg" role="img" aria-label="posizione">🧍</span>
                    La mia posizione
                </button>
            </div>
            {geolocationMessage && (
                 <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 p-2 px-4 text-sm rounded-md shadow-lg transition-all duration-300 ${
                    geolocationMessage.type === 'error' ? 'bg-red-100 text-red-800' : 
                    geolocationMessage.type === 'success' ? 'bg-green-100 text-green-800' : 
                    'bg-blue-100 text-blue-800'
                 }`}>
                    {geolocationMessage.text}
                </div>
            )}
        </div>
    );
};

export default MapPage;