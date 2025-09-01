import React from 'react';
import type { ActiveView } from '../App';

interface BottomNavBarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors group ${isActive ? 'text-white' : 'text-amber-200 hover:text-white'}`}
    aria-current={isActive ? 'page' : undefined}
  >
    {icon}
    <span>{label}</span>
  </button>
);


const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setActiveView }) => {
  const getIconClass = (isActive: boolean) => {
    return `text-2xl mb-1 transition-transform duration-200 ease-in-out ${isActive ? 'transform scale-125' : 'scale-100'}`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-brand-primary shadow-[0_-2px_10px_rgba(0,0,0,0.2)] z-30 pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-16 items-center justify-around">
        <NavItem
          icon={<span className={getIconClass(activeView === 'home')}>🏠</span>}
          label="Home"
          isActive={activeView === 'home'}
          onClick={() => setActiveView('home')}
        />
        <NavItem
          icon={<span className={getIconClass(activeView === 'cantine')}>🍇</span>}
          label="Cantine"
          isActive={activeView === 'cantine'}
          onClick={() => setActiveView('cantine')}
        />
        <NavItem
          icon={<span className={getIconClass(activeView === 'mappa')}>🗺️</span>}
          label="Mappa"
          isActive={activeView === 'mappa'}
          onClick={() => setActiveView('mappa')}
        />
      </div>
    </nav>
  );
};

export default BottomNavBar;