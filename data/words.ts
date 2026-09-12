import { alsoStating, SETTLING, usedBy, WORD_FORMS } from '../lib/catalog.ts'
import { sources } from './sources.ts'
import type { NumberSlug, Source, WordSlug } from './types.ts'

/*
 * Six words that do load-bearing work in these titles. Prose conventions:
 * [[...]] marks the seller's own words and renders as a marked quotation;
 * {tokens} are filled from the catalog. `assumes` pins every count a
 * sentence relies on without a token; scripts/check-numbers.mjs fails the
 * build if the data stops agreeing with the sentence.
 */

export interface Word {
  slug: WordSlug
  title: string
  seoPhrase: string
  metaDescription: string
  /** What the word would have to mean to be checkable. Also the ledger cell. */
  whatItWouldMean: string
  settlingNumberSlug: NumberSlug | null
  /** Ledger cell for the figure column. */
  settlingFigure: string
  whoDefinesIt: string
  usedBy: string[]
  alsoStatingNumber: string[]
  whatItDoesNotPromise: string
  forms: string[]
  lede: string
  body: string[]
  sources: Source[]
  assumes: Record<string, number | string>
}

type Draft = Omit<Word, 'usedBy' | 'alsoStatingNumber' | 'settlingNumberSlug' | 'forms'>

const drafts: Draft[] = [
  {
    slug: 'sturdy',
    title: 'Sturdy',
    seoPhrase: 'What sturdy stands in for on furniture listings',
    metaDescription:
      'Sturdy is the most printed adjective in this furniture catalog. What the word would need to mean, the load figure that could settle it, and who prints both.',
    whatItWouldMean: 'That the piece carries a load someone has put a number on.',
    settlingFigure: 'A stated weight capacity',
    whoDefinesIt:
      'No document linked here defines it for furniture. The FTC’s deception policy says the Commission generally will not pursue obviously exaggerated or puffing claims that ordinary buyers do not take seriously, and its substantiation policy says objective claims carry an implied reasonable basis. Which of the two a particular [[sturdy]] is, this site does not decide.',
    whatItDoesNotPromise: 'A load figure. The word does not say how much, on which part, or measured how.',
    lede:
      '{W:used:sturdy} listings in this catalog print [[sturdy]], the most for any word the site tracks. {O:also:sturdy} of them {p:also:sturdy|prints|print} a weight capacity beside it.',
    body: [
      'Sellers rarely call the whole piece sturdy. They pin the word on a part: [[a sturdy metal frame]], [[a sturdy wire grid]], [[a sturdy steel frame]], [[a sturdy build]]. The frame gets the adjective, and the frame gets no figure.',
      'The listings that do print a weight capacity are {w:stating:weight-capacity:desks} desks and {w:stating:weight-capacity:chairs} {p:stating:weight-capacity:chairs|chair|chairs}, and they reach for other words or none. {W:phrase:stable steel frame:desks} of those desks print [[a stable steel frame]], and the other prints no frame word at all. None of the listings with a capacity prints sturdy.',
      'A capacity figure would not make a piece stronger or weaker on the page. It would give the word something to stand on. Without one, [[sturdy]] reads the same on a small shoe rack as on a dresser with a wooden top, and the site has no way to tell the two uses apart.',
      'Nearby words get counted separately rather than folded in. [[Stable steel frame]] is printed on {w:phrase:stable steel frame} listings, [[reinforcement structure]] on {w:phrase:reinforcement structure} and [[non-slip]] on {w:phrase:non-slip}. They sit in the same register as sturdy, but they are different words, and this page only counts the word in its title.',
    ],
    sources: sources('ftcDeception', 'ftcSubstantiation', 'bifmaStandards'),
    assumes: { 'stating:weight-capacity:desks': 3, 'phrase:stable steel frame:desks': 2, 'also:sturdy': 0, 'top-word': 'sturdy' },
  },
  {
    slug: 'heavy-duty',
    title: 'Heavy-duty',
    seoPhrase: 'What heavy-duty leaves unsaid on furniture listings',
    metaDescription:
      'Heavy-duty names a class of work without naming the work. Which furniture listings here print it, what figure would settle it, and how often it appears.',
    whatItWouldMean: 'That the piece is built for a heavier job than an ordinary one, with the heavier job given a figure.',
    settlingFigure: 'A stated weight capacity for the heavier job',
    whoDefinesIt:
      'No document linked here defines heavy-duty for home furniture. The FTC’s guide for small business says an advertiser needs a reasonable basis for a claim before the ad runs, and describes that basis as objective evidence. What the evidence for this word would be, the listings do not say.',
    whatItDoesNotPromise: 'A duty. The word names a class of work without saying what the work is or how heavy it gets.',
    lede:
      '{W:used:heavy-duty} listings print [[heavy duty]] or [[heavy-duty]], and every one of them is a shoe rack. {O:also:heavy-duty} of them {p:also:heavy-duty|prints|print} a weight capacity.',
    body: [
      'On both listings the word attaches to a material: [[heavy duty iron]] on one, [[heavy-duty steel]] on the other. It tells a reader what the seller thinks of the metal and nothing a reader could measure.',
      'Both do print a count, only not a load. One gives [[12 or more pairs]] and the other [[6 to 9 pairs]]. A pair count is not a weight, and this site does not turn one into the other.',
      'Heavy-duty sits exactly where a capacity figure would go. Across the catalog {w:stating:weight-capacity} listings print a weight capacity, and none of them is a shoe rack. The racks that use the heaviest-sounding word on the site sit in a category where no listing prints the figure the word points at.',
    ],
    sources: sources('ftcAdFaq', 'ftcSubstantiation'),
    assumes: { 'used:heavy-duty': 2, 'used:heavy-duty:shoe-racks': 2, 'stating:weight-capacity:shoe-racks': 0 },
  },
  {
    slug: 'ergonomic-and-lumbar-support',
    title: 'Ergonomic and lumbar support',
    seoPhrase: 'Ergonomic and lumbar support as printed on desk chair listings',
    metaDescription:
      'Ergonomic and lumbar support appear on chair listings with no figure beside them. Who prints them, why no printed figure could settle them, and what that means.',
    whatItWouldMean: 'That the design follows a named, published guideline or test, and says which one.',
    settlingFigure: 'No figure in these listings could',
    whoDefinesIt:
      'No document linked here defines ergonomic as a claim about a chair. BIFMA publishes test standards for general-purpose office chairs ({f:bifma-chairs}) and for desk and table products ({f:bifma-desks}), and none of the chair listings here names either one. In the federal regulations linked below, the word turns up describing the work of a government office, not a seat.',
    whatItDoesNotPromise: 'Anything about the person in the chair. The site repeats the seller’s words and adds nothing to them.',
    lede:
      '{W:used:ergonomic-and-lumbar-support} chair listings print [[ergonomic]], [[lumbar support]] or both, and every one of them is a mesh task chair. This page counts those words. It does not explain them, because nothing in the listings does.',
    body: [
      'The two phrases travel together. [[Ergonomic]] is printed on {w:phrase:ergonomic} listings and [[lumbar support]] on {w:phrase:lumbar support}; the mesh chair that prints the second without the first is a Sweetcrispy mid-back.',
      'Around them sit words that name parts of the chair: [[breathable backrest]], [[headrest]], [[flip-up armrests]], [[adjustable height]]. None of the chair listings attaches a figure to any of them. There is no seat height, no seat width and no range for the lumbar adjustment anywhere in the category.',
      'The only figure any chair listing prints is a weight capacity, [[330 LBS]], on a TRALT chair that also prints [[ergonomic]]. It is a figure about load. The site does not read it as a figure about the word.',
      'Because no printed figure could settle this word, the right pan of the beam above stays at zero by construction rather than by finding. The page leaves that gap open instead of filling it with a meaning of its own.',
    ],
    sources: sources('bifmaStandards', 'cfr1000_23', 'ftcDeception'),
    assumes: {
      'used:ergonomic-and-lumbar-support': 9,
      'sub:chairs:mesh-task': 9,
      'phrase:lumbar support': 9,
      'phrase:ergonomic': 8,
      'stating:weight-capacity:chairs': 1,
      'stating:assembled-dimensions:chairs': 0,
    },
  },
  {
    slug: 'space-saving-and-compact',
    title: 'Space-saving and compact',
    seoPhrase: 'Space-saving and compact on listings that print no size',
    metaDescription:
      'Space-saving is a claim about size, and size is something a listing can print exactly. Which furniture listings use the word and which also print a size.',
    whatItWouldMean: 'That the piece takes less floor or wall than some alternative, by an amount a reader can check.',
    settlingFigure: 'Stated assembled dimensions',
    whoDefinesIt:
      'Nobody, in the documents linked here. The FTC’s substantiation policy holds that objective claims imply a reasonable basis. Space is counted in inches, and inches are something a listing can print exactly, so this is the word on the site whose settling figure is the most ordinary to state.',
    whatItDoesNotPromise: 'A size. Saving space compared with what, and by how much, is left to the photo.',
    lede:
      '{W:used:space-saving-and-compact} listings print [[space-saving]] or [[small spaces]], and none prints the word compact itself. {W:also:space-saving-and-compact} of the {w:used:space-saving-and-compact} also print a measurement.',
    body: [
      'The word lands on very different things: [[a space-saving shelf]] on a shoe rack, [[a space-saving tower]] on a small dresser, [[a workstation for small spaces]] on a desk and [[a space-saving design]] on a rack that expands.',
      'The chair and dresser listings, {w:no-dims-seats-and-drawers} of them, print no size at all. A space word on a dresser therefore has nothing in its own listing to lean on, and the dresser that prints it is no exception.',
      'Where a size is printed, it is often a single figure: a width on a rack, a length on a desk. The site counts a single printed figure as a stated size and says which figure it is. It does not fill in the other two from the photo or from a similar piece.',
    ],
    sources: sources('ftcSubstantiation', 'ftcAdFaq'),
    assumes: {
      'phrase:compact': 0,
      'stating:assembled-dimensions:chairs': 0,
      'stating:assembled-dimensions:dressers': 0,
      'used:space-saving-and-compact:dressers': 1,
    },
  },
  {
    slug: 'stackable-and-expandable',
    title: 'Stackable and expandable',
    seoPhrase: 'Stackable and expandable racks and the widths they leave out',
    metaDescription:
      'Stackable and expandable describe a change in size without the size. Which racks and organizers print them, and how many give the width or height they reach.',
    whatItWouldMean: 'That the piece grows to a stated width or stacks to a stated height, with both ends of the change printed.',
    settlingFigure: 'Stated assembled dimensions, as a range where it expands',
    whoDefinesIt:
      'No document linked here defines either word. The FTC’s guide for small business says advertisers need objective evidence behind their claims. For a rack that expands, the plainest evidence would be its two widths, and {w:width-range} {p:width-range|listing|listings} here {p:width-range|prints|print} them.',
    whatItDoesNotPromise: 'How far it expands or how high it stacks. The word describes a motion, not a distance.',
    lede:
      '{W:used:stackable-and-expandable} listings print [[stackable]] or [[expandable]], and all but one of them are shoe racks. {W:also:stackable-and-expandable} of the {w:used:stackable-and-expandable} print any measurement at all.',
    body: [
      'The racks that print [[expandable]] state their tiers, as every rack here does, but only {w:width-range} of the {w:phrase:expandable} gives the range: [[from 18 to 33 inches]]. The others print [[an adjustable width]] or [[adjustable storage]] and leave the figures out.',
      '[[Stackable]] turns up on fixed racks and on a cube organizer. A stacked height would be the figure that settles it, and no listing prints one. The listings that give a full set of dimensions for a stackable piece give them for a single unit, not for a stack.',
      'The organizer that prints [[stackable]] is the only bookcase listing to use any of the {w:words} words this site tracks, and it also describes itself for [[a dorm or teen room]]. That is the listing’s wording. This site does not extend it into anything else.',
    ],
    sources: sources('ftcAdFaq', 'ftcDeception'),
    assumes: {
      'used:stackable-and-expandable:shoe-racks': 8,
      'used:stackable-and-expandable:bookcases': 1,
      'width-range': 1,
      'phrase:expandable': 4,
    },
  },
  {
    slug: 'anti-tip',
    title: 'Anti-tip',
    seoPhrase: 'Anti-tip on dresser listings and the federal requirement behind it',
    metaDescription:
      'Anti-tip is the only word here with a federal requirement behind it. What the CPSC describes, which listing prints the word, and the part that no listing names.',
    whatItWouldMean: 'That a named part comes with the piece to keep it from tipping, and that the part meets a named standard.',
    settlingFigure: 'A named wall attachment part',
    whoDefinesIt:
      'This is the only word on the site with a published federal requirement behind it. The Consumer Product Safety Commission, which issues federal safety standards and publishes product recalls, describes a standard for clothing storage units, codified at {f:csu-part}, that applies to units manufactured after {f:csu-date}. According to that description, the standard covers free-standing units at least {f:csu-height} tall, with a mass of at least {f:csu-mass} and at least {f:csu-volume} of enclosed storage, and it requires an anti-tip device that meets {f:astm-device} to be packaged with the product, along with warning labels.',
    whatItDoesNotPromise:
      'What the part is, whether one is packed with the piece, or whether the piece falls inside the federal scope. The listing prints a design, not a device.',
    lede:
      '{W:antitip} of the {w:tall-storage} dresser and bookcase listings in this catalog {p:antitip|prints|print} [[anti-tip]]. It prints [[an anti-tip design]] and names no part.',
    body: [
      'The scope in that description is set by height, mass and enclosed storage volume. No dresser listing here prints any of the three, so this site cannot place a single dresser inside or outside that scope, and it does not try.',
      'The same description names bookcases and office furniture among the products that are not within the standard’s scope. Bookcase listings are counted on this page because they are storage furniture that stands on the floor, not because that standard reaches them.',
      'What holds a piece to a wall is a part with a name. {Z:wall} {p:wall|listing|listings} in the catalog {p:wall|names|name} one, the listing that prints anti-tip included. The word is printed by the seller; this site does not read it as a description of any part.',
      'Nothing on this site describes how such a part is fitted. That belongs to the manufacturer’s instructions and, where a wall is involved, to someone who does that work.',
    ],
    sources: sources('cpscClothingStorage', 'cfr1261', 'astmF2057'),
    assumes: { antitip: 1, 'used:anti-tip:dressers': 1, 'stating:assembled-dimensions:dressers': 0, wall: 0 },
  },
]

export const words: Word[] = drafts.map((d) => ({
  ...d,
  forms: WORD_FORMS[d.slug],
  settlingNumberSlug: SETTLING[d.slug],
  usedBy: usedBy(d.slug).map((p) => p.asin),
  alsoStatingNumber: alsoStating(d.slug).map((p) => p.asin),
}))

export function wordBySlug(slug: string): Word | undefined {
  return words.find((w) => w.slug === slug)
}
