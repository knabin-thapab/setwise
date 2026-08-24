import { TAX } from "./tax";

/**
 * 2026 RETIREMENT LIMIT CONSTANTS (SELF-EMPLOYED)
 * ------------------------------------------------------------
 * Sourced from IRS Notice 2025-67 (via IR-2025-111, Nov 13, 2025).
 * 
 * ACTION ITEM: Re-verify every January when IRS releases COLA adjustments.
 */
export const RETIREMENT_CONSTANTS = {
  taxYear: 2026,
  sepMaxDollar: 72_000, // 2026 IRS SEP maximum dollar limit
  solo401kElectiveLimit: 24_500, // 2026 Employee elective deferral limit
  solo401kCatchUp50Plus: 8_000, // 2026 Catch-up contribution for age 50+
  solo401kOverallLimitUnder50: 72_000, // 2026 Total employer + employee cap (< 50)
  solo401kOverallLimit50Plus: 80_000, // 2026 Total employer + employee cap (50+)
  lastVerified: "2026-08-22",
  sourceNotice: "IRS Notice 2025-67 / IR-2025-111",
  sourceUrl: "https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026",
};

export interface RetirementCalculationResult {
  netProfit: number;
  isOver50: boolean;
  seTax: number;
  halfSeTax: number;
  adjustedSEIncome: number; // Net earnings after deducting 1/2 of SE tax
  sepMax: number;
  solo401kElective: number;
  solo401kEmployer: number;
  solo401kMax: number;
  solo401kAdvantage: number; // How much more Solo 401k allows over SEP
}

/**
 * Calculates accurate 2026 self-employed retirement limits
 * following IRS Publication 560 circular worksheet logic.
 */
export function calculateRetirementLimits(
  netProfit: number,
  isOver50: boolean = false
): RetirementCalculationResult {
  const cleanProfit = Math.max(0, netProfit);
  if (cleanProfit <= 0) {
    return {
      netProfit: 0,
      isOver50,
      seTax: 0,
      halfSeTax: 0,
      adjustedSEIncome: 0,
      sepMax: 0,
      solo401kElective: 0,
      solo401kEmployer: 0,
      solo401kMax: 0,
      solo401kAdvantage: 0,
    };
  }

  // 1. Calculate Self-Employment Tax on Net Profit
  const seBase = cleanProfit * 0.9235;
  const socialSecurityBase = Math.min(seBase, TAX.socialSecurityWageBase);
  const socialSecurity = socialSecurityBase * 0.124;
  const medicare = seBase * 0.029;
  const seTax = socialSecurity + medicare;
  const halfSeTax = seTax / 2;

  // 2. Net earnings from self-employment (IRS Pub. 560 Chapter 5 worksheet)
  const adjustedSEIncome = Math.max(0, cleanProfit - halfSeTax);

  // 3. SEP-IRA Calculation
  // Nominal 25% rate becomes 20% (0.20) for self-employed due to deduction of contribution
  const sepRate = 0.20;
  const sepTheoretical = adjustedSEIncome * sepRate;
  const sepMax = Math.min(RETIREMENT_CONSTANTS.sepMaxDollar, sepTheoretical);

  // 4. Solo 401(k) Calculation
  // Employee elective deferral: max $24,500 (+$8,000 if 50+), limited to adjusted SE income
  const electiveLimit =
    RETIREMENT_CONSTANTS.solo401kElectiveLimit +
    (isOver50 ? RETIREMENT_CONSTANTS.solo401kCatchUp50Plus : 0);
  
  const solo401kElective = Math.min(electiveLimit, adjustedSEIncome);

  // Employer profit-sharing portion: up to 20% of adjusted SE income
  const solo401kEmployer = adjustedSEIncome * 0.20;

  // Total Solo 401(k) limit
  const overallCap = isOver50
    ? RETIREMENT_CONSTANTS.solo401kOverallLimit50Plus
    : RETIREMENT_CONSTANTS.solo401kOverallLimitUnder50;

  // Total can't exceed overall cap or total eligible compensation
  const totalCombined = Math.min(overallCap, solo401kElective + solo401kEmployer);
  const solo401kMax = Math.min(adjustedSEIncome + (isOver50 ? RETIREMENT_CONSTANTS.solo401kCatchUp50Plus : 0), totalCombined);

  const solo401kAdvantage = Math.max(0, solo401kMax - sepMax);

  return {
    netProfit: cleanProfit,
    isOver50,
    seTax,
    halfSeTax,
    adjustedSEIncome,
    sepMax,
    solo401kElective,
    solo401kEmployer,
    solo401kMax,
    solo401kAdvantage,
  };
}
