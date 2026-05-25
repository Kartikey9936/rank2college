import React from 'react';
import { ChevronDown, Trophy, Users, MapPin, Layers } from 'lucide-react';

const CATEGORIES      = ['OPEN', 'OBC-NCL', 'SC', 'ST', 'EWS'];
const AKTU_CATEGORIES = ['SC','ST','BC','EWS(OPEN)','OPEN','EWS(GL)','SC(Girl)','OPEN(GIRL)','BC(Girl)','OPEN(TF)','BC(PH)','BC(AF)','OPEN(AF)','OPEN(PH)'];
const GENDERS         = ['Gender-Neutral', 'Female-only (including Supernumerary)'];
const QUOTAS          = ['HS', 'OS', 'Both'];
const INSTITUTE_TYPES = ['NIT', 'IIIT', 'GFTI', 'ALL'];
const BRANCHES        = ['CSE', 'ECE', 'ME', 'CE', 'EE', 'ALL'];

const SelectField = ({ id, label, name, value, onChange, icon: Icon, children }) => (
  <div className="flex flex-col gap-2">
    <label
      htmlFor={id}
      className="flex items-center gap-1.5"
      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-fg)' }}
    >
      {Icon && <Icon className="w-3.5 h-3.5" style={{ color: 'var(--accent)', opacity: 0.85 }} strokeWidth={1.5} />}
      {label}
    </label>
    <div className="relative">
      <select
        id={id} name={name} value={value} onChange={onChange}
        className="input-field w-full px-3 appearance-none cursor-pointer"
        style={{ paddingRight: '2rem', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500 }}
      >
        {children}
      </select>
      <ChevronDown
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none w-3.5 h-3.5"
        style={{ color: 'var(--muted-fg)' }}
        strokeWidth={1.5}
      />
    </div>
  </div>
);

const TOOLS = [
  { id: 'jee-mains',   label: 'JEE Mains',   active: true },
  { id: 'jee-advance', label: 'JEE Advanced', active: true },
  { id: 'aktu',        label: 'AKTU',         active: true },
  { id: 'mhtcet',      label: 'MHT-CET',      active: false },
];

const TOOL_DESCRIPTIONS = {
  'jee-mains':   'Predict NITs, IIITs & GFTIs using your JEE Main Category Rank.',
  'jee-advance': 'Predict IITs using your JEE Advanced Category Rank.',
  'aktu':        'Predict AKTU affiliated colleges using your JEE Main CRL Rank.',
};

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
      {/* ── Choose Counselling ── */}
      <div
        className="glass rounded-2xl p-5 md:p-6"
        style={{ borderRadius: 'var(--radius-xl)' }}
      >
        <p className="label-mono mb-4">Choose Counselling</p>
        <div className="flex items-center gap-2 flex-wrap">
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              disabled={!tool.active}
              onClick={() => tool.active && setActiveTool(tool.id)}
              className={
                !tool.active
                  ? 'tab-disabled flex items-center gap-2 px-4 py-2 text-sm'
                  : activeTool === tool.id
                  ? 'tab-active flex items-center gap-2 px-4 py-2 text-sm'
                  : 'tab-inactive flex items-center gap-2 px-4 py-2 text-sm'
              }
            >
              {!tool.active && (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              )}
              {tool.label}
              {!tool.active && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(113,113,122,0.15)', color: 'rgba(113,113,122,0.5)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
                >
                  SOON
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Info Banner ── */}
      <div
        className="flex items-start gap-3 px-5 py-4 rounded-xl"
        style={{
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.18)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div
          className="w-1 self-stretch rounded-full flex-shrink-0"
          style={{ background: 'var(--accent)', minHeight: '16px', boxShadow: 'var(--glow-sm)' }}
        />
        <p style={{ color: 'rgba(250,250,250,0.75)', fontSize: '0.8rem', lineHeight: 1.6 }}>
          {TOOL_DESCRIPTIONS[activeTool] ?? ''}
        </p>
      </div>

      {/* ── Your Profile ── */}
      <div className="glass rounded-2xl p-5 md:p-6" style={{ borderRadius: 'var(--radius-xl)' }}>

        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-0.5 h-5 rounded-full" style={{ background: 'var(--accent)', boxShadow: 'var(--glow-sm)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--fg)' }}>
            Your Profile
          </span>
        </div>

        {/* Profile grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rank input */}
          <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-1">
            <label
              htmlFor="rank"
              className="flex items-center gap-1.5"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-fg)' }}
            >
              <Trophy className="w-3.5 h-3.5" style={{ color: 'var(--accent)', opacity: 0.85 }} strokeWidth={1.5} />
              {activeTool === 'aktu' ? 'JEE Main CRL Rank' : activeTool === 'jee-advance' ? 'JEE Adv. Category Rank' : 'Category Rank'}
            </label>
            <input
              type="number"
              id="rank"
              name="rank"
              className="input-field px-3 text-center font-bold"
              style={{ fontSize: '1.125rem', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}
              placeholder="e.g. 15000"
              value={filters.rank}
              onChange={handleChange}
              onWheel={e => e.target.blur()}
              min="1"
            />
          </div>

          <SelectField id="category" label="Seat Type / Category" name="category" value={filters.category} onChange={handleChange} icon={Users}>
            {currentCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </SelectField>

          {activeTool === 'aktu' && (
            <SelectField id="aktuRound" label="Counselling Round" name="aktuRound" value={filters.aktuRound} onChange={handleChange} icon={Layers}>
              {['1','2','3','4','6','7'].map(r => <option key={r} value={r}>Round {r}</option>)}
            </SelectField>
          )}

          {activeTool !== 'aktu' && (
            <SelectField id="gender" label="Gender" name="gender" value={filters.gender} onChange={handleChange} icon={Users}>
              {GENDERS.map(g => <option key={g} value={g}>{g === 'Gender-Neutral' ? 'Gender-Neutral' : 'Female Only'}</option>)}
            </SelectField>
          )}

          {activeTool === 'jee-mains' && (
            <SelectField id="quota" label="Quota" name="quota" value={filters.quota} onChange={handleChange} icon={MapPin}>
              {QUOTAS.map(q => (
                <option key={q} value={q}>
                  {q === 'OS' ? 'Other State / All India' : q === 'HS' ? 'Home State (HS)' : 'All Quotas (HS/OS/AI)'}
                </option>
              ))}
            </SelectField>
          )}
        </div>

        {/* PwD checkbox */}
        {activeTool !== 'aktu' && (
          <div className="mt-4">
            <label className="inline-flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                name="isPwd"
                checked={filters.isPwd}
                onChange={e => setFilters(prev => ({ ...prev, isPwd: e.target.checked }))}
                className="w-4 h-4 cursor-pointer rounded"
                style={{ accentColor: 'var(--accent)' }}
              />
              <span
                className="text-xs font-medium group-hover:text-white transition-colors"
                style={{ color: 'var(--muted-fg)', fontFamily: 'var(--font-body)' }}
              >
                Person with Disability (PwD)
              </span>
            </label>
          </div>
        )}

        {/* Divider */}
        <div className="divider my-5" />

        {/* Multi-selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTool === 'jee-mains' && (
            <div className="flex flex-col gap-3">
              <p className="label-mono">Institute Type</p>
              <div className="flex flex-wrap gap-2">
                {INSTITUTE_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleMultiSelect('instituteTypes', type)}
                    className={`px-4 py-2 ${filters.instituteTypes.includes(type) ? 'chip-active' : 'chip-inactive'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <p className="label-mono">
              Branch Preference{' '}
              <span style={{ color: 'rgba(113,113,122,0.6)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {BRANCHES.map(branch => (
                <button
                  key={branch}
                  type="button"
                  onClick={() => toggleMultiSelect('branches', branch)}
                  className={`px-4 py-2 ${filters.branches.includes(branch) ? 'chip-active' : 'chip-inactive'}`}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Predict button */}
        <button
          className="btn-primary w-full mt-6 py-3.5 text-sm"
          onClick={onPredict}
          disabled={isLoading || !filters.rank}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin-slow h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing colleges…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Find My Colleges
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m5 12 14 0M12 5l7 7-7 7"/>
              </svg>
            </span>
          )}
        </button>

        <p
          className="text-center mt-4"
          style={{ color: 'rgba(113,113,122,0.6)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
        >
          * PREDICTIONS ARE BASED ON PREVIOUS YEAR CUTOFFS
        </p>
      </div>
    </>
  );
}
