import React from 'react';
import { ChevronDown } from 'lucide-react';

const CATEGORIES = ['OPEN', 'OBC-NCL', 'SC', 'ST', 'EWS'];
const AKTU_CATEGORIES = ['SC', 'ST', 'BC', 'EWS(OPEN)', 'OPEN', 'EWS(GL)', 'SC(Girl)', 'OPEN(GIRL)', 'BC(Girl)', 'OPEN(TF)', 'BC(PH)', 'BC(AF)', 'OPEN(AF)', 'OPEN(PH)'];
const GENDERS = ['Gender-Neutral', 'Female-only (including Supernumerary)'];
const QUOTAS = ['HS', 'OS', 'Both'];
const INSTITUTE_TYPES = ['NIT', 'IIIT', 'GFTI', 'ALL'];
const BRANCHES = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'ALL'];

const SelectField = ({ id, label, name, value, onChange, children }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-slate-500 dark:text-white/70 text-[10px] font-semibold uppercase tracking-wider">{label}</label>
    <div className="relative">
      <select id={id} name={name} value={value} onChange={onChange}
        className="input-field w-full px-3 py-2.5 rounded-lg appearance-none pr-8 font-medium text-sm cursor-pointer">
        {children}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-white/40 pointer-events-none" />
    </div>
  </div>
);

export default function PredictorForm({ filters, setFilters, onPredict, isLoading, activeTool, setActiveTool }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const toggleMultiSelect = (field, value) => {
    setFilters(prev => {
      const current = prev[field];
      if (value === 'ALL') return { ...prev, [field]: ['ALL'] };
      let updated = current.includes(value)
        ? current.filter(i => i !== value)
        : [...current.filter(i => i !== 'ALL'), value];
      if (updated.length === 0) updated = ['ALL'];
      return { ...prev, [field]: updated };
    });
  };

  const currentCategories = activeTool === 'aktu' ? AKTU_CATEGORIES : CATEGORIES;

  return (
    <>
      {/* ── Choose Counselling Card ── */}
      <div className="glass rounded-2xl p-4 md:p-6">
        <h2 className="text-slate-900 dark:text-white font-bold text-base mb-4">Choose Counselling</h2>
        <div className="flex items-center gap-2 flex-wrap">
        {[
          { id: 'jee-mains', label: 'JEE Mains', active: true },
          { id: 'jee-advance', label: 'JEE Advance', active: true },
          { id: 'aktu', label: 'AKTU', active: true },
          { id: 'mhtcet', label: 'MHT-CET', active: false },
        ].map(tool => (
          <button key={tool.id}
            disabled={!tool.active}
            onClick={() => tool.active && setActiveTool(tool.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
              ${!tool.active
                ? 'text-slate-400 dark:text-white/30 bg-slate-100 dark:bg-white/5 cursor-not-allowed'
                : activeTool === tool.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-white/60 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15'
              }`}>
            {!tool.active && (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            )}
            {tool.label}
            {!tool.active && <span className="text-[10px] bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-white/30 px-1.5 py-0.5 rounded-full">Soon</span>}
          </button>
        ))}
        </div>
      </div>

      {/* ── Profile Card ── */}
      <div className="glass rounded-2xl p-4 md:p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 bg-blue-600 rounded-full" />
          <h2 className="text-slate-800 dark:text-white font-bold text-sm">Your Profile</h2>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-1">
          <label htmlFor="rank" className="text-slate-500 dark:text-white/70 text-[10px] font-semibold uppercase tracking-wider">Category Rank</label>
          <input type="number" id="rank" name="rank"
            className="input-field px-3 py-2.5 rounded-lg font-bold text-base text-center"
            placeholder="e.g. 15000" value={filters.rank} onChange={handleChange} min="1" />
        </div>

        <SelectField id="category" label="Seat Type / Category" name="category" value={filters.category} onChange={handleChange}>
          {currentCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </SelectField>

        {activeTool !== 'aktu' && (
          <SelectField id="gender" label="Gender" name="gender" value={filters.gender} onChange={handleChange}>
            {GENDERS.map(g => <option key={g} value={g}>{g === 'Gender-Neutral' ? 'Gender-Neutral' : 'Female Only'}</option>)}
          </SelectField>
        )}

        {activeTool === 'jee-mains' && (
          <SelectField id="quota" label="Quota" name="quota" value={filters.quota} onChange={handleChange}>
            {QUOTAS.map(q => (
              <option key={q} value={q}>
                {q === 'OS' ? 'Other State / All India' : q === 'HS' ? 'Home State (HS)' : 'All Quotas (HS/OS/AI)'}
              </option>
            ))}
          </SelectField>
        )}
      </div>

      {activeTool !== 'aktu' && (
        <div className="mt-4 flex items-center">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isPwd" checked={filters.isPwd}
              onChange={(e) => setFilters(prev => ({ ...prev, isPwd: e.target.checked }))}
              className="w-4 h-4 rounded border-2 border-slate-300 dark:border-white/20 text-blue-600 cursor-pointer" />
            <span className="text-slate-700 dark:text-white/90 text-xs font-semibold">Person with Disability (PwD)</span>
          </label>
        </div>
      )}

      <div className="border-t border-slate-200 dark:border-white/10 my-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {activeTool === 'jee-mains' && (
          <div className="flex flex-col gap-3">
            <label className="text-slate-500 dark:text-white/70 text-xs font-semibold uppercase tracking-wider">Institute Type</label>
            <div className="flex flex-wrap gap-2">
              {INSTITUTE_TYPES.map(type => (
                <button key={type} type="button"
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${filters.instituteTypes.includes(type) ? 'chip-active' : 'chip-inactive'}`}
                  onClick={() => toggleMultiSelect('instituteTypes', type)}>
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <label className="text-slate-500 dark:text-white/70 text-xs font-semibold uppercase tracking-wider">
            Branch Preference <span className="text-slate-400 dark:text-white/40 normal-case font-normal">(Optional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {BRANCHES.map(branch => (
              <button key={branch} type="button"
                className={`px-4 py-2 rounded-full text-sm font-semibold ${filters.branches.includes(branch) ? 'chip-active' : 'chip-inactive'}`}
                onClick={() => toggleMultiSelect('branches', branch)}>
                {branch}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="btn-primary w-full mt-5 text-white font-bold text-sm py-3 rounded-xl
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        onClick={onPredict} disabled={isLoading || !filters.rank}>
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Analyzing Colleges...
          </span>
        ) : 'Find My Colleges'}
      </button>
      </div>
    </>
  );
}
