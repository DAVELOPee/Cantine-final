import React, { useState, useEffect, useRef, useCallback } from 'react';

const GrapeIcon = () => (
    <div className="text-6xl mx-auto mb-4" role="img" aria-label="Vino e Uva">
      🍷🍇
    </div>
);

interface TimeLeft {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
}

const getTargetDate = (): Date => {
    const now = new Date();
    const year = now.getFullYear();
    // L'evento inizia il 25 Settembre alle 19:00
    return new Date(year, 8, 25, 19, 0, 0);
};

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }
    return timeLeft;
};

const ScrollDownArrow: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div 
        className="cursor-pointer"
        onClick={onClick}
        role="button"
        aria-label="Scrolla verso il basso"
    >
        <svg className="w-10 h-10 text-white drop-shadow-lg animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    </div>
);

const Home: React.FC = () => {
    const [targetDate] = useState(getTargetDate());
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));
    const [isLoaded, setIsLoaded] = useState(false);
    const [showArrow, setShowArrow] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const titleText = "Benvenuti a CANTINE 2025";

    useEffect(() => {
        const loadTimer = setTimeout(() => setIsLoaded(true), 100);
        const arrowTimer = setTimeout(() => setShowArrow(true), 1200);
        return () => { clearTimeout(loadTimer); clearTimeout(arrowTimer); };
    }, []);

    const triggerScroll = useCallback(() => {
        if (hasInteracted || !contentRef.current) return;
        
        setHasInteracted(true);
        setShowArrow(false);

        const targetElement = contentRef.current;
        const targetPosition = targetElement.offsetTop;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 2000; // Durata dello scroll
        const fadeInAnimationDuration = 1500; // Deve corrispondere alla durata in index.css
        let startTime: number | null = null;

        // Avvia l'animazione di fade-in in modo che termini insieme allo scroll
        setTimeout(() => {
            setIsContentVisible(true);
        }, duration - fadeInAnimationDuration); // Es: 2000ms - 1500ms = avvia dopo 500ms

        const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const scrollAnimation = (currentTime: number) => {
            if (startTime === null) {
                startTime = currentTime;
            }
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);

            if (timeElapsed < duration) {
                requestAnimationFrame(scrollAnimation);
            }
            // setIsContentVisible è ora gestito dal setTimeout per sincronizzare le animazioni
        };

        requestAnimationFrame(scrollAnimation);
    }, [hasInteracted]);

    useEffect(() => {
        const timer = setInterval(() => {
          setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const hasTimeLeft = Object.keys(timeLeft).length > 0;

    return (
        <div onWheel={triggerScroll} onTouchStart={triggerScroll}>
            <div className="h-screen w-full relative">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
                    style={{
                        backgroundImage: `url('/images/home-background.jpeg')`,
                        opacity: isLoaded ? 1 : 0,
                    }}
                />
                <div className="absolute inset-0 bg-black/30" />
                
                <div className={`
                  absolute bottom-64 left-1/2 -translate-x-1/2 
                  transition-opacity duration-500 z-10
                  ${showArrow ? 'opacity-100' : 'opacity-0'}
                `}>
                    <ScrollDownArrow onClick={triggerScroll} />
                </div>
            </div>

            <section
                ref={contentRef}
                className="relative bg-brand-background p-4 md:p-8 flex justify-center items-center min-h-[calc(100vh-128px)]"
            >
                <div
                    className={`bg-white p-8 rounded-lg shadow-xl max-w-lg w-full text-center ${isContentVisible ? 'animate-fade-in-slow' : 'opacity-0'}`}
                >
                    <GrapeIcon />
                    <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4">
                      {titleText}
                    </h2>
                    <p className="text-brand-text text-lg mb-6">
                      L'evento più atteso dell'anno all'Isola del Giglio.
                    </p>

                    {hasTimeLeft ? (
                      <div className="mt-8">
                        <h3 className="text-xl font-serif text-brand-secondary mb-4 italic">
                          L'attesa sta per finire...
                        </h3>
                        <div className="grid grid-cols-4 gap-2 md:gap-4 text-center">
                            <div className="flex flex-col p-2 bg-amber-50 rounded-lg">
                                <span className="text-4xl md:text-5xl font-bold text-brand-primary">
                                    {String(timeLeft.days).padStart(2, '0')}
                                </span>
                                <span className="text-xs uppercase text-brand-light-text tracking-wider mt-1">Giorni</span>
                            </div>
                            <div className="flex flex-col p-2 bg-amber-50 rounded-lg">
                                <span className="text-4xl md:text-5xl font-bold text-brand-primary">
                                    {String(timeLeft.hours).padStart(2, '0')}
                                </span>
                                <span className="text-xs uppercase text-brand-light-text tracking-wider mt-1">Ore</span>
                            </div>
                            <div className="flex flex-col p-2 bg-amber-50 rounded-lg">
                                <span className="text-4xl md:text-5xl font-bold text-brand-primary">
                                    {String(timeLeft.minutes).padStart(2, '0')}
                                </span>
                                <span className="text-xs uppercase text-brand-light-text tracking-wider mt-1">Minuti</span>
                            </div>
                            <div className="flex flex-col p-2 bg-amber-50 rounded-lg">
                                <span className="text-4xl md:text-5xl font-bold text-brand-primary">
                                    {String(timeLeft.seconds).padStart(2, '0')}
                                </span>
                                <span className="text-xs uppercase text-brand-light-text tracking-wider mt-1">Secondi</span>
                            </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-8">
                         <h3 className="text-2xl font-serif text-brand-secondary font-bold">
                          L'evento è in corso!
                        </h3>
                        <p className="text-brand-light-text mt-2">
                          Usa la barra di navigazione qui sotto per scoprire le cantine e visualizzarle sulla mappa interattiva.
                        </p>
                      </div>
                    )}
                </div>
            </section>
             <div className="h-24 bg-brand-background" />
        </div>
    );
};

export default Home;
