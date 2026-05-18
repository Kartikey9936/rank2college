import React, { useState, useEffect } from 'react';
import PredictorForm from './components/PredictorForm';
import ResultsTable from './components/ResultsTable';
import { predictColleges } from './utils/predictionLogic';
import { predictAKTU } from './utils/aktupredictionLogic';
import { GraduationCap, Sun, Moon, MessageCircle, X, Mail, Instagram, ChevronUp } from 'lucide-react';
import InstagramPopup from './components/InstagramPopup';



function App() {
  const [josaaData, setJosaaData] = useState(null);
  const [aktuData, setAktuData] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeTool, setActiveTool] = useState('jee-mains');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showInstaPopup, setShowInstaPopup] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

  const [filters, setFilters] = useState({
    rank: '', category: 'OPEN', gender: 'Gender-Neutral',
    quota: 'Both', instituteTypes: ['ALL'], branches: ['ALL'], isPwd: false,
    aktuRound: '1'
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear results when switching tools to prevent showing stale data
  useEffect(() => {
    setResults([]);
    setHasSearched(false);
  }, [activeTool]);

  useEffect(() => {
    fetch('/josaa_cutoffs.json')
      .then(res => res.json())
      .then(josaa => {
        setJosaaData(josaa);
        setIsDataLoading(false);
      })
      .catch(() => setIsDataLoading(false));
  }, []);

  const handlePredict = async () => {
    // If not verified, show popup instead of predicting
    if (!isVerified) {
      setShowInstaPopup(true);
      return;
    }

    if (activeTool !== 'aktu' && !josaaData) return;

    setIsPredicting(true);

    if (activeTool === 'aktu') {
      const round = filters.aktuRound;
      let dataForRound = aktuData[round];
      
      if (!dataForRound) {
        try {
          const res = await fetch(`/aktu_cutoffs_r${round}.json`);
          const raw = await res.json();
          // The JSON may be a plain array OR an object with one array-valued key
          if (Array.isArray(raw)) {
            dataForRound = raw;
          } else {
            // Find the first key whose value is an array
            const arrayKey = Object.keys(raw).find(k => Array.isArray(raw[k]));
            dataForRound = arrayKey ? raw[arrayKey] : [];
          }
          setAktuData(prev => ({ ...prev, [round]: dataForRound }));
        } catch (error) {
          console.error("Failed to load AKTU data for round", round, error);
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
    <div className="relative min-h-screen flex flex-col">
      {/* Instagram Popup */}
      {showInstaPopup && (
        <InstagramPopup
          onVerified={() => { setIsVerified(true); setShowInstaPopup(false); }}
          onClose={() => setShowInstaPopup(false)}
        />
      )}

      {/* Floating Support Button */}
      <div className="fixed bottom-40 right-6 z-40 flex flex-col items-end gap-2">
        {/* Chat bubble popup */}
        {showBubble && (
          <div className="relative flex items-center gap-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl rounded-br-none px-4 py-3 shadow-xl shadow-blue-500/30 max-w-[220px]">
            {/* Close bubble */}
            <button onClick={() => setShowBubble(false)} className="absolute -top-2 -right-2 w-5 h-5 bg-slate-700 hover:bg-slate-900 rounded-full flex items-center justify-center transition-colors">
              <X className="w-3 h-3 text-white" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-white/80 leading-tight mb-0.5">Are You Confused In Counselling?</p>
              <p className="text-sm font-bold leading-tight">Ask with IIT/NIT Experts</p>
            </div>
            {/* Bubble tail */}
            <div className="absolute -bottom-2 right-0 w-0 h-0" style={{ borderLeft: '8px solid transparent', borderTop: '8px solid #7c3aed' }} />
          </div>
        )}
        {/* Main floating button */}
        <a href="https://t.me/Kartik_nith" target="_blank" rel="noopener noreferrer" title="Ask us on Telegram" onClick={() => setShowBubble(false)} className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-xl shadow-blue-500/40 hover:scale-110 active:scale-95 transition-all">
          <MessageCircle className="w-7 h-7 text-white" strokeWidth={1.8} />
        </a>
      </div>
      {/* Dark mode orbs */}
      {isDark && <>
        <div className="orb w-96 h-96 bg-blue-600/20 top-[-100px] left-[-100px]" />
        <div className="orb w-80 h-80 bg-violet-600/15 top-[100px] right-[-80px]" />
        <div className="orb w-64 h-64 bg-emerald-500/10 bottom-[200px] left-[30%]" />
      </>}

      {/* ── TOP NAVIGATION ── */}
      <nav className="relative z-20 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl shadow-sm">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-black text-xl text-slate-900 dark:text-white">Rank<span className="text-blue-600">2</span>College</span>
              </div>
            </div>

            {/* Tool Tabs removed from navbar — now inside form */}

            {/* Dark / Light toggle */}
            <button onClick={() => setIsDark(prev => !prev)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 font-medium text-sm
                dark:bg-white/10 dark:border-white/20 dark:text-white/80 dark:hover:bg-white/15
                bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200">
              {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
              <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          {/* Mobile tool tabs removed from navbar */}
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-14">

        {/* Page Hero */}
        <header className="text-center mb-12 animate-fade-slide-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
            Find Your Best <span className="text-blue-600">College</span><br />
            <span className="text-blue-600">Options</span>
          </h1>
        </header>

        {/* Loading */}
        {isDataLoading ? (
          <div className="glass rounded-3xl p-16 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-white/10 border-t-blue-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-slate-100 dark:border-white/5 border-t-violet-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.75s' }} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Loading Database</h3>
            <p className="text-slate-500 dark:text-white/50 max-w-md">Initializing the prediction engine with JoSAA cutoff data...</p>
          </div>
        ) : (
          <main className="space-y-6 animate-fade-slide-up" style={{ animationDelay: '0.1s' }}>
            <PredictorForm filters={filters} setFilters={setFilters} onPredict={handlePredict} isLoading={isPredicting} activeTool={activeTool} setActiveTool={setActiveTool} />

            <ResultsTable results={results} hasSearched={hasSearched} />
          </main>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-black text-slate-800 dark:text-white">Rank2College</span>
              </div>
            </div>


            {/* Links */}
            <div className="flex items-center gap-4">
              <a href="mailto:kartikeykesharwani9936@gmail.com" title="Email Us"
                className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-500 transition-colors shadow-sm">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/rank2college" target="_blank" rel="noopener noreferrer" title="Instagram"
                className="p-2 rounded-full bg-pink-100 text-pink-500 hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:text-white dark:bg-pink-500/10 transition-colors shadow-sm">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://github.com/Kartikey9936/rank2college" target="_blank" rel="noopener noreferrer" title="GitHub"
                className="p-2 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-800 hover:text-white dark:bg-white/10 dark:text-white/70 dark:hover:bg-white dark:hover:text-slate-900 transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
              <span className="text-slate-400 dark:text-white/20 text-xs ml-2">© 2025 Rank2College</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 z-50 animate-fade-slide-up flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

export default App;
