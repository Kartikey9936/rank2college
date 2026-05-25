import React, { useState, useEffect } from 'react';
import PredictorForm from './components/PredictorForm';
import ResultsTable from './components/ResultsTable';
import { predictColleges } from './utils/predictionLogic';
import { predictAKTU } from './utils/aktupredictionLogic';
import { GraduationCap, MessageCircle, X, Mail, Instagram, ChevronUp, Menu } from 'lucide-react';
import InstagramPopup from './components/InstagramPopup';
import CounsellingInfo from './components/CounsellingInfo';
import AboutSection from './components/AboutSection';

function App() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [josaaData, setJosaaData]         = useState(null);
  const [aktuData, setAktuData]           = useState({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isPredicting, setIsPredicting]   = useState(false);
  const [results, setResults]             = useState([]);
  const [hasSearched, setHasSearched]     = useState(false);
  const [activeTool, setActiveTool]       = useState('jee-mains');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showInstaPopup, setShowInstaPopup] = useState(false);
  const [isVerified, setIsVerified]       = useState(true); // TODO: set back to false to re-enable popup
  const [showBubble, setShowBubble]       = useState(true);

  const [filters, setFilters] = useState({
    rank: '', category: 'OPEN', gender: 'Gender-Neutral',
    quota: 'Both', instituteTypes: ['ALL'], branches: ['ALL'], isPwd: false,
    aktuRound: '1'
  });

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    setResults([]);
    setHasSearched(false);
  }, [activeTool]);

  useEffect(() => {
    fetch('/josaa_cutoffs.json')
      .then(res => res.json())
      .then(josaa => { setJosaaData(josaa); setIsDataLoading(false); })
      .catch(() => setIsDataLoading(false));
  }, []);

  const handlePredict = async () => {
    if (!isVerified) { setShowInstaPopup(true); return; }
    if (activeTool !== 'aktu' && !josaaData) return;

    setIsPredicting(true);

    if (activeTool === 'aktu') {
      const round = filters.aktuRound;
      let dataForRound = aktuData[round];

      if (!dataForRound) {
        try {
          const res = await fetch(`/aktu_cutoffs_r${round}.json`);
          const raw = await res.json();
          if (Array.isArray(raw)) {
            dataForRound = raw;
          } else {
            const arrayKey = Object.keys(raw).find(k => Array.isArray(raw[k]));
            dataForRound = arrayKey ? raw[arrayKey] : [];
          }
          setAktuData(prev => ({ ...prev, [round]: dataForRound }));
        } catch (error) {
          console.error('Failed to load AKTU data for round', round, error);
          setIsPredicting(false);
          return;
        }
      }

      setTimeout(() => {
        const predictions = predictAKTU(dataForRound, filters);
        setResults(predictions);
        setHasSearched(true);
        setIsPredicting(false);
      }, 150);
    } else {
      setTimeout(() => {
        const predictions = predictColleges(josaaData, filters, activeTool);
        setResults(predictions);
        setHasSearched(true);
        setIsPredicting(false);
      }, 150);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* ── AMBIENT BACKGROUND ORBS ── */}
      <div
        className="orb"
        style={{
          width: 'clamp(300px, 50vw, 600px)',
          height: 'clamp(300px, 50vw, 600px)',
          background: 'radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      <div
        className="orb"
        style={{
          width: 'clamp(200px, 30vw, 400px)',
          height: 'clamp(200px, 30vw, 400px)',
          background: 'radial-gradient(circle, rgba(245,158,11,0.03) 0%, transparent 70%)',
          filter: 'blur(100px)',
          bottom: '10%',
          right: '-5%',
        }}
      />

      {/* ── INSTAGRAM POPUP ── */}
      {showInstaPopup && (
        <InstagramPopup
          onVerified={() => { setIsVerified(true); setShowInstaPopup(false); }}
          onClose={() => setShowInstaPopup(false)}
        />
      )}

      {/* ── FLOATING SUPPORT BUTTON ── */}
      <div className="fixed bottom-28 right-5 z-40 flex flex-col items-end gap-3">
        {showBubble && (
          <div className="relative flex items-center gap-3 px-4 py-3 max-w-[210px] rounded-2xl rounded-br-none"
            style={{
              background: 'rgba(26,26,36,0.95)',
              border: '1px solid rgba(245,158,11,0.25)',
              boxShadow: '0 0 20px rgba(245,158,11,0.12)',
              backdropFilter: 'blur(12px)',
            }}>
            <button
              onClick={() => setShowBubble(false)}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              <X className="w-3 h-3" style={{ color: 'var(--muted-fg)' }} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-xs leading-tight mb-0.5" style={{ color: 'var(--muted-fg)' }}>Confused in Counselling?</p>
              <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--fg)', fontFamily: 'var(--font-display)' }}>Ask IIT/NIT Experts</p>
            </div>
            <div className="absolute -bottom-2 right-0 w-0 h-0"
              style={{ borderLeft: '8px solid transparent', borderTop: '8px solid rgba(245,158,11,0.4)' }} />
          </div>
        )}
        <a
          href="https://t.me/Kartik_nith"
          target="_blank"
          rel="noopener noreferrer"
          title="Ask us on Telegram"
          onClick={() => setShowBubble(false)}
          className="w-13 h-13 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{
            width: '52px', height: '52px',
            background: 'var(--accent-muted)',
            border: '1px solid rgba(245,158,11,0.35)',
            boxShadow: '0 0 20px rgba(245,158,11,0.2)',
          }}
        >
          <MessageCircle className="w-6 h-6" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
        </a>
      </div>

      {/* ── TOP NAVIGATION ── */}
      <nav
        className="relative z-20 sticky top-0"
        style={{
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg flex items-center justify-center"
                style={{
                  background: 'var(--accent-muted)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  boxShadow: 'var(--glow-sm)',
                }}
              >
                <GraduationCap className="w-4 h-4" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--fg)' }}>
                Rank<span style={{ color: 'var(--accent)' }}>2</span>College
              </span>
            </div>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-6">
              {[
                { label: 'Predictor', id: 'predictor' },
                { label: 'About', id: 'about' },
                { label: 'JoSAA', id: 'josaa' },
                { label: 'Contact', id: 'contact' },
              ].map(link => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.id)}
                  className="text-xs transition-colors hover:text-white"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted-fg)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex md:hidden p-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg)' }}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {showMobileMenu && (
          <div 
            className="md:hidden flex flex-col gap-4 py-4 px-6 border-t animate-fade-down"
            style={{ 
              borderColor: 'var(--border)', 
              background: 'rgba(10,10,15,0.98)', 
              backdropFilter: 'blur(20px)' 
            }}
          >
            {[
              { label: 'Predictor', id: 'predictor' },
              { label: 'About', id: 'about' },
              { label: 'JoSAA', id: 'josaa' },
              { label: 'Contact', id: 'contact' },
            ].map(link => (
              <button
                key={link.label}
                onClick={() => {
                  setShowMobileMenu(false);
                  setTimeout(() => {
                    scrollToSection(link.id);
                  }, 50);
                }}
                className="text-xs py-2 text-left transition-colors hover:text-white"
                style={{
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-fg)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-6 md:px-8 py-12 md:py-16">

        {/* Page Hero */}
        <header className="text-center mb-12 animate-fade-up">
          {/* Trust badge */}
          <div
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-6"
            style={{
              background: 'rgba(10,10,15,0.8)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 0 16px rgba(52,211,153,0.15), 0 0 40px rgba(52,211,153,0.06)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-green"
              style={{ background: 'rgb(52,211,153)', display: 'inline-block', flexShrink: 0 }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(250,250,250,0.75)', letterSpacing: '0.07em' }}>
              TRUSTED BY 1 LAKH+ JEE ASPIRANTS
            </span>
          </div>

          <h1
            className="mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 6vw, 4rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: 'var(--fg)',
            }}
          >
            Find Your Best{' '}
            <span className="text-gradient-amber">College Options</span>
          </h1>

          <p style={{ color: 'var(--muted-fg)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Enter your JEE rank and get personalised college predictions based on real cutoff data.
          </p>
        </header>

        {/* Loading state */}
        {isDataLoading ? (
          <div
            className="glass rounded-2xl flex flex-col items-center justify-center p-20 text-center animate-fade-up"
            style={{ minHeight: '360px' }}
          >
            <div className="relative mb-6">
              <div
                className="w-14 h-14 rounded-full animate-spin-slow"
                style={{
                  border: '2px solid var(--border)',
                  borderTopColor: 'var(--accent)',
                }}
              />
              <div
                className="absolute inset-2 rounded-full"
                style={{
                  border: '2px solid transparent',
                  borderTopColor: 'rgba(245,158,11,0.3)',
                  animation: 'spin 0.8s linear infinite reverse',
                }}
              />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.2rem', color: 'var(--fg)', marginBottom: '0.5rem' }}>
              Loading Database
            </h3>
            <p style={{ color: 'var(--muted-fg)', fontSize: '0.875rem', maxWidth: '320px' }}>
              Initializing the prediction engine with JoSAA cutoff data…
            </p>
          </div>
        ) : (
          <main id="predictor" className="flex flex-col gap-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <PredictorForm
              filters={filters}
              setFilters={setFilters}
              onPredict={handlePredict}
              isLoading={isPredicting}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
            />
            <ResultsTable results={results} hasSearched={hasSearched} />
            <div id="about">
              <AboutSection />
            </div>
            <div id="josaa">
              <CounsellingInfo />
            </div>
          </main>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer
        id="contact"
        className="relative z-10 mt-auto"
        style={{
          borderTop: '1px solid var(--border)',
          background: 'rgba(18,18,26,0.8)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div
                className="p-1.5 rounded-md"
                style={{ background: 'var(--accent-muted)', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                <GraduationCap className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--fg)', fontSize: '0.9rem' }}>
                Rank2College
              </span>
              <span style={{ color: 'var(--muted-fg)', fontSize: '0.75rem' }}>© 2025</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="mailto:kartikeykesharwani9936@gmail.com"
                title="Email Us"
                className="p-2.5 rounded-lg transition-all hover:scale-105"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: 'rgb(248,113,113)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(239,68,68,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.boxShadow = ''; }}
              >
                <Mail className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href="https://instagram.com/rank2college"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="p-2.5 rounded-lg transition-all hover:scale-105"
                style={{
                  background: 'rgba(236,72,153,0.1)',
                  border: '1px solid rgba(236,72,153,0.2)',
                  color: 'rgb(244,114,182)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(236,72,153,0.2)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(236,72,153,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(236,72,153,0.1)'; e.currentTarget.style.boxShadow = ''; }}
              >
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a
                href="https://github.com/Kartikey9936/rank2college"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="p-2.5 rounded-lg transition-all hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  color: 'var(--muted-fg)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--fg)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--muted-fg)'; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                  <path d="M9 18c-4.51 2-5-2-7-2"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-5 p-3 rounded-full z-50 transition-all hover:scale-110 active:scale-95 animate-fade-up"
          style={{
            background: 'var(--accent-muted)',
            border: '1px solid rgba(245,158,11,0.35)',
            color: 'var(--accent)',
            boxShadow: 'var(--glow-sm)',
          }}
        >
          <ChevronUp className="w-5 h-5" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}

export default App;
