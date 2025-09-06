import React, { useState, useEffect } from 'react';

// Icone PNG per le istruzioni
const IosShareIcon = () => (
    <img 
        src="/icons/ios-share.png" 
        alt="Icona di condivisione" 
        className="h-6 w-6 inline-block mx-1 align-bottom" 
        aria-hidden="true"
    />
);

const AndroidMenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mx-1" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
);


const AddToHomeScreenPrompt: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [os, setOs] = useState<'ios' | 'android' | 'other'>('other');

    useEffect(() => {
        const getOS = (): 'ios' | 'android' | 'other' => {
            const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;
            if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
                return 'ios';
            }
            if (/android/i.test(userAgent)) {
                return 'android';
            }
            return 'other';
        };

        const currentOs = getOS();
        setOs(currentOs);
        
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        // Usa sessionStorage per ricordare la scelta solo per la sessione corrente.
        const hasDismissed = sessionStorage.getItem('pwaInstallDismissed') === 'true';

        if (currentOs !== 'other' && !isStandalone && !hasDismissed) {
            const handleInteraction = () => {
                // Mostra il pop-up dopo un breve ritardo in seguito alla prima interazione
                setTimeout(() => {
                    setIsVisible(true);
                }, 3000); // Ritardo di 3 secondi dopo l'interazione

                // Rimuovi gli event listener per assicurarti che venga eseguito una sola volta
                document.removeEventListener('click', handleInteraction);
                document.removeEventListener('touchstart', handleInteraction);
                document.removeEventListener('scroll', handleInteraction);
            };

            // Ascolta la prima interazione (click, tocco o scroll)
            document.addEventListener('click', handleInteraction, { once: true });
            document.addEventListener('touchstart', handleInteraction, { once: true });
            document.addEventListener('scroll', handleInteraction, { once: true });

            return () => {
                document.removeEventListener('click', handleInteraction);
                document.removeEventListener('touchstart', handleInteraction);
                document.removeEventListener('scroll', handleInteraction);
            };
        }
    }, []);

    const handleDismiss = () => {
        // Salva la scelta nella sessionStorage per nascondere il prompt per la sessione corrente.
        sessionStorage.setItem('pwaInstallDismissed', 'true');
        setIsVisible(false);
    };

    const renderInstructions = () => {
        if (os === 'ios') {
            return (
                <p className="text-sm text-center">
                    Tocca l'icona <IosShareIcon /> e poi seleziona <span className="font-bold">"Aggiungi a schermata Home"</span>.
                </p>
            );
        }
        if (os === 'android') {
            return (
                <p className="text-sm text-center">
                    Tocca l'icona <AndroidMenuIcon /> e poi seleziona <span className="font-bold">"Installa app"</span>.
                </p>
            );
        }
        return null;
    };
    
    if (!isVisible || os === 'other') {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-40 animate-fade-in-fast flex items-end" role="dialog" aria-modal="true" aria-labelledby="pwa-prompt-title">
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lg rounded-t-2xl z-50 animate-slide-in-bottom">
                <div className="flex justify-between items-center mb-3">
                    <h2 id="pwa-prompt-title" className="text-lg font-bold text-brand-primary">Installa l'App</h2>
                    <button
                        onClick={handleDismiss}
                        aria-label="Chiudi"
                        className="text-gray-400 hover:text-gray-600 p-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex items-center space-x-4">
                     <img src="/icons/apple-touch-icon.png" alt="Icona dell'app Cantine al Giglio" className="w-16 h-16 rounded-lg shadow-md" />
                     <div className="flex-1 text-brand-text">
                        <p className="font-semibold mb-2 text-base">Falla diventare la tua app preferita, aggiungila alla Home!</p>
                        {renderInstructions()}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default AddToHomeScreenPrompt;