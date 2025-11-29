import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle, Loader2, AlertCircle, MessageCircle } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { useAudio } from './AudioProvider';

// --- GOOGLE FORM CONFIGURATION ---
// Updated with your specific form ID
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfXbR1hhegf0OHPmlW1dfGpl1Z-cioB_eTqnB33VOtZbwam8A/formResponse"; 

const GOOGLE_ENTRY_IDS = {
  name: "entry.17388640",      // 1st Input
  email: "entry.889431657",     // 2nd Input
  whatsapp: "entry.550380227",  // 3rd Input (Was mapped incorrectly before)
  project: "entry.1499678122",  // 4th Input
  budget: "entry.1452952440",   // 5th Input
};

const EnquiryForm: React.FC = () => {
  const { playClick, playHover, playKeystroke } = useAudio();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    project: '',
    budget: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = () => {
    playKeystroke();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setStatus('submitting');
    setErrorMessage('');

    // Prepare form data using URLSearchParams (Standard Form Encoding)
    // This is more reliable for Google Forms than FormData
    const submitData = new URLSearchParams();
    submitData.append(GOOGLE_ENTRY_IDS.name, formData.name);
    submitData.append(GOOGLE_ENTRY_IDS.email, formData.email);
    submitData.append(GOOGLE_ENTRY_IDS.whatsapp, formData.whatsapp);
    submitData.append(GOOGLE_ENTRY_IDS.project, formData.project);
    submitData.append(GOOGLE_ENTRY_IDS.budget, formData.budget);

    try {
      // Send to Google Forms using no-cors mode
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: submitData.toString(),
      });

      // Artificial delay to show the loading animation for a smoother UX
      // Since no-cors returns an opaque response, we assume success if no network error occurred
      setTimeout(() => {
        setStatus('success');
        // Automatically open WhatsApp in a new tab
        window.open("https://wa.me/917401781784?text=Hi", "_blank");
      }, 1000);

    } catch (error: any) {
      console.error("Submission Error:", error);
      setStatus('error');
      setErrorMessage("Failed to connect to Google servers. Check your internet connection.");
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
          <p className="font-display text-xl text-gray-400 max-w-xl mx-auto mb-4">
            I've received your data. I will analyze your request and deploy a response shortly.
          </p>
          <p className="font-mono-custom text-xs text-gray-500 uppercase tracking-widest animate-pulse">
            Redirecting to WhatsApp...
          </p>
          <button 
            onClick={() => {
              setStatus('idle');
              setFormData({ name: '', email: '', whatsapp: '', project: '', budget: '' });
            }}
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
            <div className="mb-8 bg-red-500/10 border border-red-500/50 p-4 rounded-lg flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h4 className="font-mono-custom text-xs text-red-500 uppercase tracking-widest mb-1">Transmission Failed</h4>
                <p className="text-sm font-sans text-gray-300">{errorMessage}</p>
                <p className="text-xs text-gray-500 mt-2">Check your internet connection.</p>
              </div>
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
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
              disabled={status === 'submitting'}
              className="inline-block bg-transparent border-b border-gray-600 focus:border-white text-white min-w-[250px] md:min-w-[350px] px-2 py-1 placeholder-gray-600 transition-colors cursor-none hover:border-gray-400 focus:outline-none disabled:opacity-50"
              required
            />
            <span>. You can reach me on WhatsApp at </span>
            <input 
              type="tel" 
              name="whatsapp"
              placeholder="+1 555 000 0000" 
              value={formData.whatsapp}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={status === 'submitting'}
              className="inline-block bg-transparent border-b border-gray-600 focus:border-white text-white min-w-[200px] md:min-w-[300px] px-2 py-1 placeholder-gray-600 transition-colors cursor-none hover:border-gray-400 focus:outline-none disabled:opacity-50"
            />
            <span>. I'm looking for help with </span>
            <input 
              type="text" 
              name="project"
              placeholder="Web Dev / Branding / AI" 
              value={formData.project}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
              disabled={status === 'submitting'}
              className="inline-block bg-transparent border-b border-gray-600 focus:border-white text-white min-w-[200px] px-2 py-1 placeholder-gray-600 transition-colors cursor-none hover:border-gray-400 focus:outline-none disabled:opacity-50"
            />
            <span>.</span>
          </div>

          <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-8">
            <a 
              href="https://wa.me/917401781784"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 font-mono-custom text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors cursor-hover"
              onMouseEnter={playHover}
              onMouseDown={playClick}
            >
              <div className="p-2 border border-gray-700 rounded-full group-hover:border-green-500 group-hover:text-green-500 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span>Message Agency Directly</span>
            </a>

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