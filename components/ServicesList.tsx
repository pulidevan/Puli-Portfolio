import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import { ArrowRight } from 'lucide-react';
import { useAudio } from './AudioProvider';
import { ServiceItem } from '../types';

interface ServicesListProps {
  services: ServiceItem[];
}

const ServicesList: React.FC<ServicesListProps> = ({ services }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { playHover } = useAudio();

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    playHover();
  };

  return (
    <div className="w-full flex flex-col" onMouseLeave={() => setHoveredIndex(null)}>
      {services.map((service, index) => (
        <ScrollReveal key={index} delay={index * 50}>
          <div
            className={`group relative flex flex-col md:flex-row md:items-center justify-between border-t border-white/20 py-8 md:py-12 transition-all duration-500 cursor-hover
              ${hoveredIndex !== null && hoveredIndex !== index ? 'opacity-30' : 'opacity-100'}
            `}
            onMouseEnter={() => handleMouseEnter(index)}
          >
            <div 
              className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-20 transition-transform duration-500 ease-out will-change-transform"
              style={{ transform: hoveredIndex === index ? 'translateX(10px)' : 'translateX(0)' }}
            >
              <span className="font-mono-custom text-xs md:text-sm text-gray-500">
                {service.id}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-headline text-4xl md:text-7xl uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:to-white">
                  {service.title}
                </h3>
                {/* Description - reveals on hover/mobile */}
                <p className={`max-w-md font-sans text-gray-400 text-sm md:text-base leading-relaxed transition-all duration-500 overflow-hidden
                  ${hoveredIndex === index ? 'md:max-h-24 md:opacity-100 md:mt-2' : 'md:max-h-0 md:opacity-0 md:mt-0'}
                  max-h-24 opacity-100 mt-2 md:block
                `}>
                  {service.desc}
                </p>
              </div>
            </div>
            
            <div 
              className={`hidden md:flex items-center gap-4 pr-8 transition-all duration-500 ${
                hoveredIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
            >
               <div className="bg-white rounded-full p-3 transform group-hover:rotate-45 transition-transform duration-500">
                 <ArrowRight className="w-5 h-5 text-black" />
               </div>
            </div>
          </div>
        </ScrollReveal>
      ))}
      <div className="border-t border-white/20" />
    </div>
  );
};

export default ServicesList;