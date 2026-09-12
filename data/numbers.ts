import { numberScope, numberWordSide, SCOPE_RULE } from '../lib/catalog.ts'
import { sources } from './sources.ts'
import type { NumberSlug, Source, WordSlug } from './types.ts'

/*
 * Five figures that would settle a word, and how rarely they are printed.
 * Same prose conventions as data/words.ts.
 */

export interface NumberPage {
  slug: NumberSlug
  title: string
  seoPhrase: string
  metaDescription: string
  whatItIs: string
  /** Short cell for the home numbers table. */
  whatItDecides: string
  lede: string
  body: string[]
  sources: Source[]
  assumes: Record<string, number | string>
  scopeRule: string
  wordPages: WordSlug[]
  phrases: string[]
}

type Draft = Omit<NumberPage, 'scopeRule' | 'wordPages' | 'phrases'>

const drafts: Draft[] = [
  {
    slug: 'weight-capacity',
    title: 'Weight capacity',
    seoPhrase: 'How rarely furniture listings print a weight capacity',
    metaDescription:
      'A weight capacity is the figure that could settle sturdy and heavy-duty. How many furniture listings here print one, in which categories, and which stay silent.',
    whatItIs: 'A load figure the seller prints for the piece or for one part of it, such as a desktop or a seat.',
    whatItDecides: 'Whether sturdy and heavy-duty have anything under them',
    lede:
      '{W:stating:weight-capacity} of {w:products} listings print a weight capacity. {W:load-figure:common-count} of them print the same figure, [[176 lbs]], and all of those are electric standing desks.',
    body: [
      'The other figure is [[330 LBS]], on a TRALT desk chair. Those are the only {w:load-figure:distinct} load figures in the catalog, and they sit in {w:stating-cats:weight-capacity} categories out of {w:categories}.',
      'A printed capacity is the seller’s statement. This site repeats it as printed. It does not confirm that a piece carries that load, does not estimate a load where none is printed, and does not read a missing figure as a lower one.',
      'Shelves are where the silence is plainest. No bookcase, shoe rack or dresser listing gives a load for a shelf, a tier, a drawer or a top, although every one of them is sold to hold things.',
      'BIFMA publishes test standards for office chairs and for desk and table products. None of the listings that print a capacity names a test or a standard next to the figure, so the site records the figure and nothing about how it was reached.',
    ],
    sources: sources('bifmaStandards', 'ftcSubstantiation'),
    assumes: {
      'stating:weight-capacity:desks': 3,
      'sub:desks:electric-standing': 4,
      'stating:weight-capacity:shoe-racks': 0,
      'stating:weight-capacity:bookcases': 0,
      'stating:weight-capacity:dressers': 0,
    },
  },
  {
    slug: 'assembled-dimensions',
    title: 'Assembled dimensions',
    seoPhrase: 'Which furniture listings print their assembled dimensions',
    metaDescription:
      'Assembled dimensions would settle space-saving and expandable. How many furniture listings print a size, how many print a full set, and which print none.',
    whatItIs: 'The size of the piece once it is put together, printed in inches as a single figure, a pair or a full set.',
    whatItDecides: 'Whether space-saving and expandable mean anything in inches',
    lede:
      '{W:stating:assembled-dimensions} listings print at least one measurement. {W:axes:3} print all three.',
    body: [
      'Chairs and dressers print none. That is {w:no-dims-seats-and-drawers} listings without a single size figure, including the dressers whose titles call them [[tall]] or [[wide]].',
      'Desks print a size on every listing, usually as a single figure such as [[63 inches]] or [[55 inches]]. The site records the figure as printed and does not guess which way it runs.',
      'Shoe racks mostly print a width and nothing else. A single width counts here as a stated dimension and is marked as width only; depth and height are not filled in from the photo or from a similar rack.',
      'Bookcases split cleanly: {w:stating:assembled-dimensions:bookcases} print a full set of dimensions and {w:silent:assembled-dimensions:bookcases} print none. The specification the federal rule for clothing storage units adopts, {f:astm-csu}, sets its scope by height and mass, and a dresser listing that prints neither leaves a reader with nothing to check that scope against.',
    ],
    sources: sources('ftcAdFaq', 'astmF2057', 'cfr1261'),
    assumes: {
      'stating:assembled-dimensions:chairs': 0,
      'stating:assembled-dimensions:dressers': 0,
      'silent:assembled-dimensions:desks': 0,
      'axes:3:bookcases': 4,
    },
  },
  {
    slug: 'capacity-in-pairs-drawers-and-tiers',
    title: 'Capacity in pairs, drawers and tiers',
    seoPhrase: 'Pairs, drawers and tiers as the capacity figures listings print',
    metaDescription:
      'A count of pairs, drawers or tiers is the figure most storage listings print. Where it appears, why a tier count says little about shoes, where it is absent.',
    whatItIs: 'A count of what the piece holds or how it divides: pairs of shoes on a rack, drawers in a dresser, tiers or cubes in a bookcase.',
    whatItDecides: 'How much a rack holds, in the unit a shoe rack is bought for',
    lede:
      'Every rack, bookcase and dresser listing counts its tiers, cubes or drawers. Only {w:pairs} of the {w:cat:shoe-racks} shoe rack listings count pairs.',
    body: [
      'For a shoe rack this page counts pairs, not tiers. The tier count is already in every rack title, and it does not say how many shoes a tier takes. The pair counts that do appear are ranges or floors: [[16 to 20 pairs]], [[12 or more pairs]], [[6 to 9 pairs]].',
      'The site does not turn pairs, drawers or tiers into weight, volume or anything else. A drawer count is a drawer count.',
      'The words this figure would settle turn up rarely: [[large-capacity]] on a Kitsure rack and [[large storage]] on a Sweetcrispy dresser. The Kitsure listing gives tiers and a width and no pair count.',
      'Dressers are counted by drawers, and every dresser title prints the number. A couple of listings call them [[bins]] in the description; the site counts a bin as a drawer when the title does.',
    ],
    sources: sources('ftcAdFaq', 'ftcDeception'),
    assumes: { 'silent:capacity-in-pairs-drawers-and-tiers:dressers': 0, 'silent:capacity-in-pairs-drawers-and-tiers:bookcases': 0, 'phrase:bins:dressers': 2 },
  },
  {
    slug: 'what-the-top-is-made-of',
    title: 'What the top is made of',
    seoPhrase: 'What desk and dresser listings say their tops are made of',
    metaDescription:
      'A material for the top would settle wood-sounding color names. Which desk and dresser listings name a material, which print only a color, and what goes unsaid.',
    whatItIs: 'The material of the surface on top of the piece, printed as a material rather than as a color or a finish.',
    whatItDecides: 'Whether a wood-toned name means wood',
    lede:
      '{W:stating:what-the-top-is-made-of} listings name a material for the top. All of them are dressers, and all of them say wood: [[wooden top]] or [[wood tabletop]]. No desk listing names what its top is made of.',
    body: [
      'Desks are sold under color names that sound like a material: [[Rustic Brown]], [[Maple]]. The site reads those as names printed by the seller, not as a statement of what the desktop is.',
      '[[Wood Grain]] in a WLIVE dresser title describes a look. The same listing separately prints [[a smooth wood tabletop]], and the site counts the second phrase, not the first.',
      'Beyond the seller’s words, the site says nothing about how a top was made or what is under its surface.',
      'For a sense of how exact a material word can be: federal rules on composite wood define particleboard and medium-density fiberboard as panels of cellulosic particles or fibers pressed with resin. None of the listings here uses either term. The FTC rescinded its Guides for the Household Furniture Industry on {f:guides-rescinded}.',
    ],
    sources: sources('cfr770Definitions', 'furnitureGuidesRescinded'),
    assumes: { 'stating:what-the-top-is-made-of:desks': 0, 'phrase:particleboard': 0, 'phrase:fiberboard': 0 },
  },
  {
    slug: 'what-holds-it-to-the-wall',
    title: 'What holds it to the wall',
    seoPhrase: 'Whether furniture listings name a part that holds them to a wall',
    metaDescription:
      'A named wall attachment part is the figure that could settle anti-tip. How many dresser, bookcase and other listings name one, and what goes undescribed.',
    whatItIs: 'The name of a part packed with the piece to connect it to a wall, as printed by the seller.',
    whatItDecides: 'Whether anti-tip names a part or only a design',
    lede:
      '{Z:wall} {p:wall|listing|listings} in the catalog {p:wall|names|name} a wall attachment part. {W:antitip} {p:antitip|listing|listings} {p:antitip|prints|print} the word [[anti-tip]] without naming one.',
    body: [
      'That count covers all {w:products} listings, and the count is the whole finding. It does not decide which pieces need such a part and which do not.',
      'The federal standard for clothing storage units, {f:csu-part}, adopts {f:astm-csu}. That specification sets its scope by height and mass and states that it does not cover shelving units such as bookcases.',
      'Where a part is not named, this site does not guess what is packed with the piece, and it does not describe how any part is fitted. That belongs to the manufacturer’s instructions and to a person who does that kind of work.',
    ],
    sources: sources('cfr1261', 'astmF2057'),
    assumes: { wall: 0, antitip: 1 },
  },
]

export const numbers: NumberPage[] = drafts.map((d) => {
  const side = numberWordSide(d.slug)
  return { ...d, scopeRule: SCOPE_RULE[d.slug], wordPages: side.pages, phrases: side.phrases }
})

export const numberBySlug = (slug: string) => numbers.find((n) => n.slug === slug)

export { numberScope }
