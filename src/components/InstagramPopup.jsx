import React, { useEffect } from 'react';

export default function InstagramPopup({ onVerified }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleFollow = () => {
    window.open('https://instagram.com/rank2college', '_blank', 'noopener,noreferrer');
    onVerified();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10">

        {/* Blue header matching app's color scheme */}
        <div className="relative h-32 bg-blue-600 flex items-center justify-center">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative z-10 bg-white/20 backdrop-blur p-4 rounded-2xl border border-white/30 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-3">
            One Quick Step!
          </h2>

          <p className="text-slate-700 dark:text-white/90 text-sm leading-relaxed mb-6">
            Building this platform takes time and effort. A follow on Instagram costs you nothing,
            but it helps us grow and stay motivated!
            Follow us on Instagram to unlock{' '}
            <span className="font-bold text-blue-600">Rank2College</span>.
          </p>

          {/* Follow button — matches app's btn-primary */}
          <button
            onClick={handleFollow}
            className="btn-primary w-full py-3.5 rounded-xl font-bold text-white text-sm
              flex items-center justify-center gap-2.5 mb-3 active:scale-95 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            Follow @rank2college
          </button>

          <p className="text-slate-500 dark:text-white/50 text-xs">
            After following, your predictor will be unlocked instantly.
          </p>
        </div>
      </div>
    </div>
  );
}
