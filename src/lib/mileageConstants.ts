/**
 * IRS STANDARD MILEAGE RATES & AUDIT CONSTANTS
 * ------------------------------------------------------------
 * Sourced directly from IRS Notices:
 * - 2026: IRS Notice / News Release IR-2025-128 ($0.725 / mile business)
 * - 2025: IRS Notice 2024-88 ($0.70 / mile business)
 * - 2024: IRS Notice 2024-08 ($0.67 / mile business)
 * 
 * Rates are published annually in December for the subsequent calendar year.
 */

export const IRS_YEAR_RATES = {
  2026: {
    year: 2026,
    business: 0.725,
    medicalMoving: 0.21,
    charity: 0.14,
    label: "2026 (Current - $0.725/mi)",
    notice: "IRS IR-2025-128",
  },
  2025: {
    year: 2025,
    business: 0.70,
    medicalMoving: 0.21,
    charity: 0.14,
    label: "2025 ($0.70/mi)",
    notice: "IRS Notice 2024-88",
  },
  2024: {
    year: 2024,
    business: 0.67,
    medicalMoving: 0.21,
    charity: 0.14,
    label: "2024 ($0.67/mi)",
    notice: "IRS Notice 2024-08",
  },
} as const;

export type TaxYear = keyof typeof IRS_YEAR_RATES;

export const MILEAGE_CONSTANTS = {
  taxYear: 2026,
  businessRatePerMile: 0.725, // $0.725 per mile for 2026
  medicalRatePerMile: 0.21,
  charityRatePerMile: 0.14,
  lastVerified: "2026-08-22",
  sourceNotice: "IRS IR-2025-128",
  sourceUrl: "https://www.irs.gov/newsroom/irs-issues-standard-mileage-rates-for-2026",
};

export interface TripLogItem {
  id: string;
  date: string;
  startLocation?: string;
  destination?: string;
  purpose: string;
  category: "client_meeting" | "delivery" | "supply_run" | "errand" | "airport_travel" | "medical" | "charity" | "other";
  miles: number;
  odometerStart?: number;
  odometerEnd?: number;
  vehicleName?: string;
}

export const COMMON_PURPOSE_OPTIONS = [
  { id: "client_meeting", label: "Client Meeting / Site Visit", rateType: "business" },
  { id: "delivery", label: "Gig Delivery / Rideshare (Uber, DoorDash)", rateType: "business" },
  { id: "supply_run", label: "Equipment / Office Supplies", rateType: "business" },
  { id: "errand", label: "Bank / CPA / Post Office Errand", rateType: "business" },
  { id: "airport_travel", label: "Airport / Out-of-Town Business Travel", rateType: "business" },
  { id: "medical", label: "Medical Appointment / Essential Travel", rateType: "medical" },
  { id: "charity", label: "Charitable Volunteer Driving", rateType: "charity" },
  { id: "other", label: "Other Qualified Business Travel", rateType: "business" },
] as const;

export interface ActualExpensesInput {
  gasAndFuel: number;
  insurance: number;
  repairsAndMaintenance: number;
  tiresAndOil: number;
  leaseOrDepreciation: number;
  registrationAndTaxes: number;
  carWashesAndTolls: number;
  totalMilesDriven: number;
  businessMilesDriven: number;
}

/**
 * Calculates standard mileage deduction across categories
 */
export function calculateMileageDeduction(
  businessMiles: number,
  medicalMiles: number = 0,
  charityMiles: number = 0,
  taxYear: TaxYear = 2026
) {
  const rates = IRS_YEAR_RATES[taxYear] || IRS_YEAR_RATES[2026];
  const businessDeduction = Math.max(0, businessMiles * rates.business);
  const medicalDeduction = Math.max(0, medicalMiles * rates.medicalMoving);
  const charityDeduction = Math.max(0, charityMiles * rates.charity);
  const totalDeduction = businessDeduction + medicalDeduction + charityDeduction;
  const totalMiles = businessMiles + medicalMiles + charityMiles;

  return {
    totalDeduction,
    businessDeduction,
    medicalDeduction,
    charityDeduction,
    totalMiles,
    rates,
  };
}

/**
 * Compares Standard Mileage Method against Actual Expense Method
 */
export function compareMileageMethods(
  actual: ActualExpensesInput,
  taxYear: TaxYear = 2026
) {
  const rates = IRS_YEAR_RATES[taxYear] || IRS_YEAR_RATES[2026];
  const standardDeduction = actual.businessMilesDriven * rates.business;

  const totalActualCosts =
    actual.gasAndFuel +
    actual.insurance +
    actual.repairsAndMaintenance +
    actual.tiresAndOil +
    actual.leaseOrDepreciation +
    actual.registrationAndTaxes +
    actual.carWashesAndTolls;

  const businessPercentage =
    actual.totalMilesDriven > 0
      ? Math.min(100, (actual.businessMilesDriven / actual.totalMilesDriven) * 100)
      : 0;

  const actualDeduction = (totalActualCosts * businessPercentage) / 100;
  const difference = standardDeduction - actualDeduction;
  const winner =
    difference > 0 ? "standard" : difference < 0 ? "actual" : "tie";

  // Breakeven miles: totalActualCosts * (miles / totalMiles) = miles * rates.business
  // (totalActualCosts / totalMiles) = rates.business
  const costPerMile =
    actual.totalMilesDriven > 0
      ? totalActualCosts / actual.totalMilesDriven
      : 0;

  return {
    standardDeduction,
    actualDeduction,
    totalActualCosts,
    businessPercentage,
    difference: Math.abs(difference),
    winner,
    costPerMile,
    rates,
  };
}

