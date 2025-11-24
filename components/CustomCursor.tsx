import React, { useEffect, useState, useRef } from 'react';
import { useAudio } from './AudioProvider';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const requestRef = useRef<number>(0);
  const { playClick } = useAudio();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTargetPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-hover') ||
        target.closest('.cursor-hover')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    
    const handleMouseDown = () => {
      playClick();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(requestRef.current);
    };
  }, [playClick]);

  useEffect(() => {
    const animate = () => {
      setPosition((prev) => {
        // Linear Interpolation (Lerp) for delay effect
        const dx = targetPosition.x - prev.x;
        const dy = targetPosition.y - prev.y;
        return {
          x: prev.x + dx * 0.1, 
          y: prev.y + dy * 0.1,
        };
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [targetPosition]);

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
      }}
    >
      <div
        className={`bg-white rounded-full transition-all duration-300 ease-out ${
          isHovering ? 'w-20 h-20 opacity-90' : 'w-4 h-4 opacity-100'
        }`}
      />
      {isHovering && (
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-[10px] font-mono-custom uppercase tracking-widest opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
            View
         </div>
      )}
    </div>
  );
};

export default CustomCursor;