// Institute Type Matching
export const getInstituteType = (instituteName) => {
  const name = instituteName.toUpperCase();
  if (name.includes("INDIAN INSTITUTE OF TECHNOLOGY") || name.includes("IIT ")) return "IIT";
  if (name.includes("NATIONAL INSTITUTE OF TECHNOLOGY") || name.includes("NIT ")) return "NIT";
  if (name.includes("INDIAN INSTITUTE OF INFORMATION TECHNOLOGY") || name.includes("IIIT ")) return "IIIT";
  return "GFTI"; // Others fall to GFTI based on usual JoSAA list
};

// Map user selected branches to keywords in the JSON
const branchKeywords = {
  "CSE": ["COMPUTER SCIENCE", "ARTIFICIAL INTELLIGENCE", "DATA SCIENCE", "SOFTWARE", "MATHEMATICS AND COMPUTING"],
  "ECE": ["ELECTRONICS", "COMMUNICATION", "MICROELECTRONICS", "VLSI"],
  "ME": ["MECHANICAL", "MECHATRONICS", "AEROSPACE", "AUTOMOBILE"],
  "CE": ["CIVIL", "ENVIRONMENTAL", "STRUCTURAL"],
  "EE": ["ELECTRICAL", "INSTRUMENTATION"],
};

export const matchesBranch = (programName, selectedBranches) => {
  if (!selectedBranches || selectedBranches.length === 0 || selectedBranches.includes("ALL")) return true;
  
  const progUpper = programName.toUpperCase();
  for (let branch of selectedBranches) {
    if (branchKeywords[branch]) {
      if (branchKeywords[branch].some(kw => progUpper.includes(kw))) {
        return true;
      }
    }
  }
  return false;
};

// Calculate chances based on rank
export const calculateChances = (userRank, closingRank) => {
  if (userRank < closingRank * 0.9) return "SAFE";
  if (userRank <= closingRank * 1.1) return "MODERATE";
  return "REACH";
};

// Main prediction engine
export const predictColleges = (data, filters, activeTool = 'jee-mains') => {
  const { rank, category, gender, quota, instituteTypes, branches, isPwd } = filters;
  const userRank = parseInt(rank, 10);
  if (isNaN(userRank)) return [];

  const filtered = data.filter((item) => {
    // Exclude B.Arch and B.Planning as they require JEE Main Paper 2
    const progUpper = item["Academic Program Name"].toUpperCase();
    if (progUpper.includes("ARCHITECTURE") || progUpper.includes("PLANNING")) return false;

    // 1. Category / Seat Type Match
    const targetSeatType = isPwd ? `${category} (PwD)` : category;
    if (item["Seat Type"] !== targetSeatType) return false;

    // 2. Gender Match
    if (item["Gender"] !== gender) return false;

    // 3. Quota Match
    // If user chose Both, include both AI and HS/OS. (Some files use OS/HS for State quotas)
    if (quota !== "Both") {
      if (quota === "OS" && item["Quota"] !== "OS" && item["Quota"] !== "AI") return false;
      if (quota === "HS" && item["Quota"] !== "HS") return false;
    }

    // 4. Institute Type Match
    const instType = getInstituteType(item["Institute"]);

    if (activeTool === 'jee-advance') {
      // JEE Advance: show IITs only
      if (instType !== "IIT") return false;
    } else {
      // JEE Mains: exclude IITs (they require JEE Advanced)
      if (instType === "IIT") return false;
      if (!instituteTypes.includes("ALL") && !instituteTypes.includes(instType)) return false;
    }

    // 5. Branch Preference Match
    if (!matchesBranch(item["Academic Program Name"], branches)) return false;

    // 6. Rank Proximity (Closing + 20%)
    // If the user's rank is much better (lower) than the opening rank, they still get it, so we only check the upper bound.
    const closeRank = parseInt(item["Closing Rank"], 10);
    
    // Ignore rows with invalid ranks (like "50P" for PwD) if standard integer check fails
    if (isNaN(closeRank)) return false;

    if (userRank > closeRank * 1.2) return false;

    return true;
  });

  // Calculate and append chances
  return filtered.map(item => ({
    ...item,
    Chances: calculateChances(userRank, parseInt(item["Closing Rank"], 10))
  }));
};
