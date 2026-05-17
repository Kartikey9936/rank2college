import React, { useState, useMemo } from 'react';
import { Search, FileText, ChevronUp, ChevronDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CHANCE_STYLES = {
  SAFE:     { badge: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30', row: 'hover:bg-emerald-50 dark:hover:bg-emerald-500/5' },
  MODERATE: { badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30',   row: 'hover:bg-amber-50 dark:hover:bg-amber-500/5' },
  REACH:    { badge: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30',           row: 'hover:bg-rose-50 dark:hover:bg-rose-500/5' },
};

const TAB_ACTIVE = {
  ALL:      'text-slate-800 dark:text-white border-slate-300 dark:border-white/30 bg-white dark:bg-white/10',
  SAFE:     'text-emerald-700 dark:text-emerald-300 border-emerald-400/40 bg-emerald-50 dark:bg-emerald-500/10',
  MODERATE: 'text-amber-700 dark:text-amber-300 border-amber-400/40 bg-amber-50 dark:bg-amber-500/10',
  REACH:    'text-rose-700 dark:text-rose-300 border-rose-400/40 bg-rose-50 dark:bg-rose-500/10',
};

export default function ResultsTable({ results, hasSearched }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'Closing Rank', direction: 'asc' });

  const handleSort = (key) => setSortConfig(prev => ({
    key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
  }));

  const filtered = useMemo(() => {
    let data = [...results];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(i => i.Institute.toLowerCase().includes(q) || i['Academic Program Name'].toLowerCase().includes(q));
    }
    data.sort((a, b) => {
      let av = a[sortConfig.key], bv = b[sortConfig.key];
      if (sortConfig.key.includes('Rank')) { av = parseInt(av); bv = parseInt(bv); }
      if (av < bv) return sortConfig.direction === 'asc' ? -1 : 1;
      if (av > bv) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [results, searchQuery, sortConfig]);

  const downloadPDF = () => {
    if (!filtered.length) return;
    const doc = new jsPDF();
    doc.setFontSize(20); doc.setTextColor(37, 99, 235);
    doc.text('Rank2College.com Priority List', 14, 22);
    doc.setFontSize(10); doc.setTextColor(100, 116, 139);

    autoTable(doc, {
      head: [['Institute', 'Branch', 'Quota', 'Category', 'Closing Rank', 'Chances']],
      body: filtered.map(i => [i.Institute, i['Academic Program Name'].split('(')[0].trim(), i.Quota, i['Seat Type'], i['Closing Rank'], i.Chances]),
      startY: 37,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 50 } },
    });
    doc.save('College_Priority_List.pdf');
  };

  const counts = { ALL: results.length, SAFE: results.filter(r => r.Chances === 'SAFE').length, MODERATE: results.filter(r => r.Chances === 'MODERATE').length, REACH: results.filter(r => r.Chances === 'REACH').length };

  const SortIcon = ({ col }) => sortConfig.key !== col
    ? <ChevronUp className="w-3.5 h-3.5 opacity-20" />
    : sortConfig.direction === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />;

  if (!hasSearched) {
    return (
      <div className="glass rounded-3xl flex flex-col items-center justify-center p-16 text-center min-h-[360px]">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-5">
          <Search className="w-9 h-9 text-slate-300 dark:text-white/30" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 dark:text-white mb-2">Ready to Predict</h3>
        <p className="text-slate-400 dark:text-white/40 max-w-sm text-sm leading-relaxed">
          Fill in your details above and click <span className="text-slate-600 dark:text-white/70 font-medium">Find My Colleges</span> to see your personalised predictions.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 md:p-8 flex flex-col gap-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">

        {/* Search + Download */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          <div className="relative flex-grow sm:min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/30" />
            <input type="text" placeholder="Search college or branch..."
              className="input-field w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <button className="btn-primary flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap" onClick={downloadPDF}>
            <FileText className="w-4 h-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-slate-400 dark:text-white/50">No colleges match this filter.</p>
          <button onClick={() => { setSearchQuery(''); setActiveTab('ALL'); }} className="mt-3 text-blue-500 text-sm hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
                {[
                  { label: 'Institute', key: 'Institute' },
                  { label: 'Branch', key: 'Academic Program Name' },
                  { label: 'Quota', key: null },
                  { label: 'Category', key: null },
                  { label: 'Closing Rank', key: 'Closing Rank' },
                  { label: 'Chances', key: null },
                ].map(({ label, key }) => (
                  <th key={label} onClick={key ? () => handleSort(key) : undefined}
                    className={`px-5 py-4 text-slate-500 dark:text-white/50 font-semibold text-xs uppercase tracking-wider whitespace-nowrap ${key ? 'cursor-pointer hover:text-slate-700 dark:hover:text-white/80 transition-colors' : ''}`}>
                    <div className="flex items-center gap-1.5">{label}{key && <SortIcon col={key} />}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const s = CHANCE_STYLES[item.Chances] || {};
                return (
                  <tr key={`${item.Institute}-${i}`} className={`border-b border-slate-100 dark:border-white/5 transition-colors ${s.row} last:border-0`}>
                    <td className="px-5 py-4 font-medium text-slate-800 dark:text-white whitespace-normal min-w-[240px] leading-snug">{item.Institute}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-white/70 whitespace-normal min-w-[220px] leading-snug">{item['Academic Program Name'].split('(')[0].trim()}</td>
                    <td className="px-5 py-4 text-slate-500 dark:text-white/60 whitespace-nowrap">{item.Quota}</td>
                    <td className="px-5 py-4 text-slate-500 dark:text-white/60 whitespace-nowrap">{item['Seat Type']}</td>
                    <td className="px-5 py-4 font-bold text-slate-800 dark:text-white whitespace-nowrap tabular-nums">{item['Closing Rank']}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${s.badge}`}>{item.Chances}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
