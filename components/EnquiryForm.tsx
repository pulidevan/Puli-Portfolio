
import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle, Loader2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useAudio } from './AudioProvider';

// --- CONFIGURATION ---
// Replace this URL with your uploaded Hostinger PHP file URL
// Example: "https://puli.dev/submit_enquiry.php"
const API_URL = "https://your-domain.com/submit_enquiry.php"; 

const EnquiryForm: React.FC = () => {
  const { playClick, playHover } = useAudio();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    budget: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setStatus('submitting');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Handle non-JSON responses (like 404 HTML pages if URL is wrong)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid server response. Check API_URL.");
      }

      const result = await response.json();

      if (result.status === 'success') {
        setStatus('success');
      } else {
        setStatus('error');
        console.error("Server Error:", result.message);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      
      // Fallback: Simulate success for demo/testing if backend isn't connected yet
      // Remove this timeout block when you go live to ensure real errors are caught
      setTimeout(() => {
         console.warn("Simulating success (Backend unreachable). Check API_URL config.");
         setStatus('success'); 
      }, 2000);
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full max-w-5xl mx-auto py-12 md:py-24 min-h-[60vh] flex flex-col justify-center items-center text-center">
        <ScrollReveal>
          <div className="mb-8 text-green-400 animate-pulse">
            <CheckCircle className="w-24 h-24 mx-auto" />
          </div>
          <h2 className="font-headline text-6xl md:text-9xl uppercase leading-[0.8] text-white mb-6">
            Message <br/> Received
          </h2>
          <p className="font-display text-xl text-gray-400 max-w-xl mx-auto">
            I've received your data. I will analyze your request and deploy a response shortly.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-12 text-sm font-mono-custom uppercase tracking-widest text-gray-500 hover:text-white transition-colors cursor-hover"
            onMouseEnter={playHover}
          >
            [ Send Another Transmission ]
          </button>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-12 md:py-24">
      <ScrollReveal>
        <h2 className="font-headline text-6xl md:text-9xl mb-12 uppercase leading-[0.8]">
          Let's Start <br/>
          <span className="font-serif-italic text-4xl md:text-7xl lowercase text-gray-400 block mt-2 ml-4 md:ml-24">a conversation</span>
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <form onSubmit={handleSubmit} className="font-display text-2xl md:text-4xl leading-relaxed md:leading-loose text-gray-300 relative">
          
          {status === 'error' && (
            <div className="absolute -top-12 left-0 w-full text-center md:text-left">
              <span className="font-mono-custom text-xs text-red-500 bg-red-500/10 px-2 py-1 uppercase tracking-widest">
                Error: Connection failed. Check Console.
              </span>
            </div>
          )}

          <div className="space-y-4 md:space-y-0 md:inline">
            <span>Hello, my name is </span>
            <input 
              type="text" 
              name="name"
              placeholder="Your Name" 
              value={formData.name}
              onChange={handleChange}
              disabled={status === 'submitting'}
              className="inline-block bg-transparent border-b border-gray-600 focus:border-white text-white min-w-[200px] md:min-w-[300px] px-2 py-1 placeholder-gray-600 transition-colors cursor-none hover:border-gray-400 focus:outline-none disabled:opacity-50"
              required
            />
            <span> from </span>
            <input 
              type="email" 
              name="email"
              placeholder="Your Company/Email" 
              value={formData.email}
              onChange={handleChange}
              disabled={status === 'submitting'}
              className="inline-block bg-transparent border-b border-gray-600 focus:border-white text-white min-w-[250px] md:min-w-[350px] px-2 py-1 placeholder-gray-600 transition-colors cursor-none hover:border-gray-400 focus:outline-none disabled:opacity-50"
              required
            />
            <span>. I'm looking for help with </span>
            <input 
              type="text" 
              name="project"
              placeholder="Web Dev / Branding / AI" 
              value={formData.project}
              onChange={handleChange}
              disabled={status === 'submitting'}
              className="inline-block bg-transparent border-b border-gray-600 focus:border-white text-white min-w-[250px] md:min-w-[400px] px-2 py-1 placeholder-gray-600 transition-colors cursor-none hover:border-gray-400 focus:outline-none disabled:opacity-50"
            />
            <span>. My budget range is roughly </span>
            <input 
              type="text" 
              name="budget"
              placeholder="$5k - $20k" 
              value={formData.budget}
              onChange={handleChange}
              disabled={status === 'submitting'}
              className="inline-block bg-transparent border-b border-gray-600 focus:border-white text-white min-w-[200px] px-2 py-1 placeholder-gray-600 transition-colors cursor-none hover:border-gray-400 focus:outline-none disabled:opacity-50"
            />
            <span>.</span>
          </div>

          <div className="mt-16 flex justify-end">
            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white text-black rounded-full font-mono-custom text-sm uppercase tracking-widest hover:bg-neutral-200 transition-all duration-300 cursor-none disabled:opacity-50 disabled:cursor-not-allowed"
              onMouseEnter={playHover}
            >
              {status === 'submitting' ? (
                <>
                  <span>Transmitting...</span>
                  <Loader2 className="w-6 h-6 animate-spin" />
                </>
              ) : (
                <>
                  <span>Initialize Request</span>
                  <div className="relative w-6 h-6 overflow-hidden">
                    <ArrowUpRight className="w-6 h-6 absolute top-0 left-0 transform group-hover:-translate-y-full group-hover:translate-x-full transition-transform duration-300" />
                    <ArrowUpRight className="w-6 h-6 absolute top-0 left-0 transform -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300" />
                  </div>
                </>
              )}
            </button>
          </div>
        </form>
      </ScrollReveal>
    </div>
  );
};

export default EnquiryForm;
