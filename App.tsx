
import React, { useEffect, useState, useRef } from 'react';
import { CONTENT } from './constants';
import CustomCursor from './components/CustomCursor';
import HeroScene from './components/HeroScene';
import ScrollReveal from './components/ScrollReveal';
import ServicesList from './components/ServicesList';
import EnquiryForm from './components/EnquiryForm';
import Preloader from './components/Preloader';
import { AudioProvider, useAudio } from './components/AudioProvider';
import { ArrowUpRight, Terminal, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showAgent, setShowAgent] = useState(false);
  
  // Video Player State
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isPlayerPaused, setIsPlayerPaused] = useState(false);
  const [isPlayerMuted, setIsPlayerMuted] = useState(false);

  const { playSwipe, playHover, playClick, setMuted } = useAudio();

  useEffect(() => {
    // Only start specific logic after loading is done to save resources
    if (isLoading) return;

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
      } else if (scrollY > scrollThreshold) {
        // Latch to true: Once shown, keep it mounted.
        setShowAgent(true);
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
    
    handleScrollAndResize();

    return () => {
      window.removeEventListener('scroll', handleScrollAndResize);
      window.removeEventListener('resize', handleScrollAndResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isLoading]);

  // Listen for Video End event from Vimeo (via postMessage)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
       try {
           if (typeof event.data !== 'string') return;
           const data = JSON.parse(event.data);
           
           // Vimeo 'ready' event -> register 'finish' listener and Force Unmute
           if (data.event === 'ready') {
                const iframe = document.querySelector('iframe[src*="vimeo"]');
                if (iframe && (iframe as HTMLIFrameElement).contentWindow) {
                    const win = (iframe as HTMLIFrameElement).contentWindow;
                    
                    // Register Finish Listener
                    win?.postMessage(JSON.stringify({
                        method: 'addEventListener',
                        value: 'finish'
                    }), '*');

                    // FORCE UNMUTE: Set volume to 100%
                    win?.postMessage(JSON.stringify({
                        method: 'setVolume',
                        value: 1
                    }), '*');
                    setIsPlayerMuted(false);
                }
           }

           // Vimeo 'finish' event
           if (data.event === 'finish') {
               setIsVideoPlaying(false);
               setIsPlayerPaused(false);
           }
       } catch (e) {
           // Ignore non-JSON messages
       }
    };
    
    if (isVideoPlaying) {
        window.addEventListener('message', handleMessage);
    }
    return () => window.removeEventListener('message', handleMessage);
  }, [isVideoPlaying]);

  // Use a variable for the custom element to avoid global type pollution issues
  const ElevenLabsConvai = 'elevenlabs-convai' as any;

  // Video Controls
  const toggleVideoPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const iframe = document.querySelector('iframe[src*="vimeo"]');
    if (iframe && (iframe as HTMLIFrameElement).contentWindow) {
        const method = isPlayerPaused ? 'play' : 'pause';
        (iframe as HTMLIFrameElement).contentWindow?.postMessage(JSON.stringify({ method }), '*');
        setIsPlayerPaused(!isPlayerPaused);
    }
  };

  const toggleVideoMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const iframe = document.querySelector('iframe[src*="vimeo"]');
    if (iframe && (iframe as HTMLIFrameElement).contentWindow) {
        const volume = isPlayerMuted ? 1 : 0;
        (iframe as HTMLIFrameElement).contentWindow?.postMessage(JSON.stringify({ 
            method: 'setVolume', 
            value: volume 
        }), '*');
        setIsPlayerMuted(!isPlayerMuted);
    }
  };

  return (
    <div className="min-h-screen w-full text-white selection:bg-white selection:text-black overflow-x-hidden cursor-none">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      
      <CustomCursor />

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

           <div className="mt-6 pl-1 flex flex-col gap-6">
             <div className="font-mono-custom font-normal text-[10px] md:text-xs text-gray-400 opacity-80 uppercase tracking-[0.25em]">
              {CONTENT.hero.subtext}
             </div>
             
             {/* Founder Tag */}
             <div className="border-l border-white/50 pl-4 py-1">
               <h3 className="font-headline font-bold text-lg md:text-xl uppercase tracking-wide text-white">{CONTENT.founder.name}</h3>
               <p className="font-mono-custom text-[10px] md:text-xs text-gray-300 uppercase tracking-widest mt-1">{CONTENT.founder.role}</p>
             </div>
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

        {/* Video Embed Section - Centered & Architectural */}
        <section className="px-6 md:px-12 py-12 flex justify-center">
          <ScrollReveal className="w-full max-w-5xl">
            {/* Background Grid Frame */}
            <div className="relative w-full p-2 md:p-8 border border-white/10 bg-neutral-900/10 backdrop-blur-sm">
                
                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/50"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/50"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/50"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/50"></div>

                <div className="relative w-full aspect-[4/3] bg-black overflow-hidden shadow-2xl group border border-white/5 no-global-unmute">
                  {/* Global Noise Overlay */}
                  <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none z-0"></div>
                  
                  {!isVideoPlaying ? (
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10 group/thumbnail"
                      onClick={() => {
                        setIsVideoPlaying(true);
                        setMuted(true); // Silence global background audio when video starts
                      }}
                      onMouseEnter={playHover}
                    >
                      {/* Thumbnail Image */}
                      <img 
                        src="https://i.ibb.co/k2CMc14f/1128-1.png" 
                        alt="Video Thumbnail"
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/thumbnail:scale-105 transition-transform duration-700 ease-out"
                      />

                       {/* Dark Aesthetic Overlay */}
                       <div className="absolute inset-0 bg-black/40 group-hover/thumbnail:bg-black/20 transition-colors duration-500"></div>
                       
                       {/* Label */}
                       <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-3 z-20">
                          <Terminal className="w-4 h-4 md:w-5 md:h-5 text-white drop-shadow-lg" />
                          <span className="font-mono-custom text--[10px] md:text-xs text-white uppercase tracking-widest drop-shadow-md">System Architecture</span>
                       </div>

                       {/* Small Play Button */}
                       <div 
                         className="relative z-20 group/play w-16 h-16 md:w-20 md:h-20 border border-white/20 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 hover:bg-white hover:border-white shadow-xl"
                         onMouseDown={playClick}
                       >
                          <Play className="w-6 h-6 md:w-8 md:h-8 fill-white text-white group-hover/play:fill-black group-hover/play:text-black transition-colors duration-300 ml-1" />
                       </div>
                       
                       <span className="relative z-20 mt-4 font-mono-custom text-[10px] md:text-xs text-white uppercase tracking-widest opacity-0 group-hover/thumbnail:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover/thumbnail:translate-y-0 drop-shadow-md">
                         Initialize Playback
                       </span>
                    </div>
                  ) : (
                    <>
                      <iframe 
                        loading="eager" 
                        // @ts-ignore
                        fetchPriority="high"
                        title="Vimeo video player"
                        src="https://player.vimeo.com/video/1141647818?autoplay=1&muted=0&quality=1080p&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479&controls=0&api=1"
                        className="absolute inset-0 w-full h-full border-none z-10"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                      />
                      
                      {/* Custom Controls Overlay */}
                      <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex justify-between items-end bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 no-global-unmute">
                         {/* Play/Pause */}
                         <button 
                           onClick={toggleVideoPlay}
                           className="text-white hover:text-gray-300 transition-colors p-2"
                         >
                           {isPlayerPaused ? <Play className="w-8 h-8 fill-white" /> : <Pause className="w-8 h-8 fill-white" />}
                         </button>

                         {/* Mute/Unmute */}
                         <button 
                            onClick={toggleVideoMute}
                            className="text-white hover:text-gray-300 transition-colors p-2"
                         >
                            {isPlayerMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
                         </button>
                      </div>
                    </>
                  )}
                </div>
            </div>
          </ScrollReveal>
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
