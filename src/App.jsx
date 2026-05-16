import React, { useState, useEffect } from 'react';
import PredictorForm from './components/PredictorForm';
import ResultsTable from './components/ResultsTable';
import { predictColleges } from './utils/predictionLogic';
import { GraduationCap, Sun, Moon, AlertCircle, CheckCircle, Zap, Target } from 'lucide-react';

function App() {
  const [data, setData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const [filters, setFilters] = useState({
    rank: '', category: 'OPEN', gender: 'Gender-Neutral',
    quota: 'Both', instituteTypes: ['ALL'], branches: ['ALL']
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    fetch('/josaa_cutoffs.json')
      .then(res => res.json())
      .then(jsonData => { setData(jsonData); setIsDataLoading(false); })
      .catch(() => setIsDataLoading(false));
  }, []);

  const handlePredict = () => {
    if (!data) return;
    setIsPredicting(true);
    setTimeout(() => {
      const predictions = predictColleges(data, filters);
      setResults(predictions); setHasSearched(true); setIsPredicting(false);
    }, 150);
  };

  const safeCount = results.filter(r => r.Chances === 'SAFE').length;
  const moderateCount = results.filter(r => r.Chances === 'MODERATE').length;
  const reachCount = results.filter(r => r.Chances === 'REACH').length;

  return (
    <div className="relative min-h-screen">
      {/* Orbs — dark only */}
      {isDark && <>
        <div className="orb w-96 h-96 bg-blue-600/20 top-[-100px] left-[-100px]" />
        <div className="orb w-80 h-80 bg-violet-600/15 top-[100px] right-[-80px]" />
        <div className="orb w-64 h-64 bg-emerald-500/10 bottom-[200px] left-[30%]" />
      </>}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

        {/* Toggle button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsDark(prev => !prev)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 font-medium text-sm
              dark:bg-white/10 dark:border-white/20 dark:text-white/80 dark:hover:bg-white/15
              bg-white/80 border-slate-200 text-slate-600 hover:bg-white shadow-sm"
          >
            {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* Header */}
        <header className="text-center mb-14 animate-fade-slide-up">
          <div className="flex items-center justify-center mb-5">
            <div className="relative animate-float">
              <div className="absolute inset-0 bg-blue-500/40 rounded-3xl blur-xl" />
              <div className="relative bg-gradient-to-br from-blue-500 to-violet-600 p-5 rounded-3xl border border-white/20 shadow-2xl">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4">
            <span className="text-gradient">Rank2College</span>
          </h1>
          <p className="text-slate-500 dark:text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Enter your rank and instantly discover your best college options across
            <span className="text-slate-700 dark:text-white/90 font-semibold"> NITs, IIITs &amp; GFTIs</span>
          </p>
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
            <PredictorForm filters={filters} setFilters={setFilters} onPredict={handlePredict} isLoading={isPredicting} />

            {/* Summary cards */}
            {hasSearched && results.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Safe', count: safeCount, Icon: CheckCircle, bg: 'bg-emerald-500/10 dark:bg-emerald-500/10', border: 'border-emerald-400/30', text: 'text-emerald-600 dark:text-emerald-400', iconColor: 'text-emerald-500' },
                  { label: 'Moderate', count: moderateCount, Icon: Zap, bg: 'bg-amber-500/10', border: 'border-amber-400/30', text: 'text-amber-600 dark:text-amber-400', iconColor: 'text-amber-500' },
                  { label: 'Reach', count: reachCount, Icon: Target, bg: 'bg-rose-500/10', border: 'border-rose-400/30', text: 'text-rose-600 dark:text-rose-400', iconColor: 'text-rose-500' },
                ].map(({ label, count, Icon, bg, border, text, iconColor }) => (
                  <div key={label} className={`${bg} border ${border} rounded-2xl p-4 md:p-6 text-center backdrop-blur-sm`}>
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${iconColor}`} />
                    <div className={`text-3xl md:text-4xl font-black ${text}`}>{count}</div>
                    <div className="text-slate-500 dark:text-white/60 text-sm font-medium mt-1">{label} Colleges</div>
                  </div>
                ))}
              </div>
            )}

            <ResultsTable results={results} hasSearched={hasSearched} />
          </main>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 pb-8">
          <div className="inline-flex items-center gap-2 text-slate-400 dark:text-white/30 text-xs bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 py-3 px-6 rounded-full">
            <AlertCircle className="w-3.5 h-3.5" />
            Predictions based on historical JoSAA 2025 data. Actual cutoffs may vary.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
