import React, { useState, useMemo } from 'react';
import { Search, FileText, ChevronUp, ChevronDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/* ─── Chance badge styles ──────────────────────────────────────── */
const CHANCE_CONFIG = {
  SAFE: {
    badge: {
      background: 'rgba(16, 185, 129, 0.15)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      color: 'rgb(52, 211, 153)',
      boxShadow: '0 0 10px rgba(16, 185, 129, 0.1)',
    },
    rowHover: 'rgba(16, 185, 129, 0.04)',
  },
  MODERATE: {
    badge: {
      background: 'rgba(245, 158, 11, 0.15)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      color: 'rgb(251, 191, 36)',
      boxShadow: '0 0 10px rgba(245, 158, 11, 0.12)',
    },
    rowHover: 'rgba(245, 158, 11, 0.04)',
  },
  REACH: {
    badge: {
      background: 'rgba(239, 68, 68, 0.12)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      color: 'rgb(252, 165, 165)',
      boxShadow: '0 0 10px rgba(239, 68, 68, 0.08)',
    },
    rowHover: 'rgba(239, 68, 68, 0.03)',
  },
};

const SortIndicator = ({ col, sortConfig }) => {
  if (sortConfig.key !== col)
    return <ChevronUp className="w-3 h-3 opacity-20" strokeWidth={1.5} />;
  return sortConfig.direction === 'asc'
    ? <ChevronUp className="w-3 h-3" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />
    : <ChevronDown className="w-3 h-3" style={{ color: 'var(--accent)' }} strokeWidth={1.5} />;
};

export default function ResultsTable({ results, hasSearched }) {
  const [searchQuery, setSearchQuery]   = useState('');
  const [sortConfig, setSortConfig]     = useState({ key: 'Closing Rank', direction: 'asc' });
  const [hoveredRow, setHoveredRow]     = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setVisibleCount(10);
  };

  const filtered = useMemo(() => {
    let data = [...results];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(i =>
        i.Institute.toLowerCase().includes(q) ||
        i['Academic Program Name'].toLowerCase().includes(q)
      );
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
    doc.setFontSize(18);
    doc.setTextColor(245, 158, 11);
    doc.text('Rank2College.com — College Priority List', 14, 20);
    doc.setFontSize(9);
    doc.setTextColor(113, 113, 122);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 28);

    autoTable(doc, {
      head: [['Institute', 'Branch', 'Quota', 'Category', 'Closing Rank', 'Chances']],
      body: filtered.map(i => [
        i.Institute,
        i['Academic Program Name'].split('(')[0].trim(),
        i.Quota,
        i['Seat Type'],
        i['Closing Rank'],
        i.Chances,
      ]),
      startY: 34,
      styles: { fontSize: 7.5, cellPadding: 3, textColor: [10, 10, 15], font: 'helvetica' },
      headStyles: { fillColor: [245, 158, 11], textColor: [10, 10, 15], fontStyle: 'bold', fontSize: 7.5 },
      alternateRowStyles: { fillColor: [248, 248, 252] },
      columnStyles: { 0: { cellWidth: 52 }, 1: { cellWidth: 50 } },
    });
    doc.save('Rank2College_List.pdf');
  };

  const counts = {
    ALL:      results.length,
    SAFE:     results.filter(r => r.Chances === 'SAFE').length,
    MODERATE: results.filter(r => r.Chances === 'MODERATE').length,
    REACH:    results.filter(r => r.Chances === 'REACH').length,
  };

  /* ── Empty / not-searched state ── */
  if (!hasSearched) {
    return (
      <div
        className="glass rounded-2xl flex flex-col items-center justify-center p-16 text-center"
        style={{ minHeight: '320px', borderRadius: 'var(--radius-xl)' }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.15)',
          }}
        >
          <Search className="w-7 h-7" style={{ color: 'rgba(245,158,11,0.5)' }} strokeWidth={1.5} />
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '1.1rem',
            color: 'var(--fg)',
            marginBottom: '0.5rem',
          }}
        >
          Ready to Predict
        </h3>
        <p style={{ color: 'var(--muted-fg)', fontSize: '0.85rem', maxWidth: '300px', lineHeight: 1.6 }}>
          Fill in your profile above and click{' '}
          <span style={{ color: 'var(--accent)' }}>Find My Colleges</span> to see personalised predictions.
        </p>
      </div>
    );
  }

  return (
    <div
      className="glass rounded-2xl p-5 md:p-7 flex flex-col gap-5 animate-fade-up"
      style={{ borderRadius: 'var(--radius-xl)' }}
    >
      {/* ── Header: stats + search + download ── */}
      <div className="flex flex-col gap-4">

        {/* Summary pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Total',    count: counts.ALL,      color: 'var(--muted-fg)', bg: 'rgba(255,255,255,0.04)', border: 'var(--border)' },
            { label: 'Safe',     count: counts.SAFE,     color: 'rgb(52,211,153)',  bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
            { label: 'Moderate', count: counts.MODERATE, color: 'rgb(251,191,36)',  bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
            { label: 'Reach',    count: counts.REACH,    color: 'rgb(252,165,165)', bg: 'rgba(239,68,68,0.06)',  border: 'rgba(239,68,68,0.18)' },
          ].map(({ label, count, color, bg, border }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color }}>{count}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.06em', color: 'var(--muted-fg)' }}>
                {label.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* Search + Download */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: 'var(--muted-fg)' }}
              strokeWidth={1.5}
            />
            <input
              type="text"
              placeholder="Search college or branch…"
              className="input-field w-full pl-10 pr-4"
              style={{ fontSize: '0.875rem' }}
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setVisibleCount(10); }}
            />
          </div>
          <button
            className="btn-outline flex items-center justify-center gap-2 px-5 text-sm whitespace-nowrap"
            style={{ height: '2.75rem' }}
            onClick={downloadPDF}
          >
            <FileText className="w-4 h-4" strokeWidth={1.5} />
            Download PDF
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <p style={{ color: 'var(--muted-fg)', fontSize: '0.875rem' }}>No colleges match your search.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-3 text-sm transition-colors"
            style={{ color: 'var(--accent)', fontFamily: 'var(--font-body)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#FBBF24'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--accent)'}
          >
            Clear search
          </button>
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-xl"
          style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}
        >
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(26,26,36,0.8)' }}>
                {[
                  { label: 'Institute',     key: 'Institute' },
                  { label: 'Branch',        key: 'Academic Program Name' },
                  { label: 'Quota',         key: null },
                  { label: 'Category',      key: null },
                  { label: 'Closing Rank',  key: 'Closing Rank' },
                  { label: 'Chances',       key: null },
                ].map(({ label, key }) => (
                  <th
                    key={label}
                    onClick={key ? () => handleSort(key) : undefined}
                    style={{
                      padding: '14px 18px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      letterSpacing: '0.07em',
                      textTransform: 'uppercase',
                      color: 'var(--muted-fg)',
                      whiteSpace: 'nowrap',
                      cursor: key ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      {label}
                      {key && <SortIndicator col={key} sortConfig={sortConfig} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, visibleCount).map((item, i) => {
                const cfg = CHANCE_CONFIG[item.Chances] || CHANCE_CONFIG.REACH;
                const isHovered = hoveredRow === i;
                return (
                  <tr
                    key={`${item.Institute}-${i}`}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: i < Math.min(visibleCount, filtered.length) - 1 ? '1px solid var(--border)' : 'none',
                      background: isHovered ? cfg.rowHover : 'transparent',
                      transition: 'background 200ms ease-out',
                    }}
                  >
                    <td
                      style={{
                        padding: '14px 18px',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        color: 'var(--fg)',
                        minWidth: '220px',
                        lineHeight: 1.4,
                      }}
                    >
                      {item.Institute}
                    </td>
                    <td
                      style={{
                        padding: '14px 18px',
                        fontSize: '0.82rem',
                        color: 'rgba(250,250,250,0.7)',
                        minWidth: '200px',
                        lineHeight: 1.4,
                      }}
                    >
                      {item['Academic Program Name'].split('(')[0].trim()}
                    </td>
                    <td
                      style={{
                        padding: '14px 18px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--muted-fg)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.Quota}
                    </td>
                    <td
                      style={{
                        padding: '14px 18px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--muted-fg)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item['Seat Type']}
                    </td>
                    <td
                      style={{
                        padding: '14px 18px',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: 'var(--fg)',
                        whiteSpace: 'nowrap',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {item['Closing Rank']}
                    </td>
                    <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          ...cfg.badge,
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          letterSpacing: '0.07em',
                        }}
                      >
                        {item.Chances}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Load More ── */}
      {filtered.length > visibleCount && (
        <div className="flex flex-col items-center gap-3 pt-2">
          {/* Progress bar */}
          <div
            className="w-full rounded-full overflow-hidden"
            style={{ height: '2px', background: 'var(--border)' }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.min((visibleCount / filtered.length) * 100, 100)}%`,
                background: 'var(--accent)',
                borderRadius: '9999px',
                transition: 'width 400ms ease-out',
                boxShadow: 'var(--glow-sm)',
              }}
            />
          </div>

          {/* Count label */}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted-fg)', letterSpacing: '0.05em' }}>
            SHOWING {Math.min(visibleCount, filtered.length)} OF {filtered.length} COLLEGES
          </p>

          {/* Load more button */}
          <button
            onClick={() => setVisibleCount(prev => prev + 10)}
            className="btn-outline flex items-center gap-2 px-6 py-2.5 text-sm"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
            Load More
          </button>
        </div>
      )}

      {/* All loaded indicator */}
      {filtered.length > 0 && filtered.length <= visibleCount && filtered.length > 10 && (
        <p className="text-center" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted-fg)', letterSpacing: '0.05em' }}>
          ✓ ALL {filtered.length} COLLEGES LOADED
        </p>
      )}
    </div>
  );
}
