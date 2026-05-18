// AKTU prediction logic - supports both old field names (with ▲▼) and new clean field names

const BRANCH_MAP = {
  CSE: ['computer science', 'cs&e', 'cse', 'information technology', 'it'],
  ECE: ['electronics', 'communication', 'ece'],
  ME:  ['mechanical', 'production'],
  CE:  ['civil'],
  EE:  ['electrical'],
};

function matchesBranch(program, branches) {
  if (branches.includes('ALL')) return true;
  const p = program.toLowerCase();
  return branches.some(b => BRANCH_MAP[b]?.some(k => p.includes(k)));
}

// Helper: read a field that may have the old "▲▼" suffix or the new clean name
function getField(item, cleanKey) {
  if (item[cleanKey] !== undefined) return item[cleanKey];
  // Try the old arrow-suffix variant
  const oldKey = Object.keys(item).find(k => k.startsWith(cleanKey + ' '));
  return oldKey ? item[oldKey] : '';
}

// Strip trailing ".00" from rank strings like "123456.00"
function parseRank(value) {
  if (!value) return NaN;
  return parseInt(String(value).replace(/\.00$/, '').replace(/\.0+$/, ''), 10);
}

function getChances(userRank, closingRankRaw) {
  const cr = parseRank(closingRankRaw);
  if (isNaN(cr)) return null;
  if (userRank <= cr * 0.75) return 'SAFE';
  if (userRank <= cr) return 'MODERATE';
  if (userRank <= cr * 1.15) return 'REACH';
  return null;
}

export const predictAKTU = (data, filters) => {
  const { rank, category, branches } = filters;
  const userRank = parseInt(rank, 10);
  if (isNaN(userRank)) return [];

  const results = [];

  data.forEach(item => {
    const itemCategory = getField(item, 'Category');
    const seatGender   = getField(item, 'Seat Gender');
    const closingRank  = getField(item, 'Closing Rank');
    const program      = getField(item, 'Program');

    // 1. Exact Category match (case-insensitive)
    if (itemCategory.toUpperCase() !== category.toUpperCase()) return;

    // 2. Branch preference
    if (!matchesBranch(program, branches)) return;

    // 3. Rank match
    const chances = getChances(userRank, closingRank);
    if (!chances) return;

    const closingRankClean = String(parseRank(closingRank));
    const openingRankClean = String(parseRank(getField(item, 'Opening Rank')));

    results.push({
      ...item,
      // Normalise field names so ResultsTable can reuse same columns
      Institute: getField(item, 'Institute'),
      'Academic Program Name': `${program} (${getField(item, 'Stream') || ''})`,
      Quota: getField(item, 'Quota') || 'Home State',
      'Seat Type': itemCategory,
      Gender: seatGender,
      'Opening Rank': openingRankClean,
      'Closing Rank': closingRankClean,
      Chances: chances,
    });
  });

  // Sort by closing rank ascending
  results.sort((a, b) => parseInt(a['Closing Rank']) - parseInt(b['Closing Rank']));
  return results;
};
