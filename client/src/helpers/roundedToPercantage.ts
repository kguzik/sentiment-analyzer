/**
 * Converts score from 0-1 range to percentage and rounds to 2 decimal places
 */
const roundToPercentage = (score: number | null | undefined): number => {
  return score ? Number((score * 100).toFixed(2)) : 0;
};

export default roundToPercentage;
