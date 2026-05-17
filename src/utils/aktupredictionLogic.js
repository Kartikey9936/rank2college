// AKTU field names from the JSON:
// "Institute ▲▼", "Program ▲▼", "Category ▲▼", "Seat Gender ▲▼",
// "Opening Rank ▲▼", "Closing Rank ▲▼"

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



function getChances(userRank, closingRank) {
  const cr = parseInt(closingRank);
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
    const itemCategory = item['Category ▲▼'] || '';
    const seatGender   = item['Seat Gender ▲▼'] || '';
    const closingRank  = item['Closing Rank ▲▼'] || '';
    const program      = item['Program ▲▼'] || '';

    // 1. Exact Category match (case-insensitive)
    if (itemCategory.toUpperCase() !== category.toUpperCase()) return;

    // 3. Branch preference
    if (!matchesBranch(program, branches)) return;

    // 4. Rank match
    const chances = getChances(userRank, closingRank);
    if (!chances) return;

    results.push({
      ...item,
      // Normalise field names so ResultsTable can reuse same columns
      Institute: item['Institute ▲▼'],
      'Academic Program Name': `${program} (${item['Stream ▲▼'] || ''})`,
      Quota: item['Quota ▲▼'] || 'Home State',
      'Seat Type': itemCategory,
      Gender: seatGender,
      'Opening Rank': item['Opening Rank ▲▼'],
      'Closing Rank': closingRank,
      Chances: chances,
    });
  });

  // Sort by closing rank ascending
  results.sort((a, b) => parseInt(a['Closing Rank']) - parseInt(b['Closing Rank']));
  return results;
};
