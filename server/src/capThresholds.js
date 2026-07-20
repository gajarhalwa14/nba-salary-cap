/** Official NBA salary thresholds by season ending year (e.g. 2026 = 2025-26). */
export const CAP_THRESHOLDS = {
  2026: {
    season: "2025-26",
    seasonYear: 2026,
    salaryFloor: 139_182_000,
    salaryCap: 154_647_000,
    luxuryTax: 187_895_000,
    firstApron: 195_945_000,
    secondApron: 207_824_000,
  },
};

export const CURRENT_SEASON_YEAR = 2026;

export function getThresholds(seasonYear = CURRENT_SEASON_YEAR) {
  const thresholds = CAP_THRESHOLDS[seasonYear];
  if (!thresholds) {
    throw new Error(`No cap thresholds configured for season ${seasonYear}`);
  }
  return thresholds;
}
