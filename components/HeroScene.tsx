import React from 'react';

const HeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {/* 
        Subtle texture overlay only.
        Removed the directional lighting/God Ray effect as requested.
      */}

      {/* Subtle scanline texture for tech feel */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '100% 4px'
        }}
      />
      
      {/* Very faint vignette to focus center */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />
    </div>
  );
};

export default HeroScene;