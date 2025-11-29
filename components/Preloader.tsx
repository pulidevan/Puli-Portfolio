
import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Duration of the loader in ms
    const duration = 2500; 
    const intervalTime = 30;
    const totalSteps = duration / intervalTime;
    const increment = 100 / totalSteps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(onComplete, 800); // Wait for exit animation
      }, 200);
    }
  }, [progress, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[99999] bg-black flex flex-col justify-between p-6 md:p-12 transition-transform duration-[800ms] ease-expo ${
        isExiting ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="font-mono-custom text-xs text-gray-500 uppercase tracking-widest animate-pulse">
          /// System Boot
        </div>
        <div className="font-mono-custom text-xs text-gray-500 uppercase tracking-widest">
           puli.dev © 2025
        </div>
      </div>

      {/* Center Counter */}
      <div className="flex flex-col items-center justify-center relative">
        <div className="font-headline font-bold text-[20vw] md:text-[15vw] leading-none text-white tabular-nums tracking-tighter mix-blend-difference">
          {Math.floor(progress)}
        </div>
        
        {/* Progress Bar Line */}
        <div className="w-full max-w-md h-[1px] bg-gray-800 mt-8 relative overflow-hidden">
            <div 
                className="absolute top-0 left-0 h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
            />
        </div>
      </div>

      {/* Bottom Status */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
             <div className="font-mono-custom text-xs text-white uppercase tracking-widest">
                Loading Assets...
             </div>
             <div className="font-mono-custom text-[10px] text-gray-500 uppercase tracking-widest">
                [ Audio Engine :: Ready ] <br/>
                [ WebGL Context :: Initialized ]
             </div>
        </div>
        
        <div className="hidden md:block font-mono-custom text-xs text-gray-500 uppercase tracking-widest text-right">
            Ver 2.5.0 <br/>
            Secure Connection
        </div>
      </div>
    </div>
  );
};

export default Preloader;
