export type FilingStatus = "single" | "marriedJoint" | "marriedSeparate" | "head";

/**
 * 2026 FEDERAL TAX YEAR CONSTANTS
 * ------------------------------------------------------------
 * Source verification status (checked August 2026):
 *
 * CONFIRMED against multiple independent sources citing IRS Rev. Proc. 2025-32
 * and the IRS.gov "2026 tax inflation adjustments" release:
 *   - Standard deductions (all statuses)
 *   - Social Security wage base ($184,500 — confirmed directly on IRS.gov Topic 751)
 *   - Single-filer full bracket table
 *   - Married Filing Jointly full bracket table
 *   - Top-bracket (37%) floor for Head of Household ($640,600) and
 *     Married Filing Separately ($384,350)
 *
 * DERIVED (not found as an explicit published table in this research pass):
 *   - Head of Household 10% and 12% bracket ceilings were estimated by applying
 *     the same ~4% inflation adjustment ratio (2025→2026) that the confirmed
 *     Single-filer lower brackets used. The 22%/24%/32% HOH ceilings are set
 *     equal to the confirmed Single-filer figures, matching the near-identical
 *     relationship observed in the 2025 table.
 *   - Married Filing Separately brackets are set to exactly half of the
 *     confirmed MFJ brackets, per the standard MFS-equals-half-of-MFJ rule
 *     (confirmed true for the top bracket: $384,350 = $768,700 / 2).
 *
 * ACTION ITEM BEFORE PUBLIC LAUNCH: cross-check the two "DERIVED" rows above
 * directly against IRS Revenue Procedure 2025-32, Section 4.01, and update
 * this file if they differ. Re-verify this entire object every January when
 * the IRS publishes new inflation adjustments for the following tax year.
 */
export const TAX_YEAR = 2026;

export const TAX = {
  socialSecurityWageBase: 184_500, // Confirmed: IRS.gov Topic no. 751
  standardDeduction: {
    single: 16_100,
    marriedJoint: 32_200,
    marriedSeparate: 16_100,
    head: 24_150,
  },
  brackets: {
    single: [
      [12_400, 0.10],
      [50_400, 0.12],
      [105_700, 0.22],
      [201_775, 0.24],
      [256_225, 0.32],
      [640_600, 0.35],
      [Infinity, 0.37],
    ],
    marriedJoint: [
      [24_800, 0.10],
      [100_800, 0.12],
      [211_400, 0.22],
      [403_550, 0.24],
      [512_450, 0.32],
      [768_700, 0.35],
      [Infinity, 0.37],
    ],
    // DERIVED: exactly half of marriedJoint at every threshold (standard MFS rule)
    marriedSeparate: [
      [12_400, 0.10],
      [50_400, 0.12],
      [105_700, 0.22],
      [201_775, 0.24],
      [256_225, 0.32],
      [384_350, 0.35],
      [Infinity, 0.37],
    ],
    // DERIVED: 10%/12% ceilings estimated via inflation ratio; 22/24/32 aligned
    // to confirmed Single-filer values; 35% ceiling ($640,600) is confirmed.
    head: [
      [17_700, 0.10],
      [67_450, 0.12],
      [105_700, 0.22],
      [201_775, 0.24],
      [256_225, 0.32],
      [640_600, 0.35],
      [Infinity, 0.37],
    ],
  } as Record<FilingStatus, [number, number][]>,
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
export const formatMoney = (value: number) => money.format(Math.max(0, value));

export function incomeTax(taxable: number, status: FilingStatus) {
  let tax = 0;
  let floor = 0;
  for (const [ceiling, rate] of TAX.brackets[status]) {
    const slice = Math.min(taxable, ceiling) - floor;
    if (slice > 0) tax += slice * rate;
    floor = ceiling;
    if (taxable <= ceiling) break;
  }
  return tax;
}

import { calculateStateTax } from "./stateTax";

export function calculate(
  net: number,
  w2: number = 0,
  status: FilingStatus = "single",
  stateCode: string = "CA"
) {
  const seBase = net * 0.9235;
  const socialSecurityBase = Math.max(
    0,
    Math.min(seBase, TAX.socialSecurityWageBase - w2)
  );
  const socialSecurity = socialSecurityBase * 0.124;
  const medicare = seBase * 0.029;
  const seTax = socialSecurity + medicare;
  const agi = net + w2 - seTax / 2;
  const taxable = Math.max(0, agi - TAX.standardDeduction[status]);
  const federal = incomeTax(taxable, status);

  const { stateTax, stateName, isNoTax: isNoStateTax, rateDescription: stateRateDesc } = calculateStateTax(
    taxable,
    stateCode,
    status
  );

  const total = seTax + federal + stateTax;
  return {
    seTax,
    federal,
    stateTax,
    stateName,
    stateRateDesc,
    isNoStateTax,
    total,
    quarterly: total / 4,
    taxable,
    agi,
  };
}

