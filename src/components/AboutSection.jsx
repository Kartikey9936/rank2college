import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="glass p-6 md:p-8 flex flex-col gap-4 mt-4" style={{ borderRadius: 'var(--radius-xl)' }}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ background: 'var(--accent-muted)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <Sparkles className="w-5 h-5" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--fg)', letterSpacing: '-0.01em' }}>
          About Us
        </h3>
      </div>
      
      <p style={{ color: 'rgba(250,250,250,0.75)', fontSize: '0.875rem', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
        Navigating the JoSAA or CSAB counselling process can be complex. Our Rank2College Predictor simplifies this journey by providing instant, data-driven insights. You can figure out the eligible college and course details by providing inputs such as your <span style={{ color: 'var(--accent)', fontWeight: 600 }}> Rank, Category, or Quotas</span>.
      </p>
      
      <p style={{ color: 'rgba(250,250,250,0.75)', fontSize: '0.875rem', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
        By entering your details and selecting your preferences for course, category, and domicile, you can see a list of potential <span className="font-semibold text-white">IITs, NITs, IIITs, and GFTIs</span> you might get into. This tool uses historical closing rank data to give you a realistic estimate, helping you make informed decisions during the crucial choice-filling process and maximizing your chances of securing admission to your dream college.
      </p>
    </div>
  );
}
