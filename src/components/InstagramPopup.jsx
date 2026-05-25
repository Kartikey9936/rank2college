import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function InstagramPopup({ onVerified, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleFollow = () => {
    window.open('https://instagram.com/rank2college', '_blank', 'noopener,noreferrer');
    onVerified();
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden animate-fade-up"
        style={{
          background: 'rgba(18, 18, 26, 0.98)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '1.25rem',
          boxShadow: '0 0 0 1px rgba(245,158,11,0.08), 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245,158,11,0.06)',
        }}
      >

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--muted-fg)' }}
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        )}

        {/* Amber glow header */}
        <div
          className="relative flex items-center justify-center"
          style={{
            height: '120px',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(251,191,36,0.06) 100%)',
            borderBottom: '1px solid rgba(245,158,11,0.12)',
          }}
        >
          {/* Background radial */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 120%, rgba(245,158,11,0.15) 0%, transparent 60%)',
            }}
          />
          {/* Icon container */}
          <div
            className="relative z-10 p-4 rounded-2xl"
            style={{
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.3)',
              boxShadow: '0 0 30px rgba(245,158,11,0.2)',
            }}
          >
            {/* Instagram icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-7 text-center">
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.25rem',
              color: 'var(--fg)',
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
            }}
          >
            One Quick Step!
          </h2>

          <p
            style={{
              color: 'rgba(250,250,250,0.6)',
              fontSize: '0.85rem',
              lineHeight: 1.7,
              marginBottom: '1.75rem',
            }}
          >
            Building this platform takes time and effort. A follow on Instagram costs you nothing,
            but it helps us grow and stay motivated!{' '}
            <br />
            Follow us to unlock{' '}
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Rank2College</span>.
          </p>

          {/* Follow button */}
          <button
            onClick={handleFollow}
            className="btn-primary w-full py-3.5 mb-4 flex items-center justify-center gap-2.5 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            Follow @rank2college
          </button>

          <p
            style={{
              color: 'rgba(113,113,122,0.7)',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.03em',
            }}
          >
            Your predictor unlocks instantly after following.
          </p>
        </div>
      </div>
    </div>
  );
}
