import React, { useState } from 'react';
import Home from './components/Home';
import CantinePage from './components/CantinePage';
import MapPage from './components/MapPage';
import BottomNavBar from './components/BottomNavBar';

export type ActiveView = 'home' | 'cantine' | 'mappa';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('home');

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <Home />;
      case 'cantine':
        return <CantinePage />;
      case 'mappa':
        return <MapPage />;
      default:
        return <Home />;
    }
  };
  
  // La gestione dello sfondo della home è ora interna al componente Home.
  // Qui gestiamo solo lo sfondo di default per le altre pagine.
  const backgroundClass = activeView !== 'home' ? 'bg-brand-background' : '';

  return (
    <div className={`min-h-screen w-full font-sans text-brand-text ${backgroundClass}`}>
      <header className="bg-brand-primary/95 shadow-lg px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] sticky top-0 z-20 backdrop-blur-sm">
        <div className="container mx-auto text-center text-white">
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-wider">CANTINE APERTE</h1>
          <p className="text-lg font-serif italic text-amber-200">Isola del Giglio</p>
        </div>
      </header>

      {/* Il main non ha padding o contenitori per la home, per permettere layout a schermo intero */}
      <main className={activeView !== 'home' ? "p-4 md:p-8 pb-24" : ""}>
        {activeView === 'home' ? (
          renderContent()
        ) : (
          <div className="container mx-auto">
            {renderContent()}
          </div>
        )}
      </main>
      
      <BottomNavBar activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default App;