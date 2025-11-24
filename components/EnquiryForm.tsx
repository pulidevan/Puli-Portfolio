import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const EnquiryForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    budget: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneNumber = "917401781784";
    const text = `Hey Puli, my name is ${formData.name || '...'}. 
I'm interested in ${formData.project || 'a project'}. 
My budget is around ${formData.budget || 'undecided'}. 
You can reach me at ${formData.email}.`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 md:py-24">
      <ScrollReveal>
        <h2 className="font-headline text-6xl md:text-9xl mb-12 uppercase leading-[0.8]">
          Let's Start <br/>
          <span className="font-serif-italic text-4xl md:text-7xl lowercase text-gray-400 block mt-2 ml-4 md:ml-24">a conversation</span>
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <form onSubmit={handleSubmit} className="font-display text-2xl md:text-4xl leading-relaxed md:leading-loose text-gray-300">
          <div className="space-y-4 md:space-y-0 md:inline">
            <span>Hello, my name is </span>
            <input 
              type="text" 
              name="name"
              placeholder="Your Name" 
              value={formData.name}
              onChange={handleChange}
              className="inline-block bg-transparent border-b border-gray-600 focus:border-white text-white min-w-[200px] md:min-w-[300px] px-2 py-1 placeholder-gray-600 transition-colors cursor-none hover:border-gray-400"
              required
            />
            <span> from </span>
            <input 
              type="email" 
              name="email"
              placeholder="Your Company/Email" 
              value={formData.email}
              onChange={handleChange}
              className="inline-block bg-transparent border-b border-gray-600 focus:border-white text-white min-w-[250px] md:min-w-[350px] px-2 py-1 placeholder-gray-600 transition-colors cursor-none hover:border-gray-400"
              required
            />
            <span>. I'm looking for help with </span>
            <input 
              type="text" 
              name="project"
              placeholder="Web Dev / Branding / AI" 
              value={formData.project}
              onChange={handleChange}
              className="inline-block bg-transparent border-b border-gray-600 focus:border-white text-white min-w-[250px] md:min-w-[400px] px-2 py-1 placeholder-gray-600 transition-colors cursor-none hover:border-gray-400"
            />
            <span>. My budget range is roughly </span>
            <input 
              type="text" 
              name="budget"
              placeholder="$5k - $20k" 
              value={formData.budget}
              onChange={handleChange}
              className="inline-block bg-transparent border-b border-gray-600 focus:border-white text-white min-w-[200px] px-2 py-1 placeholder-gray-600 transition-colors cursor-none hover:border-gray-400"
            />
            <span>.</span>
          </div>

          <div className="mt-16 flex justify-end">
            <button 
              type="submit" 
              className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white text-black rounded-full font-mono-custom text-sm uppercase tracking-widest hover:bg-neutral-200 transition-all duration-300 cursor-none"
            >
              <span>Send via WhatsApp</span>
              <div className="relative w-6 h-6 overflow-hidden">
                <ArrowUpRight className="w-6 h-6 absolute top-0 left-0 transform group-hover:-translate-y-full group-hover:translate-x-full transition-transform duration-300" />
                <ArrowUpRight className="w-6 h-6 absolute top-0 left-0 transform -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300" />
              </div>
            </button>
          </div>
        </form>
      </ScrollReveal>
    </div>
  );
};

export default EnquiryForm;