export type CategorySlug = 'shoe-racks' | 'desks' | 'bookcases' | 'chairs' | 'dressers'

export type WordSlug =
  | 'sturdy'
  | 'heavy-duty'
  | 'ergonomic-and-lumbar-support'
  | 'space-saving-and-compact'
  | 'stackable-and-expandable'
  | 'anti-tip'

export type NumberSlug =
  | 'weight-capacity'
  | 'assembled-dimensions'
  | 'capacity-in-pairs-drawers-and-tiers'
  | 'what-the-top-is-made-of'
  | 'what-holds-it-to-the-wall'

export type PieceSlug = 'the-rack' | 'the-desk' | 'the-bookcase' | 'the-chair' | 'the-dresser'

export interface Source {
  label: string
  url: string
}

/** How a badge is re-derived from data by scripts/check-numbers.mjs (R14). */
export type BadgeRule =
  | { kind: 'max' | 'min'; metric: 'tiers' | 'drawers' | 'largestInch' | 'smallestInch' | 'wordCount'; value: number }
  | { kind: 'flag'; value: string }

export interface Badge {
  label: string
  /** Printed on the card. May carry {tokens}. */
  basis: string
  rule: BadgeRule
}

/** Facts copied from the listing text supplied for this catalog. Nothing here is inferred. */
export interface ProductFacts {
  asin: string
  name: string
  /** Exact brand string at the start of the title, or null when the title names no brand. */
  brand: string | null
  category: CategorySlug
  subgroup: string
  pieceSlug: PieceSlug
  /** Order inside the category, continuous across subgroups. Never printed. */
  rank: number
  /** Short label for tables and lists; unique inside its category (R11). */
  shortLabel: string
  /** What the listing states, in plain words. */
  listingStates: string
  wordsUsed: WordSlug[]
  statedCapacity: string | null
  statedDimensions: string | null
  statedUnitCount: string | null
  statedTopMaterial: string | null
  statedWallAttachment: string | null
  statesAntiTip: boolean
  /** Memory presets on electric desks, as stated. */
  statedPresets: number | null
  /** A dresser that also calls itself something else, and where it says so. */
  alsoCalled: { as: string; where: 'title' | 'listing text' } | null
  /** Takes mains power by its own description (electric lift, outlet, light). */
  powered: boolean
  statesSafetyListing: boolean
  /** Short stated features for comparison tables. */
  features: string[]
  /** Facts a badge can rest on. Each flag is checked for uniqueness inside the category. */
  flags: string[]
  imageUrl: string
}

export interface ProductCopy {
  summary: string
  pros: [string, string, string, string]
  cons: [string, string, string]
  bestFor: string
  badge?: Badge
  /** A card note in the listing's own terms, such as a place of use the site does not extend. */
  note?: string
}

export type Product = ProductFacts & ProductCopy & { affiliateUrl: string }
