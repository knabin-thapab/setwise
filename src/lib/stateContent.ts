export interface StateFaq {
  question: string;
  answer: string;
}

export interface StateContent {
  code: string;
  headline: string;
  summary: string;
  systemDescription: string;
  localTaxNote?: string;
  freelancerTips: string[];
  faqs: StateFaq[];
  relatedStates: string[]; // State codes
}

export const STATE_CONTENT: Record<string, StateContent> = {
  // ─── 9 No-Income-Tax States ───
  AK: {
    code: "AK",
    headline: "Alaska 1099 Freelancer Tax Guide",
    summary: "Alaska imposes no individual state income tax on freelance earnings, contractor payments, or business profits.",
    systemDescription: "Alaska is one of nine states with no personal income tax. Freelancers in Alaska only pay federal self-employment tax (15.3% Social Security & Medicare) and regular federal income tax.",
    localTaxNote: "While Alaska has no state income tax or statewide sales tax, some municipalities (boroughs and cities like Juneau and Anchorage) levy local sales taxes ranging from 0% to 7.85%.",
    freelancerTips: [
      "You do not need to file quarterly state estimated tax vouchers in Alaska.",
      "You must still make quarterly federal payments via IRS Form 1040-ES.",
      "Alaska residents may receive an annual Permanent Fund Dividend (PFD), which is federally taxable.",
    ],
    faqs: [
      {
        question: "Do freelancers in Alaska pay state income tax?",
        answer: "No. Alaska has no personal state income tax. Freelancers only pay federal taxes (self-employment tax and federal income tax).",
      },
      {
        question: "Do I need to file quarterly vouchers in Alaska?",
        answer: "No state quarterly vouchers are required. You only need to pay your federal 1040-ES estimated taxes by the four IRS quarterly deadlines.",
      },
    ],
    relatedStates: ["WA", "WY", "TX", "FL"],
  },
  FL: {
    code: "FL",
    headline: "Florida 1099 Freelancer Tax Guide",
    summary: "Florida does not levy a personal state income tax on independent contractors, sole proprietors, or LLC pass-through income.",
    systemDescription: "Under the Florida Constitution, the state cannot impose personal income tax. Freelancers keep 100% of their earnings from state-level income taxation, paying only federal SE tax and federal income tax.",
    localTaxNote: "Florida has a 6.0% state sales tax, plus county discretionary sales surtaxes ranging from 0.5% to 1.5%. Certain freelance services are exempt from sales tax.",
    freelancerTips: [
      "No state 1040 estimated vouchers are needed in Florida.",
      "Focus your quarterly tax budget entirely on IRS Form 1040-ES federal payments.",
      "If you form a single-member LLC in Florida, you pay no Florida corporate income tax as long as you maintain pass-through tax classification.",
    ],
    faqs: [
      {
        question: "Does Florida tax 1099 freelance earnings?",
        answer: "No. Florida has no individual state income tax. Independent contractors pay zero state tax on their 1099 income.",
      },
      {
        question: "Do Florida LLCs pay state tax on freelance income?",
        answer: "Single-member LLCs and multi-member pass-through LLCs in Florida pay no state income tax. Florida corporate income tax only applies to traditional C-Corporations.",
      },
    ],
    relatedStates: ["TX", "NV", "TN", "GA"],
  },
  NV: {
    code: "NV",
    headline: "Nevada 1099 Freelancer Tax Guide",
    summary: "Nevada has no individual state income tax for freelancers, gig workers, or self-employed professionals.",
    systemDescription: "Nevada does not tax personal income. All independent contractor revenue is exempt from state income tax, meaning your quarterly estimated tax burden is strictly federal.",
    localTaxNote: "Nevada levies a Commerce Tax on businesses with Nevada gross revenue exceeding $4 million per year. Most independent freelancers fall well below this threshold.",
    freelancerTips: [
      "No Nevada quarterly estimated tax payments or state return required.",
      "Freelancers operating as sole proprietors or LLCs must maintain a Nevada State Business License ($200/yr for sole props, $500/yr for LLCs).",
      "Plan federal quarterly installments accurately via IRS Direct Pay.",
    ],
    faqs: [
      {
        question: "Is there any state income tax in Nevada for self-employed workers?",
        answer: "No. Nevada has no personal income tax. Freelancers and 1099 contractors pay only federal income and self-employment taxes.",
      },
      {
        question: "What business fees do Nevada freelancers pay?",
        answer: "Nevada requires an annual state business license through SilverFlume ($200/year for sole proprietors, $500/year for LLCs), but there is no state income tax filing.",
      },
    ],
    relatedStates: ["CA", "AZ", "UT", "WA"],
  },
  NH: {
    code: "NH",
    headline: "New Hampshire 1099 Freelancer Tax Guide",
    summary: "New Hampshire has no state tax on earned freelance wages or contractor profits.",
    systemDescription: "New Hampshire does not tax earned individual income (wages or 1099 profit). The state's Interest and Dividends (I&D) tax has been phased out completely, making NH a true zero-income-tax state for freelancers.",
    localTaxNote: "Businesses with gross business income over $103,000 may be subject to the New Hampshire Business Profits Tax (BPT) or Business Enterprise Tax (BET).",
    freelancerTips: [
      "Freelance service income is exempt from NH state personal income tax.",
      "Keep track of gross receipts if you exceed the $103,000 NH Business Profits Tax threshold.",
      "Pay your federal estimated quarterly taxes on schedule via IRS Form 1040-ES.",
    ],
    faqs: [
      {
        question: "Do self-employed individuals pay NH state income tax?",
        answer: "No. New Hampshire does not tax individual earned income or freelance contract earnings.",
      },
      {
        question: "What is the NH Business Profits Tax (BPT)?",
        answer: "The BPT applies to business entities with gross income over $103,000. Sole proprietors with gross receipts below this threshold do not pay BPT.",
      },
    ],
    relatedStates: ["MA", "ME", "VT", "NY"],
  },
  SD: {
    code: "SD",
    headline: "South Dakota 1099 Freelancer Tax Guide",
    summary: "South Dakota has no individual or corporate income tax on freelance earnings.",
    systemDescription: "South Dakota does not levy any personal state income tax. Freelancers and independent contractors in South Dakota are subject only to federal tax obligations.",
    localTaxNote: "South Dakota has a 4.2% state sales tax. Certain professional services are subject to sales tax in SD, unlike many other states.",
    freelancerTips: [
      "Zero state estimated tax vouchers required in South Dakota.",
      "Check whether your specific service is subject to South Dakota sales tax on professional services.",
      "Budget 25–30% of net profits for federal 1040-ES payments.",
    ],
    faqs: [
      {
        question: "Do South Dakota freelancers pay state income tax?",
        answer: "No. South Dakota has no state personal income tax.",
      },
      {
        question: "Does South Dakota sales tax apply to freelance services?",
        answer: "South Dakota is one of few states that taxes many service categories under its 4.2% sales tax. Check SD Department of Revenue guidelines for your specific industry.",
      },
    ],
    relatedStates: ["ND", "WY", "NE", "MN"],
  },
  TN: {
    code: "TN",
    headline: "Tennessee 1099 Freelancer Tax Guide",
    summary: "Tennessee does not levy any state personal income tax on freelance earnings or independent contractor wages.",
    systemDescription: "Tennessee has no personal income tax on earned wages, 1099 income, or business profits (the Hall Income Tax on dividends was fully phased out in 2021).",
    localTaxNote: "Tennessee has a state sales tax of 7.0% plus local municipal taxes up to 2.75%. Certain businesses with gross receipts over $100,000 may need to register for the Tennessee Business Tax.",
    freelancerTips: [
      "No state quarterly estimated tax payments are needed in Tennessee.",
      "Freelancers with over $100k in gross receipts should check county clerk requirements for the standard business tax license.",
      "Focus your tax savings on IRS 1040-ES quarterly deadlines.",
    ],
    faqs: [
      {
        question: "Does Tennessee tax freelance income?",
        answer: "No. Tennessee does not tax individual earned income or self-employment earnings.",
      },
      {
        question: "Do I need a Tennessee business license as a freelancer?",
        answer: "If your gross receipts exceed $100,000 per year, you must register for a standard business tax license with the TN Department of Revenue.",
      },
    ],
    relatedStates: ["GA", "NC", "KY", "FL"],
  },
  TX: {
    code: "TX",
    headline: "Texas 1099 Freelancer Tax Guide",
    summary: "Texas does not have a state personal income tax. Freelancers and 1099 contractors pay zero state income tax.",
    systemDescription: "The Texas State Constitution prohibits a state personal income tax. Independent contractors in Texas pay only federal taxes (15.3% self-employment tax + federal income tax brackets).",
    localTaxNote: "Texas imposes a Franchise Tax on business entities (LLCs, corporations), but entities with annual revenue below the no-tax-due threshold ($2.47 million) pay $0 in franchise tax and file a simple Information Report.",
    freelancerTips: [
      "Zero state income tax vouchers to submit.",
      "If registered as an LLC in Texas, file the annual Texas Franchise Tax No-Tax-Due Information Report by May 15.",
      "Use IRS Direct Pay or EFTPS for quarterly federal payments.",
    ],
    faqs: [
      {
        question: "Do independent contractors in Texas pay state income tax?",
        answer: "No. Texas has no personal state income tax. Freelancers pay $0 in state income tax.",
      },
      {
        question: "Does Texas Franchise Tax apply to freelance sole proprietors?",
        answer: "Sole proprietorships are not subject to the Texas Franchise Tax. LLCs and corporations are subject, but pay $0 if annual revenue is under the $2.47M threshold.",
      },
    ],
    relatedStates: ["FL", "OK", "LA", "NM"],
  },
  WA: {
    code: "WA",
    headline: "Washington 1099 Freelancer Tax Guide",
    summary: "Washington State has no personal income tax on freelance earnings or independent contractor wages.",
    systemDescription: "Washington State does not tax personal earned income. Freelancers pay zero state personal income tax, but should be aware of the state Business & Occupation (B&O) tax.",
    localTaxNote: "Washington levies a Business & Occupation (B&O) gross receipts tax. Small businesses with annual gross revenue below $125,000 for service activities generally qualify for the Small Business B&O Tax Credit, resulting in zero tax liability.",
    freelancerTips: [
      "No personal state income tax filing required.",
      "Register with the WA Department of Revenue to file your annual or quarterly B&O tax return.",
      "Use the WA Small Business B&O Tax Credit to offset gross receipts tax if revenue is under the threshold.",
    ],
    faqs: [
      {
        question: "Is there state income tax in Washington for 1099 workers?",
        answer: "No. Washington has no personal income tax on freelance earnings.",
      },
      {
        question: "What is the Washington B&O tax for freelancers?",
        answer: "The B&O tax is a gross receipts tax (typically 1.5% for service businesses). However, businesses with service gross income below $125,000/year often pay $0 after the Small Business Tax Credit.",
      },
    ],
    relatedStates: ["OR", "ID", "CA", "NV"],
  },
  WY: {
    code: "WY",
    headline: "Wyoming 1099 Freelancer Tax Guide",
    summary: "Wyoming has no personal or corporate state income tax on freelance earnings.",
    systemDescription: "Wyoming is consistently ranked among the most tax-friendly states in the US. There is no personal income tax, no corporate income tax, and no gross receipts tax on freelancers.",
    localTaxNote: "Wyoming has a 4.0% state sales tax, with county additions up to 2.0%. Most pure digital and professional services are exempt.",
    freelancerTips: [
      "No state tax forms or quarterly vouchers in Wyoming.",
      "All quarterly payments go directly to the IRS on Form 1040-ES.",
      "Wyoming LLCs are popular for privacy and low annual report fees ($60/yr).",
    ],
    faqs: [
      {
        question: "Do freelancers in Wyoming pay state income tax?",
        answer: "No. Wyoming has zero state income tax for individuals and businesses.",
      },
      {
        question: "How do Wyoming freelancers pay quarterly taxes?",
        answer: "You only pay federal taxes using IRS Direct Pay or EFTPS by the quarterly IRS deadlines.",
      },
    ],
    relatedStates: ["CO", "MT", "SD", "UT"],
  },

  // ─── Key Progressive & Flat Tax States ───
  CA: {
    code: "CA",
    headline: "California 1099 Freelancer Tax Guide",
    summary: "California uses graduated tax brackets from 1.0% up to 13.3%, making state tax planning essential for independent contractors.",
    systemDescription: "California has the highest top marginal state income tax rate in the nation (13.3%, which includes the 1% Mental Health Services Tax on taxable income over $1,000,000). State tax is administered by the Franchise Tax Board (FTB).",
    localTaxNote: "San Francisco has a separate Gross Receipts Tax. LLCs in California must pay an annual $800 minimum franchise tax to the FTB.",
    freelancerTips: [
      "California quarterly estimated taxes use FTB Form 540-ES and are due on April 15, June 15, Sept 15, and Jan 15.",
      "Note the CA payment allocation: 30% (Q1), 40% (Q2), 0% (Q3), 30% (Q4) under California FTB rules if using standard method.",
      "The $800 CA annual LLC tax is due on the 15th day of the 4th month of your tax year.",
    ],
    faqs: [
      {
        question: "How do I pay California quarterly estimated taxes?",
        answer: "You can pay online via FTB Web Pay at ftb.ca.gov using Form 540-ES, or mail a check with voucher Form 540-ES.",
      },
      {
        question: "What are California's 2026 tax brackets for freelancers?",
        answer: "California brackets range from 1% on the first ~$10,412 up to 12.3% on income over $698k, plus a 1% Mental Health Services Tax on taxable income over $1,000,000 (total top rate 13.3%).",
      },
    ],
    relatedStates: ["NY", "WA", "OR", "NV"],
  },
  NY: {
    code: "NY",
    headline: "New York 1099 Freelancer Tax Guide",
    summary: "New York State personal income tax ranges from 4.0% to 10.9%, with additional local taxes for NYC and Yonkers residents.",
    systemDescription: "New York State uses progressive tax brackets from 4.0% to 10.9%. Administered by the New York State Department of Taxation and Finance using Form IT-2105 for quarterly estimated payments.",
    localTaxNote: "New York City residents pay an additional NYC personal income tax (3.078% to 3.876%). NYC also imposes the Unincorporated Business Tax (UBT) of 4% on freelance businesses with net income over $100k.",
    freelancerTips: [
      "File NY state estimated taxes via Form IT-2105 on the NY Department of Taxation & Finance online services portal.",
      "If you live in NYC, remember that NYC personal income tax is reported directly on your NY state return.",
      "NYC freelancers with over $100k net profit should evaluate the NYC UBT credit.",
    ],
    faqs: [
      {
        question: "How do New York freelancers make quarterly estimated tax payments?",
        answer: "Pay online at tax.ny.gov using NY State Online Services and Form IT-2105 (Estimated Tax Payment Voucher for Individuals).",
      },
      {
        question: "Do NYC freelancers pay extra tax?",
        answer: "Yes. NYC residents pay NYC local income tax (up to 3.876%) in addition to NY State tax. Freelance businesses in NYC may also be subject to the Unincorporated Business Tax (UBT).",
      },
    ],
    relatedStates: ["NJ", "CT", "PA", "CA"],
  },
  TX_FL_COMPARISON: {
    code: "TX",
    headline: "Texas vs Florida 1099 Tax Comparison",
    summary: "Both Texas and Florida offer 0% personal state income tax for freelancers.",
    systemDescription: "",
    freelancerTips: [],
    faqs: [],
    relatedStates: ["TX", "FL"],
  },
  AZ: {
    code: "AZ",
    headline: "Arizona 1099 Freelancer Tax Guide",
    summary: "Arizona uses a 2.5% flat individual income tax rate on taxable income.",
    systemDescription: "Arizona transitioned to a flat 2.5% individual income tax rate. Arizona standard deduction conforms closely to the federal standard deduction ($14,600 single / $29,200 married).",
    localTaxNote: "Arizona cities may levy Transaction Privilege Tax (TPT) on certain business activities.",
    freelancerTips: [
      "Arizona uses Form 140ES for quarterly estimated payments via AZTaxes.gov.",
      "The 2.5% flat rate makes state tax calculation simple: state taxable income × 2.5%.",
    ],
    faqs: [
      {
        question: "What is Arizona's 2026 state income tax rate?",
        answer: "Arizona has a flat 2.5% individual income tax rate for all taxable income brackets.",
      },
    ],
    relatedStates: ["CA", "NV", "CO", "UT"],
  },
  CO: {
    code: "CO",
    headline: "Colorado 1099 Freelancer Tax Guide",
    summary: "Colorado levies a flat 4.4% state income tax on federal modified taxable income.",
    systemDescription: "Colorado uses a flat 4.4% individual income tax rate based directly on your federal taxable income.",
    localTaxNote: "Denver and certain other cities levy an Occupational Privilege Tax (OPT) of $5.75/month for individuals earning over $500/month.",
    freelancerTips: [
      "Pay Colorado quarterly taxes using Form DR 0104EP on Revenue Online (tax.colorado.gov).",
      "Colorado taxable income starts from your federal taxable income line.",
    ],
    faqs: [
      {
        question: "What is Colorado's flat income tax rate?",
        answer: "Colorado has a flat 4.4% state income tax rate on federal taxable income.",
      },
    ],
    relatedStates: ["UT", "AZ", "NM", "WY"],
  },
  IL: {
    code: "IL",
    headline: "Illinois 1099 Freelancer Tax Guide",
    summary: "Illinois uses a flat 4.95% state income tax rate on net taxable income.",
    systemDescription: "Illinois levies a flat 4.95% income tax. State estimated payments are filed via Form IL-1040-ES with the Illinois Department of Revenue.",
    localTaxNote: "Illinois does not allow municipal local income taxes on individuals.",
    freelancerTips: [
      "Use MyTax Illinois (mytax.illinois.gov) to pay Form IL-1040-ES quarterly vouchers.",
      "Illinois offers a personal exemption allowance that reduces net income before applying the 4.95% rate.",
    ],
    faqs: [
      {
        question: "What is the Illinois state income tax rate for freelancers?",
        answer: "Illinois uses a flat 4.95% state individual income tax rate.",
      },
    ],
    relatedStates: ["IN", "WI", "MI", "MO"],
  },
  NC: {
    code: "NC",
    headline: "North Carolina 1099 Freelancer Tax Guide",
    summary: "North Carolina levies a 4.5% flat state income tax rate with scheduled future reductions.",
    systemDescription: "North Carolina uses a flat 4.5% individual income tax rate, administered by the North Carolina Department of Revenue (NCDOR).",
    freelancerTips: [
      "Pay NC estimated taxes using Form NC-40 on the NCDOR eServices portal.",
      "North Carolina provides a generous standard deduction ($12,750 single / $25,500 married).",
    ],
    faqs: [
      {
        question: "What is the North Carolina 2026 flat tax rate?",
        answer: "North Carolina's flat individual income tax rate is 4.5% for the 2026 tax year.",
      },
    ],
    relatedStates: ["SC", "VA", "GA", "TN"],
  },
  PA: {
    code: "PA",
    headline: "Pennsylvania 1099 Freelancer Tax Guide",
    summary: "Pennsylvania has a flat 3.07% state income tax rate, plus local earned income taxes.",
    systemDescription: "Pennsylvania levies a flat 3.07% state income tax on gross compensation and net business profit, with no standard deduction. Administered by the PA Department of Revenue.",
    localTaxNote: "Most PA municipalities and school districts levy a local Earned Income Tax (EIT) ranging from 1% to nearly 4% (e.g. Philadelphia wage tax is 3.75% for residents).",
    freelancerTips: [
      "File PA state estimated taxes using Form PA-40ES on myPATH (mypath.pa.gov).",
      "PA does not allow a standard deduction — tax applies to total net business profit.",
      "Remember to file local EIT returns with your local tax collector (e.g. Berkheimer, Keystone).",
    ],
    faqs: [
      {
        question: "What is Pennsylvania's flat tax rate?",
        answer: "Pennsylvania has a 3.07% flat state tax rate. Local earned income taxes (EIT) often add another 1% to 3.75%.",
      },
    ],
    relatedStates: ["NJ", "NY", "OH", "MD"],
  },
  GA: {
    code: "GA",
    headline: "Georgia 1099 Freelancer Tax Guide",
    summary: "Georgia uses a flat 5.39% individual income tax rate on taxable freelance income.",
    systemDescription: "Georgia transitioned from progressive brackets to a flat 5.39% rate. Administered by the Georgia Department of Revenue.",
    freelancerTips: [
      "Pay Georgia estimated taxes via Form 500ES on the Georgia Tax Center portal (gtc.dor.ga.gov).",
      "Georgia provides standard deductions of $12,000 (single) and $24,000 (married).",
    ],
    faqs: [
      {
        question: "What is the Georgia flat income tax rate?",
        answer: "Georgia's state individual income tax rate is a flat 5.39%.",
      },
    ],
    relatedStates: ["FL", "NC", "SC", "TN"],
  },
  NJ: {
    code: "NJ",
    headline: "New Jersey 1099 Freelancer Tax Guide",
    summary: "New Jersey uses progressive tax brackets ranging from 1.4% to 10.75% for high earners.",
    systemDescription: "New Jersey has progressive brackets starting at 1.4% and reaching 10.75% on taxable income over $1,000,000. Administered by the NJ Division of Taxation.",
    freelancerTips: [
      "Pay NJ quarterly taxes via Form NJ-1040-ES on the NJ Division of Taxation online portal.",
      "New Jersey has relatively low standard deductions, so most net freelance income is taxable.",
    ],
    faqs: [
      {
        question: "What are New Jersey's tax brackets for freelancers?",
        answer: "New Jersey brackets range from 1.4% on lower earnings up to 10.75% on income exceeding $1,000,000.",
      },
    ],
    relatedStates: ["NY", "PA", "DE", "CT"],
  },
  MA: {
    code: "MA",
    headline: "Massachusetts 1099 Freelancer Tax Guide",
    summary: "Massachusetts levies a 5.0% flat income tax rate, plus a 4.0% surtax on income exceeding $1 million.",
    systemDescription: "Massachusetts has a baseline 5.0% flat tax on taxable income, with a 4% 'millionaire tax' surtax on annual taxable income exceeding $1,000,000 (effective rate 9%).",
    freelancerTips: [
      "Pay MA quarterly taxes using Form 1-ES on MassTaxConnect (mtc.dor.state.ma.us).",
      "Massachusetts allows a personal exemption of $4,400 (single) / $8,800 (married).",
    ],
    faqs: [
      {
        question: "What is the Massachusetts state income tax rate?",
        answer: "Massachusetts has a flat 5.0% tax rate on earned income. Income above $1,000,000 is subject to an additional 4% surtax.",
      },
    ],
    relatedStates: ["NH", "RI", "CT", "NY"],
  },
  OH: {
    code: "OH",
    headline: "Ohio 1099 Freelancer Tax Guide",
    summary: "Ohio has progressive brackets up to 3.5%, with $0 tax on income under $26,050.",
    systemDescription: "Ohio taxes income over $26,050 at graduated rates up to 3.5%. The first $26,050 is taxed at 0%.",
    localTaxNote: "Many Ohio cities (Cleveland, Columbus, Cincinnati) levy municipal income taxes of 1.5% to 2.5% administered through RITA or CCA.",
    freelancerTips: [
      "Pay Ohio state estimated taxes via Form IT 1040ES on the Ohio Department of Taxation portal.",
      "Check RITA (ritaohio.com) to see if you owe municipal income tax to your city.",
    ],
    faqs: [
      {
        question: "Does Ohio have local municipal taxes for freelancers?",
        answer: "Yes. Many Ohio cities charge municipal income tax (1.5% - 2.5%) on freelance net profits, often administered through RITA.",
      },
    ],
    relatedStates: ["PA", "MI", "IN", "KY"],
  },
  VA: {
    code: "VA",
    headline: "Virginia 1099 Freelancer Tax Guide",
    summary: "Virginia uses progressive tax brackets from 2.0% up to 5.75% on taxable income over $17,000.",
    systemDescription: "Virginia has four brackets: 2% ($0–$3k), 3% ($3k–$5k), 5% ($5k–$17k), and 5.75% (over $17k). Most full-time freelancers pay the top 5.75% marginal rate.",
    freelancerTips: [
      "File Virginia quarterly vouchers using Form 760ES on Virginia Tax Online.",
      "Virginia standard deduction is $8,500 (single) / $17,000 (married).",
    ],
    faqs: [
      {
        question: "What is Virginia's top tax bracket?",
        answer: "Virginia's top tax bracket is 5.75% on taxable income exceeding $17,000.",
      },
    ],
    relatedStates: ["MD", "NC", "DC", "WV"],
  },
  DC: {
    code: "DC",
    headline: "Washington D.C. 1099 Freelancer Tax Guide",
    summary: "District of Columbia uses progressive tax brackets ranging from 4.0% to 10.75%.",
    systemDescription: "Washington D.C. has progressive brackets starting at 4.0% and reaching 10.75% for income over $1,000,000. D.C. also has an Unincorporated Business Franchise Tax for businesses with gross receipts over $12,000.",
    freelancerTips: [
      "File D.C. estimated taxes via Form D-40ES on MyTax.DC.gov.",
      "D.C. conforms to federal standard deductions ($14,600 single / $29,200 married).",
    ],
    faqs: [
      {
        question: "How do D.C. freelancers pay quarterly estimated taxes?",
        answer: "Use Form D-40ES on MyTax.DC.gov to submit quarterly payments to the D.C. Office of Tax and Revenue.",
      },
    ],
    relatedStates: ["MD", "VA"],
  },
  MD: {
    code: "MD",
    headline: "Maryland 1099 Freelancer Tax Guide",
    summary: "Maryland state income tax reaches 5.75%, plus mandatory county piggyback taxes of 2.25% to 3.20%.",
    systemDescription: "Maryland has state tax brackets from 2% to 5.75%, plus county income taxes of 2.25%–3.20% (e.g. Montgomery and Baltimore counties are 3.20%), bringing the total effective state/local rate to 8%–8.95%.",
    localTaxNote: "County income taxes are combined with the state return on Form 502, but must be factored into quarterly estimated payments.",
    freelancerTips: [
      "Pay combined MD state + county estimated taxes using Form 502D via bfile on MarylandTaxes.gov.",
      "Always include your county tax rate when calculating quarterly set-asides.",
    ],
    faqs: [
      {
        question: "Why is Maryland tax higher than just the 5.75% state rate?",
        answer: "Maryland mandates a local county tax of 2.25% to 3.20% on top of the state rate, making the top combined rate 8.95%.",
      },
    ],
    relatedStates: ["VA", "DC", "PA", "DE"],
  },
};

/**
 * Returns state-specific content or a high-quality fallback for any of the 50 states + DC.
 */
export function getStateContent(code: string, name: string, isNoTax: boolean): StateContent {
  if (STATE_CONTENT[code]) {
    return STATE_CONTENT[code];
  }

  if (isNoTax) {
    return {
      code,
      headline: `${name} 1099 Freelancer Tax Guide`,
      summary: `${name} does not impose a state personal income tax on freelance or contractor earnings.`,
      systemDescription: `${name} is one of nine US states with no personal income tax on earned freelance income. Freelancers in ${name} pay only federal self-employment tax (15.3%) and regular federal income tax.`,
      freelancerTips: [
        `No ${name} state quarterly estimated tax vouchers are required.`,
        "Make all quarterly payments to the IRS using Form 1040-ES.",
        "Budget 25%–30% of net earnings for federal tax liabilities.",
      ],
      faqs: [
        {
          question: `Do freelancers in ${name} pay state income tax?`,
          answer: `No. ${name} has no state personal income tax on freelance or 1099 earnings.`,
        },
        {
          question: `How do I pay quarterly taxes in ${name}?`,
          answer: `You only need to submit federal quarterly payments to the IRS via Direct Pay or EFTPS by the 1040-ES deadlines.`,
        },
      ],
      relatedStates: ["TX", "FL", "WA", "NV"],
    };
  }

  return {
    code,
    headline: `${name} 1099 Freelancer Tax Guide`,
    summary: `Calculate your 2026 federal and ${name} state estimated quarterly taxes as an independent contractor or freelancer.`,
    systemDescription: `Freelancers in ${name} pay federal self-employment tax (15.3%), federal income tax, and ${name} state income tax on net Schedule C profits.`,
    freelancerTips: [
      `Track your net business profit quarterly to estimate ${name} state and federal tax obligations.`,
      `Check the ${name} Department of Revenue website for official quarterly voucher forms and online payment portals.`,
      "Deduct allowable business expenses (mileage, home office, software, equipment) to reduce taxable income.",
    ],
    faqs: [
      {
        question: `Do freelancers in ${name} need to make quarterly estimated tax payments?`,
        answer: `Yes. If you expect to owe at least $1,000 in federal tax (and state threshold amounts in ${name}), you should submit quarterly estimated payments to avoid underpayment penalties.`,
      },
      {
        question: `What expenses can I deduct as a 1099 worker in ${name}?`,
        answer: `You can deduct ordinary and necessary business expenses: business mileage ($0.725/mi in 2026), home office, computer gear, software subscriptions, phone/internet, and health insurance.`,
      },
    ],
    relatedStates: ["CA", "NY", "TX", "FL"],
  };
}
