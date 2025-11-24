import React, { useEffect, useState } from 'react';
import { CONTENT } from './constants';
import CustomCursor from './components/CustomCursor';
import HeroScene from './components/HeroScene';
import ScrollReveal from './components/ScrollReveal';
import ServicesList from './components/ServicesList';
import EnquiryForm from './components/EnquiryForm';
import { AudioProvider, useAudio } from './components/AudioProvider';
import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react';

const MuteToggle = () => {
  const { isMuted, toggleMute } = useAudio();
  return (
    <button 
      onClick={toggleMute}
      className="fixed top-6 right-6 md:top-10 md:right-12 z-[100] mix-blend-difference text-white hover:opacity-70 transition-opacity"
      aria-label="Toggle Sound"
    >
      {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6 animate-pulse" />}
    </button>
  );
};

const AppContent: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showAgent, setShowAgent] = useState(false);
  const { playSwipe } = useAudio();

  useEffect(() => {
    const handleScrollAndResize = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      // Agent visibility logic: 
      // Desktop (>=1024px): Always show
      // Mobile/Tablet (<1024px): Show only after 3 viewports of scrolling
      const isDesktop = window.innerWidth >= 1024;
      const scrollThreshold = window.innerHeight * 3;

      if (isDesktop) {
        setShowAgent(true);
      } else {
        setShowAgent(scrollY > scrollThreshold);
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position -1 to 1
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('scroll', handleScrollAndResize);
    window.addEventListener('resize', handleScrollAndResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initial check
    handleScrollAndResize();

    return () => {
      window.removeEventListener('scroll', handleScrollAndResize);
      window.removeEventListener('resize', handleScrollAndResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Use a variable for the custom element to avoid global type pollution issues
  const ElevenLabsConvai = 'elevenlabs-convai' as any;

  return (
    <div className="min-h-screen w-full text-white selection:bg-white selection:text-black overflow-x-hidden cursor-none">
      <CustomCursor />
      <MuteToggle />

      {/* Hero Section */}
      <header className="relative w-full h-screen overflow-hidden bg-black">
        
        {/* Hero Background Image - Parallax & Right Alignment */}
        <div 
          className="absolute top-0 right-0 w-full md:w-[65%] h-full z-0 pointer-events-none select-none transition-transform duration-100 ease-out will-change-transform"
          style={{
            transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px) scale(1.05)`
          }}
        >
           <div className="relative w-full h-full">
             <img 
               src="https://i.ibb.co/sp6Hyb9B/Snapseed.jpg" 
               alt="Hero Background" 
               className="w-full h-full object-cover object-[center_20%] opacity-100 mix-blend-normal filter contrast-110 brightness-90"
             />
             {/* Gradient Mask: Much lighter fade to keep image visible */}
             <div className="absolute inset-y-0 left-0 w-full md:w-3/4 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
             {/* Gradient Mask: Bottom fade */}
             <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
           </div>
        </div>

        {/* Top Left Logo (Non-sticky) */}
        <div className="absolute top-6 left-6 md:top-10 md:left-12 z-50 mix-blend-difference pointer-events-none select-none">
          <span className="font-mono-custom text-xl md:text-2xl text-white lowercase tracking-tight">puli.dev</span>
        </div>

        <HeroScene />
        
        {/* Layout Update: Bottom Left Corner, Left Aligned */}
        <div className="absolute bottom-12 left-6 md:bottom-20 md:left-12 z-20 flex flex-col items-start text-left mix-blend-difference pointer-events-none select-none max-w-5xl">
          <ScrollReveal delay={200}>
            <h1 className="font-headline font-bold text-[10vw] md:text-[6vw] leading-[0.9] tracking-tight uppercase whitespace-nowrap text-white drop-shadow-2xl">
              {CONTENT.hero.title}
            </h1>
          </ScrollReveal>
          
          <ScrollReveal delay={400} className="ml-1 my-1 md:ml-2 md:my-2">
            <span className="font-serif-italic font-normal text-xl md:text-4xl text-gray-200 block opacity-90 drop-shadow-xl">
              {CONTENT.hero.subtitle}
            </span>
          </ScrollReveal>

          <ScrollReveal delay={600}>
            <h1 className="font-headline font-bold text-[10vw] md:text-[6vw] leading-[0.9] tracking-tight uppercase whitespace-nowrap text-stroke-white opacity-90 drop-shadow-2xl">
              {CONTENT.hero.ending}
            </h1>
          </ScrollReveal>

           <div className="mt-6 pl-1 font-mono-custom font-normal text-[10px] md:text-xs text-gray-400 opacity-80 uppercase tracking-[0.25em]">
            {CONTENT.hero.subtext}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pb-24 space-y-32 md:space-y-64 bg-black">
        
        {/* Stats Section - Grid Layout */}
        <section className="px-6 md:px-12 pt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-24 gap-x-12 border-t border-white/20 pt-16 md:pt-24">
            {CONTENT.stats.map((stat, index) => (
              <ScrollReveal key={index} delay={index * 150}>
                <div className="flex flex-col gap-2 group cursor-hover relative pl-0 md:pl-6 md:border-l border-white/10 hover:border-white transition-colors duration-500">
                  <span className="font-headline text-[18vw] md:text-[8vw] leading-[0.8] tracking-tighter text-white group-hover:text-stroke-white group-hover:text-transparent transition-all duration-500 ease-expo">
                    {stat.num}
                  </span>
                  <span className="font-mono-custom text-sm md:text-base text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">
                    {stat.label}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Services Section - Interactive List */}
        <section className="w-full px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-24 gap-8">
            <ScrollReveal>
              <h2 className="font-mono-custom text-xs text-gray-500 uppercase tracking-widest">
                (002) /// Capabilities
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={200} className="max-w-2xl text-left md:text-right font-display text-2xl md:text-3xl text-gray-300 leading-tight">
              I design, build, and deploy intelligent systems that elevate brands, automate workflows, and enhance digital experiences.
            </ScrollReveal>
          </div>
          <ServicesList services={CONTENT.services} />
        </section>

        {/* About Section - Split Cards */}
        <section className="px-6 md:px-12">
           <ScrollReveal className="mb-8">
            <h2 className="font-mono-custom text-xs text-gray-500 uppercase tracking-widest border-b border-white/20 pb-4">
              (003) /// Agency
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {CONTENT.about.map((item, index) => (
              <ScrollReveal key={index} delay={index * 200}>
                <div className="flex flex-col justify-between p-8 md:p-16 border border-white/10 hover:border-white/40 bg-neutral-900/10 hover:bg-neutral-900/40 backdrop-blur-sm transition-all duration-700 ease-expo min-h-[50vh] group cursor-hover relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="font-headline text-4xl md:text-6xl mb-6 uppercase tracking-tighter text-white">{item.title}</h3>
                    <div className="w-12 h-1 bg-white mb-8 transform origin-left group-hover:scale-x-[10] transition-transform duration-700 ease-expo"></div>
                  </div>
                  
                  <div className="relative z-10 flex flex-col gap-8">
                    <p className="font-sans text-lg md:text-xl leading-relaxed text-gray-400 group-hover:text-white transition-colors duration-500">
                      {item.desc}
                    </p>
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12 transform group-hover:rotate-45 transition-transform duration-500 ease-expo" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Testimonials - Horizontal Scroll */}
        <section className="overflow-hidden py-12">
           <div className="px-6 md:px-12 mb-12 flex justify-between items-end">
             <ScrollReveal>
              <h2 className="font-mono-custom text-xs text-gray-500 uppercase tracking-widest">
                (004) /// Testimonials
              </h2>
            </ScrollReveal>
            <div className="flex gap-2 font-mono-custom text-xs uppercase text-gray-400">
               <span>Drag to Explore</span>
               <span className="animate-pulse">→</span>
            </div>
          </div>
          
          <div 
            className="flex overflow-x-auto pb-12 px-6 md:px-12 gap-8 md:gap-16 snap-x cursor-grab active:cursor-grabbing scrollbar-hide"
            onMouseDown={() => playSwipe()}
            onTouchStart={() => playSwipe()}
          >
            {CONTENT.testimonials.map((testi, index) => (
              <ScrollReveal key={index} delay={index * 150} className="flex-shrink-0 w-[85vw] md:w-[60vw] snap-center">
                 <div className="p-8 md:p-20 border-l border-white/20 hover:bg-neutral-900/20 transition-colors duration-500 h-full flex flex-col justify-between min-h-[400px]">
                  <p className="font-display text-3xl md:text-6xl leading-tight mb-8 text-white">
                    <span className="font-serif-italic text-gray-500 text-4xl mr-2">"</span>
                    {testi.text}
                  </p>
                  <div className="flex items-center gap-6 pt-8">
                    <div className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center font-headline text-xl">
                      {index + 1}
                    </div>
                    <div>
                       <span className="block font-headline text-2xl uppercase tracking-wider">
                        {testi.name}
                      </span>
                      <span className="font-mono-custom text-xs text-gray-500 uppercase">
                        Client Partner
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
            <div className="w-1 flex-shrink-0"></div>
          </div>
        </section>

        {/* Enquiry Section */}
        <section className="px-6 md:px-12 py-12 border-t border-white/10">
           <ScrollReveal>
              <h2 className="font-mono-custom text-xs text-gray-500 uppercase tracking-widest mb-12">
                (005) /// Contact
              </h2>
           </ScrollReveal>
           <EnquiryForm />
        </section>

      </main>

      {/* Footer - Minimalist & High End */}
      <footer className="relative bg-white text-black py-12 px-6 md:px-12 rounded-t-[2rem] z-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12">
          
          {/* Left: Contact Info */}
          <div className="flex flex-col gap-8 items-start w-full">
             <div>
               <p className="font-mono-custom text-xs text-gray-500 uppercase tracking-widest mb-2">Email</p>
               <a href={`mailto:${CONTENT.contact.email}`} className="font-headline text-4xl md:text-5xl uppercase tracking-tight cursor-hover hover:opacity-70 transition-opacity">
                 {CONTENT.contact.email}
               </a>
             </div>
             
             <div>
               <p className="font-mono-custom text-xs text-gray-500 uppercase tracking-widest mb-2">Socials</p>
               <div className="flex flex-col md:flex-row gap-6 font-display text-xl">
                 <a href="https://linkedin.com/in/pulidevan" target="_blank" rel="noopener noreferrer" className="hover:line-through transition-all cursor-hover">LinkedIn</a>
                 <a href="https://x.com/pulidevan" target="_blank" rel="noopener noreferrer" className="hover:line-through transition-all cursor-hover">X / Twitter</a>
                 <a href="https://instagram.com/itspuli" target="_blank" rel="noopener noreferrer" className="hover:line-through transition-all cursor-hover">Instagram</a>
               </div>
             </div>
          </div>

          {/* Right: Credit */}
          <div className="flex flex-col items-start md:items-end gap-2 text-left md:text-right font-mono-custom text-xs uppercase w-full">
             <span className="block text-gray-400">© 2025 {CONTENT.brand}</span>
             <span className="block text-gray-800">{CONTENT.contact.credit}</span>
          </div>

        </div>
      </footer>
      
      {/* ElevenLabs Agent Embed - Conditional Render */}
      {showAgent && (
        <ElevenLabsConvai agent-id="agent_3001ka6td5t4fx2tp16x9n94mvg6"></ElevenLabsConvai>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AudioProvider>
      <AppContent />
    </AudioProvider>
  );
};

export default App;