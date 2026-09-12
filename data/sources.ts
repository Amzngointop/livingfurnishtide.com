import type { Source } from './types.ts'

/*
 * Every external source the site links. Each URL was opened with a GET
 * request; the ones marked browser returned a firewall page (403) to scripts
 * and were confirmed by opening them in a browser (R20).
 * CPSC is linked exactly once, from /words/anti-tip.
 */

export const SOURCES = {
  cpscClothingStorage: {
    label: 'CPSC: Clothing Storage Units, business guidance',
    url: 'https://www.cpsc.gov/Business--Manufacturing/Business-Education/Business-Guidance/Clothing-Storage-Units',
  },
  cfr1261: {
    label: '16 CFR Part 1261, Safety Standard for Clothing Storage Units (Cornell LII)',
    url: 'https://www.law.cornell.edu/cfr/text/16/part-1261',
  },
  astmF2057: {
    label: 'ASTM F2057-23, Standard Safety Specification for Clothing Storage Units',
    url: 'https://store.astm.org/f2057-23.html',
  },
  ftcDeception: {
    label: 'FTC Policy Statement on Deception',
    url: 'https://www.ftc.gov/legal-library/browse/ftc-policy-statement-deception',
  },
  ftcSubstantiation: {
    label: 'FTC Policy Statement Regarding Advertising Substantiation',
    url: 'https://www.ftc.gov/legal-library/browse/ftc-policy-statement-regarding-advertising-substantiation',
  },
  ftcAdFaq: {
    label: "FTC: Advertising FAQ's, A Guide for Small Business",
    url: 'https://www.ftc.gov/business-guidance/resources/advertising-faqs-guide-small-business',
  },
  bifmaStandards: {
    label: 'BIFMA: Standards Descriptions',
    url: 'https://www.bifma.org/page/StandardsShortDesc',
  },
  oshaNrtl: {
    label: "OSHA: Nationally Recognized Testing Laboratory Program",
    url: 'https://www.osha.gov/nationally-recognized-testing-laboratory-program',
  },
  furnitureGuidesRescinded: {
    label: 'Federal Register, March 5, 2002: rescission of the FTC Guides for the Household Furniture Industry',
    url: 'https://www.govinfo.gov/content/pkg/FR-2002-03-05/html/02-5126.htm',
  },
  cfr770Definitions: {
    label: '40 CFR 770.3, Definitions for composite wood products (Cornell LII)',
    url: 'https://www.law.cornell.edu/cfr/text/40/770.3',
  },
  cfr1000_23: {
    label: '16 CFR 1000.23, Office of Information and Technology Services (Cornell LII)',
    url: 'https://www.law.cornell.edu/cfr/text/16/1000.23',
  },
} satisfies Record<string, Source>

export type SourceKey = keyof typeof SOURCES

/**
 * Citation facts read from the documents above. Prose reaches them through
 * {f:key} so no figure is typed into a sentence (R18).
 */
export const FACTS: Record<string, string> = {
  'csu-part': '16 CFR part 1261',
  'csu-date': 'September 1, 2023',
  'csu-height': '27 inches',
  'csu-mass': '30 pounds',
  'csu-volume': '3.2 cubic feet',
  'astm-csu': 'ASTM F2057-23',
  'astm-device': 'ASTM F3096',
  'bifma-chairs': 'ANSI/BIFMA X5.1',
  'bifma-desks': 'ANSI/BIFMA X5.5',
  'guides-rescinded': 'March 5, 2002',
  'deception-year': '1983',
}

export const sources = (...keys: SourceKey[]): Source[] => keys.map((k) => SOURCES[k])
