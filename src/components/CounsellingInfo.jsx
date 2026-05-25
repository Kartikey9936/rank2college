import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Landmark, Compass } from 'lucide-react';

// Reusable scroll-triggered counter component
function AnimatedCounter({ value, duration = 1000 }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = parseInt(value, 10);
          if (isNaN(end) || start === end) return;

          const totalMiliseconds = duration;
          const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
          
          const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= end) {
              clearInterval(timer);
            }
          }, incrementTime);
        }
      },
      { 
        threshold: 0,
        rootMargin: '350px 0px 0px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value, duration, hasAnimated]);

  return <span ref={elementRef}>{hasAnimated ? count : 0}</span>;
}

export default function CounsellingInfo() {
  return (
    <div className="flex flex-col gap-8 mt-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
      
      {/* Section Title */}
      <div className="flex items-center gap-3 justify-center md:justify-start">
        <div className="p-2 rounded-xl" style={{ background: 'var(--accent-muted)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <BookOpen className="w-5 h-5" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--fg)', letterSpacing: '-0.02em' }}>
          Understanding JoSAA Counselling
        </h2>
      </div>

      {/* Two cards/pages grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Institution Types */}
        <div 
          className="glass p-6 md:p-8 flex flex-col gap-5" 
          style={{ borderRadius: 'var(--radius-xl)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}>
              <Landmark className="w-5 h-5" style={{ color: '#38BDF8' }} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.2rem', color: 'var(--fg)' }}>
              Institution Types
            </h3>
          </div>
          
          <div className="flex flex-col gap-4">
            {[
              {
                title: 'IITs',
                fullName: 'Indian Institutes of Technology',
                desc: 'Premier institutions for engineering, admission is exclusively through the JEE Advanced exam.',
                count: 23,
                countLabel: 'IITs',
                color: '#EF4444',
                bg: 'rgba(239,68,68,0.08)'
              },
              {
                title: 'NITs',
                fullName: 'National Institutes of Technology',
                desc: 'Top-tier technical institutes with 50% of seats reserved under the Home State (HS) quota. Admission is through the JEE Main exam.',
                count: 31,
                countLabel: 'NITs',
                subLabel: '+ IIEST Shibpur',
                color: '#34D399',
                bg: 'rgba(16,185,129,0.08)'
              },
              {
                title: 'IIITs',
                fullName: 'Indian Institutes of Information Technology',
                desc: 'These institutes focus on Information Technology and related fields. Most admit students through JEE Main under an All India (AI) quota.',
                count: 26,
                countLabel: 'IIITs',
                color: '#38BDF8',
                bg: 'rgba(56,189,248,0.08)'
              },
              {
                title: 'GFTIs',
                fullName: 'Government Funded Technical Institutes',
                desc: 'A diverse group of Government Funded Technical Institutes funded by the government, admitting students through JEE Main.',
                count: 47,
                countLabel: 'Other-GFTIs',
                color: '#F59E0B',
                bg: 'rgba(245,158,11,0.08)'
              }
            ].map((inst) => (
              <div 
                key={inst.title} 
                className="flex gap-4 p-4 rounded-xl transition-all duration-200"
                style={{ 
                  background: 'rgba(255,255,255,0.01)', 
                  border: '1px solid var(--border)' 
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                }}
              >
                <div className="flex flex-col items-center justify-center min-w-[80px] sm:min-w-[90px]">
                  <span 
                    className="font-bold text-center w-full block whitespace-nowrap" 
                    style={{ 
                      background: inst.bg, 
                      color: inst.color, 
                      fontFamily: 'var(--font-mono)',
                      border: `1px solid ${inst.color}4D`,
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {inst.title}
                  </span>
                  
                  {/* Animated Count Badge */}
                  <div className="flex flex-col items-center mt-2 text-center" style={{ fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: inst.color, fontWeight: 700, fontSize: '1.1rem' }}>
                      <AnimatedCounter value={inst.count} />
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--fg)', fontFamily: 'var(--font-display)' }}>
                    {inst.fullName}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-fg)' }}>
                    {inst.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Admission Quotas Explained */}
        <div 
          className="glass p-6 md:p-8 flex flex-col gap-5" 
          style={{ borderRadius: 'var(--radius-xl)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Compass className="w-5 h-5" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.2rem', color: 'var(--fg)' }}>
              Admission Quotas Explained
            </h3>
          </div>
          
          <div className="flex flex-col gap-4">
            {[
              {
                tag: 'AI',
                fullName: 'All India Quota',
                desc: 'This quota is open to students from any state in India. It is the primary quota for all IITs and most IIITs.',
                color: '#A78BFA',
                bg: 'rgba(167,139,250,0.08)'
              },
              {
                tag: 'HS',
                fullName: 'Home State Quota',
                desc: 'Reserved for candidates who have completed their qualifying exam (Class 12th) from the same state where the institute (mainly NITs) is located. This significantly increases admission chances for local students.',
                color: '#F472B6',
                bg: 'rgba(244,114,182,0.08)'
              },
              {
                tag: 'OS',
                fullName: 'Other State Quota',
                desc: 'This applies to candidates applying to an institute (mainly NITs) located outside their home state.',
                color: '#FB7185',
                bg: 'rgba(251,113,133,0.08)'
              },
              {
                tag: 'GO, JK, LA',
                fullName: 'Special Quotas',
                desc: 'These are specific sub-quotas within the Home State quota for candidates from Goa, Jammu & Kashmir, and Ladakh, applicable at their respective NITs.',
                color: '#6EE7B7',
                bg: 'rgba(110,231,183,0.08)'
              }
            ].map((quota) => (
              <div 
                key={quota.tag} 
                className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200"
                style={{ 
                  background: 'rgba(255,255,255,0.01)', 
                  border: '1px solid var(--border)' 
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                }}
              >
                <div className="flex flex-col items-center justify-center min-w-[100px] sm:min-w-[110px]">
                  <span 
                    className="font-bold text-center w-full block whitespace-nowrap" 
                    style={{ 
                      background: quota.bg, 
                      color: quota.color, 
                      fontFamily: 'var(--font-mono)',
                      border: `1px solid ${quota.color}4D`,
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {quota.tag}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--fg)', fontFamily: 'var(--font-display)' }}>
                    {quota.fullName}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-fg)' }}>
                    {quota.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
