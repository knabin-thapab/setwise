import { FilingStatus } from "./tax";

export interface StateTaxRule {
  code: string;
  name: string;
  type: "none" | "flat" | "bracket";
  flatRate?: number;
  // Brackets for single filers [ceiling, rate]
  singleBrackets?: [number, number][];
  // Brackets for married joint filers [ceiling, rate]
  marriedBrackets?: [number, number][];
  standardDeduction?: { single: number; married: number };
  lastVerified: string; // "2026-08"
  sourceUrl: string;
  notes?: string;
}

export const STATE_TAX_RULES: Record<string, StateTaxRule> = {
  // ─── 9 No-Income-Tax States ───
  AK: {
    code: "AK",
    name: "Alaska",
    type: "none",
    lastVerified: "2026-08",
    sourceUrl: "https://tax.alaska.gov/",
    notes: "Alaska has no individual state income tax.",
  },
  FL: {
    code: "FL",
    name: "Florida",
    type: "none",
    lastVerified: "2026-08",
    sourceUrl: "https://floridarevenue.com/",
    notes: "Florida has no state individual income tax.",
  },
  NV: {
    code: "NV",
    name: "Nevada",
    type: "none",
    lastVerified: "2026-08",
    sourceUrl: "https://tax.nv.gov/",
    notes: "Nevada has no state income tax.",
  },
  NH: {
    code: "NH",
    name: "New Hampshire",
    type: "none",
    lastVerified: "2026-08",
    sourceUrl: "https://www.revenue.nh.gov/",
    notes: "New Hampshire has no state tax on wage or freelance income.",
  },
  SD: {
    code: "SD",
    name: "South Dakota",
    type: "none",
    lastVerified: "2026-08",
    sourceUrl: "https://dor.sd.gov/",
    notes: "South Dakota has no state income tax.",
  },
  TN: {
    code: "TN",
    name: "Tennessee",
    type: "none",
    lastVerified: "2026-08",
    sourceUrl: "https://www.tn.gov/revenue.html",
    notes: "Tennessee has no state personal income tax.",
  },
  TX: {
    code: "TX",
    name: "Texas",
    type: "none",
    lastVerified: "2026-08",
    sourceUrl: "https://comptroller.texas.gov/",
    notes: "Texas has no personal state income tax.",
  },
  WA: {
    code: "WA",
    name: "Washington",
    type: "none",
    lastVerified: "2026-08",
    sourceUrl: "https://dor.wa.gov/",
    notes: "Washington has no personal earned income tax.",
  },
  WY: {
    code: "WY",
    name: "Wyoming",
    type: "none",
    lastVerified: "2026-08",
    sourceUrl: "https://revenue.wyo.gov/",
    notes: "Wyoming has no state income tax.",
  },

  // ─── Flat Tax States ───
  AZ: {
    code: "AZ",
    name: "Arizona",
    type: "flat",
    flatRate: 0.025,
    standardDeduction: { single: 14600, married: 29200 },
    lastVerified: "2026-08",
    sourceUrl: "https://azdor.gov/",
    notes: "Arizona uses a 2.5% flat individual income tax rate.",
  },
  CO: {
    code: "CO",
    name: "Colorado",
    type: "flat",
    flatRate: 0.044,
    lastVerified: "2026-08",
    sourceUrl: "https://tax.colorado.gov/",
    notes: "Colorado uses a 4.4% flat tax on federal taxable income.",
  },
  GA: {
    code: "GA",
    name: "Georgia",
    type: "flat",
    flatRate: 0.0539,
    standardDeduction: { single: 12000, married: 24000 },
    lastVerified: "2026-08",
    sourceUrl: "https://dor.georgia.gov/",
    notes: "Georgia transitioned to a flat income tax rate of 5.39%.",
  },
  ID: {
    code: "ID",
    name: "Idaho",
    type: "flat",
    flatRate: 0.05695,
    standardDeduction: { single: 14600, married: 29200 },
    lastVerified: "2026-08",
    sourceUrl: "https://tax.idaho.gov/",
    notes: "Idaho uses a 5.695% flat individual income tax rate.",
  },
  IL: {
    code: "IL",
    name: "Illinois",
    type: "flat",
    flatRate: 0.0495,
    lastVerified: "2026-08",
    sourceUrl: "https://tax.illinois.gov/",
    notes: "Illinois uses a flat 4.95% state income tax rate.",
  },
  IN: {
    code: "IN",
    name: "Indiana",
    type: "flat",
    flatRate: 0.0305,
    lastVerified: "2026-08",
    sourceUrl: "https://www.in.gov/dor/",
    notes: "Indiana state baseline rate is 3.05% (county taxes may add ~1-2%).",
  },
  IA: {
    code: "IA",
    name: "Iowa",
    type: "flat",
    flatRate: 0.038,
    lastVerified: "2026-08",
    sourceUrl: "https://tax.iowa.gov/",
    notes: "Iowa transitioned to a 3.8% flat tax rate.",
  },
  KY: {
    code: "KY",
    name: "Kentucky",
    type: "flat",
    flatRate: 0.04,
    standardDeduction: { single: 3160, married: 3160 },
    lastVerified: "2026-08",
    sourceUrl: "https://revenue.ky.gov/",
    notes: "Kentucky uses a 4.0% flat state income tax rate.",
  },
  MA: {
    code: "MA",
    name: "Massachusetts",
    type: "flat",
    flatRate: 0.05,
    standardDeduction: { single: 4400, married: 8800 },
    lastVerified: "2026-08",
    sourceUrl: "https://www.mass.gov/orgs/massachusetts-department-of-revenue",
    notes: "Massachusetts flat rate is 5.0% (income over $1M has a 4% surtax).",
  },
  MI: {
    code: "MI",
    name: "Michigan",
    type: "flat",
    flatRate: 0.0425,
    lastVerified: "2026-08",
    sourceUrl: "https://www.michigan.gov/taxes",
    notes: "Michigan uses a flat 4.25% personal income tax rate.",
  },
  MS: {
    code: "MS",
    name: "Mississippi",
    type: "flat",
    flatRate: 0.047,
    standardDeduction: { single: 2300, married: 4600 },
    lastVerified: "2026-08",
    sourceUrl: "https://www.dor.ms.gov/",
    notes: "Mississippi flat rate on taxable income above threshold is 4.7%.",
  },
  NC: {
    code: "NC",
    name: "North Carolina",
    type: "flat",
    flatRate: 0.045,
    standardDeduction: { single: 12750, married: 25500 },
    lastVerified: "2026-08",
    sourceUrl: "https://www.ncdor.gov/",
    notes: "North Carolina uses a 4.5% flat state income tax rate.",
  },
  PA: {
    code: "PA",
    name: "Pennsylvania",
    type: "flat",
    flatRate: 0.0307,
    lastVerified: "2026-08",
    sourceUrl: "https://www.revenue.pa.gov/",
    notes: "Pennsylvania uses a 3.07% flat tax on gross compensation.",
  },
  UT: {
    code: "UT",
    name: "Utah",
    type: "flat",
    flatRate: 0.0455,
    lastVerified: "2026-08",
    sourceUrl: "https://tax.utah.gov/",
    notes: "Utah uses a 4.55% flat tax on federal adjusted gross income.",
  },

  // ─── Progressive Bracket States ───
  CA: {
    code: "CA",
    name: "California",
    type: "bracket",
    // VERIFIED 2026 (checked Aug 2026 against multiple 2026-dated sources
    // citing CA Franchise Tax Board figures). Previous version of this file
    // shipped 2024 numbers mislabeled as 2026 — see PR notes.
    standardDeduction: { single: 5706, married: 11412 },
    singleBrackets: [
      [10412, 0.01],
      [24684, 0.02],
      [38959, 0.04],
      [54081, 0.06],
      [68350, 0.08],
      [349137, 0.093],
      [418961, 0.103],
      [698271, 0.113],
      [1000000, 0.123],
      [Infinity, 0.133], // includes +1% Mental/Behavioral Health Services Tax above $1M
    ],
    // NOTE (unresolved): the +1% surtax threshold ($1,000,000) does NOT double
    // for joint filers per CA FTB rules, but the underlying 12.3% bracket
    // threshold below it likely does. This interaction is not fully resolved
    // here — married bracket figures below are a reasonable approximation
    // (doubled thresholds for the base schedule) but the exact MFJ treatment
    // around the $1M surtax layer needs confirmation from a CA tax
    // professional or the FTB's official married rate schedule before launch.
    marriedBrackets: [
      [20824, 0.01],
      [49368, 0.02],
      [77918, 0.04],
      [108162, 0.06],
      [136700, 0.08],
      [698274, 0.093],
      [837922, 0.103],
      [1396542, 0.113],
      [Infinity, 0.133],
    ],
    lastVerified: "2026-08",
    sourceUrl: "https://www.ftb.ca.gov/",
    notes: "California progressive brackets from 1% up to 13.3% (includes +1% Mental Health Services Tax over $1M taxable income, not doubled for joint filers).",
  },
  NY: {
    code: "NY",
    name: "New York",
    type: "bracket",
    standardDeduction: { single: 8000, married: 16050 },
    singleBrackets: [
      [8500, 0.04],
      [11700, 0.045],
      [13900, 0.0525],
      [80650, 0.055],
      [215400, 0.06],
      [1077550, 0.0685],
      [5000000, 0.0965],
      [Infinity, 0.109],
    ],
    marriedBrackets: [
      [17150, 0.04],
      [23600, 0.045],
      [27900, 0.0525],
      [161550, 0.055],
      [323200, 0.06],
      [2155350, 0.0685],
      [5000000, 0.0965],
      [Infinity, 0.109],
    ],
    lastVerified: "2026-08",
    sourceUrl: "https://www.tax.ny.gov/",
    notes: "New York State personal income tax from 4.0% to 10.9% (NYC residents have separate local tax).",
  },
  NJ: {
    code: "NJ",
    name: "New Jersey",
    type: "bracket",
    standardDeduction: { single: 1000, married: 2000 },
    singleBrackets: [
      [20000, 0.014],
      [35000, 0.0175],
      [40000, 0.035],
      [75000, 0.05525],
      [500000, 0.0637],
      [1000000, 0.0897],
      [Infinity, 0.1075],
    ],
    marriedBrackets: [
      [20000, 0.014],
      [50000, 0.0175],
      [70000, 0.0245],
      [80000, 0.035],
      [150000, 0.05525],
      [500000, 0.0637],
      [1000000, 0.0897],
      [Infinity, 0.1075],
    ],
    lastVerified: "2026-08",
    sourceUrl: "https://www.state.nj.us/treasury/taxation/",
  },
  OH: {
    code: "OH",
    name: "Ohio",
    type: "bracket",
    standardDeduction: { single: 0, married: 0 },
    singleBrackets: [
      [26050, 0.0],
      [100000, 0.0275],
      [Infinity, 0.035],
    ],
    lastVerified: "2026-08",
    sourceUrl: "https://tax.ohio.gov/",
    notes: "Ohio offers $0 tax under ~$26k, then brackets at 2.75% and 3.5%.",
  },
  VA: {
    code: "VA",
    name: "Virginia",
    type: "bracket",
    standardDeduction: { single: 8500, married: 17000 },
    singleBrackets: [
      [3000, 0.02],
      [5000, 0.03],
      [17000, 0.05],
      [Infinity, 0.0575],
    ],
    lastVerified: "2026-08",
    sourceUrl: "https://www.tax.virginia.gov/",
  },
  MD: {
    code: "MD",
    name: "Maryland",
    type: "bracket",
    standardDeduction: { single: 2550, married: 5150 },
    singleBrackets: [
      [1000, 0.02],
      [2000, 0.03],
      [3000, 0.04],
      [100000, 0.0475],
      [125000, 0.05],
      [150000, 0.0525],
      [250000, 0.055],
      [Infinity, 0.0575],
    ],
    lastVerified: "2026-08",
    sourceUrl: "https://www.marylandtaxes.gov/",
    notes: "Maryland state rate reaches 5.75% (local county tax adds ~2.25%-3.2%).",
  },
  OR: {
    code: "OR",
    name: "Oregon",
    type: "bracket",
    standardDeduction: { single: 2745, married: 5495 },
    singleBrackets: [
      [4300, 0.0475],
      [10750, 0.0675],
      [125000, 0.0875],
      [Infinity, 0.099],
    ],
    marriedBrackets: [
      [8600, 0.0475],
      [21500, 0.0675],
      [250000, 0.0875],
      [Infinity, 0.099],
    ],
    lastVerified: "2026-08",
    sourceUrl: "https://www.oregon.gov/dor/",
  },
  MN: {
    code: "MN",
    name: "Minnesota",
    type: "bracket",
    standardDeduction: { single: 14600, married: 29200 },
    singleBrackets: [
      [31690, 0.0535],
      [104090, 0.068],
      [193240, 0.0785],
      [Infinity, 0.0985],
    ],
    marriedBrackets: [
      [46330, 0.0535],
      [184080, 0.068],
      [321450, 0.0785],
      [Infinity, 0.0985],
    ],
    lastVerified: "2026-08",
    sourceUrl: "https://www.revenue.state.mn.us/",
  },
  WI: {
    code: "WI",
    name: "Wisconsin",
    type: "bracket",
    standardDeduction: { single: 13810, married: 25170 },
    singleBrackets: [
      [14320, 0.035],
      [28640, 0.044],
      [315310, 0.053],
      [Infinity, 0.0765],
    ],
    lastVerified: "2026-08",
    sourceUrl: "https://www.revenue.wi.gov/",
  },
  CT: {
    code: "CT",
    name: "Connecticut",
    type: "bracket",
    standardDeduction: { single: 15000, married: 24000 },
    singleBrackets: [
      [10000, 0.02],
      [50000, 0.045],
      [100000, 0.055],
      [200000, 0.06],
      [250000, 0.065],
      [500000, 0.069],
      [Infinity, 0.0699],
    ],
    lastVerified: "2026-08",
    sourceUrl: "https://portal.ct.gov/drs",
  },
  HI: {
    code: "HI",
    name: "Hawaii",
    type: "bracket",
    standardDeduction: { single: 2200, married: 4400 },
    singleBrackets: [
      [2400, 0.014],
      [4800, 0.032],
      [9600, 0.055],
      [14400, 0.064],
      [19200, 0.068],
      [24000, 0.072],
      [36000, 0.076],
      [48000, 0.079],
      [150000, 0.0825],
      [175000, 0.09],
      [200000, 0.10],
      [Infinity, 0.11],
    ],
    lastVerified: "2026-08",
    sourceUrl: "https://tax.hawaii.gov/",
  },
  DC: {
    code: "DC",
    name: "District of Columbia",
    type: "bracket",
    standardDeduction: { single: 14600, married: 29200 },
    singleBrackets: [
      [10000, 0.04],
      [40000, 0.06],
      [60000, 0.065],
      [250000, 0.085],
      [500000, 0.0925],
      [1000000, 0.0975],
      [Infinity, 0.1075],
    ],
    lastVerified: "2026-08",
    sourceUrl: "https://otr.cfo.dc.gov/",
  },
  // Default / Other states fallback with standard progressive rate (~4.5%)
  DEFAULT: {
    code: "OTHER",
    name: "Other State (Avg. ~4.5%)",
    type: "flat",
    flatRate: 0.045,
    lastVerified: "2026-08",
    sourceUrl: "https://taxfoundation.org/",
    notes: "Estimated average state income tax rate for remaining jurisdictions.",
  },
};

export interface StateOption {
  code: string;
  name: string;
  type: "none" | "flat" | "bracket";
  isNoTax: boolean;
}

export const US_STATES: StateOption[] = [
  { code: "AL", name: "Alabama", type: "bracket", isNoTax: false },
  { code: "AK", name: "Alaska", type: "none", isNoTax: true },
  { code: "AZ", name: "Arizona", type: "flat", isNoTax: false },
  { code: "AR", name: "Arkansas", type: "bracket", isNoTax: false },
  { code: "CA", name: "California", type: "bracket", isNoTax: false },
  { code: "CO", name: "Colorado", type: "flat", isNoTax: false },
  { code: "CT", name: "Connecticut", type: "bracket", isNoTax: false },
  { code: "DE", name: "Delaware", type: "bracket", isNoTax: false },
  { code: "DC", name: "District of Columbia", type: "bracket", isNoTax: false },
  { code: "FL", name: "Florida", type: "none", isNoTax: true },
  { code: "GA", name: "Georgia", type: "flat", isNoTax: false },
  { code: "HI", name: "Hawaii", type: "bracket", isNoTax: false },
  { code: "ID", name: "Idaho", type: "flat", isNoTax: false },
  { code: "IL", name: "Illinois", type: "flat", isNoTax: false },
  { code: "IN", name: "Indiana", type: "flat", isNoTax: false },
  { code: "IA", name: "Iowa", type: "flat", isNoTax: false },
  { code: "KS", name: "Kansas", type: "bracket", isNoTax: false },
  { code: "KY", name: "Kentucky", type: "flat", isNoTax: false },
  { code: "LA", name: "Louisiana", type: "bracket", isNoTax: false },
  { code: "ME", name: "Maine", type: "bracket", isNoTax: false },
  { code: "MD", name: "Maryland", type: "bracket", isNoTax: false },
  { code: "MA", name: "Massachusetts", type: "flat", isNoTax: false },
  { code: "MI", name: "Michigan", type: "flat", isNoTax: false },
  { code: "MN", name: "Minnesota", type: "bracket", isNoTax: false },
  { code: "MS", name: "Mississippi", type: "flat", isNoTax: false },
  { code: "MO", name: "Missouri", type: "bracket", isNoTax: false },
  { code: "MT", name: "Montana", type: "bracket", isNoTax: false },
  { code: "NE", name: "Nebraska", type: "bracket", isNoTax: false },
  { code: "NV", name: "Nevada", type: "none", isNoTax: true },
  { code: "NH", name: "New Hampshire", type: "none", isNoTax: true },
  { code: "NJ", name: "New Jersey", type: "bracket", isNoTax: false },
  { code: "NM", name: "New Mexico", type: "bracket", isNoTax: false },
  { code: "NY", name: "New York", type: "bracket", isNoTax: false },
  { code: "NC", name: "North Carolina", type: "flat", isNoTax: false },
  { code: "ND", name: "North Dakota", type: "bracket", isNoTax: false },
  { code: "OH", name: "Ohio", type: "bracket", isNoTax: false },
  { code: "OK", name: "Oklahoma", type: "bracket", isNoTax: false },
  { code: "OR", name: "Oregon", type: "bracket", isNoTax: false },
  { code: "PA", name: "Pennsylvania", type: "flat", isNoTax: false },
  { code: "RI", name: "Rhode Island", type: "bracket", isNoTax: false },
  { code: "SC", name: "South Carolina", type: "bracket", isNoTax: false },
  { code: "SD", name: "South Dakota", type: "none", isNoTax: true },
  { code: "TN", name: "Tennessee", type: "none", isNoTax: true },
  { code: "TX", name: "Texas", type: "none", isNoTax: true },
  { code: "UT", name: "Utah", type: "flat", isNoTax: false },
  { code: "VT", name: "Vermont", type: "bracket", isNoTax: false },
  { code: "VA", name: "Virginia", type: "bracket", isNoTax: false },
  { code: "WA", name: "Washington", type: "none", isNoTax: true },
  { code: "WV", name: "West Virginia", type: "bracket", isNoTax: false },
  { code: "WI", name: "Wisconsin", type: "bracket", isNoTax: false },
  { code: "WY", name: "Wyoming", type: "none", isNoTax: true },
];

export function calculateStateTax(
  taxableIncome: number,
  stateCode: string,
  status: FilingStatus = "single"
): { stateTax: number; stateName: string; isNoTax: boolean; rateDescription: string } {
  const rule = STATE_TAX_RULES[stateCode] || STATE_TAX_RULES["DEFAULT"];

  if (rule.type === "none") {
    return {
      stateTax: 0,
      stateName: rule.name,
      isNoTax: true,
      rateDescription: "0% — No state income tax",
    };
  }

  // Handle deduction if applicable
  const stdDeduction =
    rule.standardDeduction?.[status === "marriedJoint" ? "married" : "single"] ?? 0;
  const stateTaxable = Math.max(0, taxableIncome - stdDeduction);

  if (rule.type === "flat" && rule.flatRate) {
    const tax = stateTaxable * rule.flatRate;
    return {
      stateTax: tax,
      stateName: rule.name,
      isNoTax: false,
      rateDescription: `${(rule.flatRate * 100).toFixed(2)}% flat rate`,
    };
  }

  if (rule.type === "bracket") {
    const brackets =
      status === "marriedJoint" && rule.marriedBrackets
        ? rule.marriedBrackets
        : rule.singleBrackets || [
            [25000, 0.03],
            [80000, 0.05],
            [Infinity, 0.065],
          ];

    let tax = 0;
    let floor = 0;
    for (const [ceiling, rate] of brackets) {
      const slice = Math.min(stateTaxable, ceiling) - floor;
      if (slice > 0) tax += slice * rate;
      floor = ceiling;
      if (stateTaxable <= ceiling) break;
    }
    const effectiveRate = stateTaxable > 0 ? ((tax / stateTaxable) * 100).toFixed(1) : "0.0";
    return {
      stateTax: tax,
      stateName: rule.name,
      isNoTax: false,
      rateDescription: `Graduated brackets (~${effectiveRate}% effective)`,
    };
  }

  // Fallback
  const tax = stateTaxable * 0.045;
  return {
    stateTax: tax,
    stateName: rule.name,
    isNoTax: false,
    rateDescription: "~4.5% estimated rate",
  };
}
