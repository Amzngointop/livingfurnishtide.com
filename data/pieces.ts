import { leanTied, leanWord } from '../lib/catalog.ts'
import { sources } from './sources.ts'
import type { CategorySlug, PieceSlug, Source, WordSlug } from './types.ts'

/*
 * Five pieces, one per category. The word a piece leans on is computed: the
 * most printed of the six words in its category, ties going to the word that
 * comes first in the ledger. Insets quote listing text verbatim.
 */

export interface Piece {
  slug: PieceSlug
  title: string
  category: CategorySlug
  seoPhrase: string
  metaDescription: string
  whatItIs: string
  sections: { heading: string; paragraphs: string[] }[]
  insets: { asin: string; phrase: string }[]
  sources: Source[]
  assumes: Record<string, number | string>
  leanWord: WordSlug
  leanTied: WordSlug[]
}

type Draft = Omit<Piece, 'leanWord' | 'leanTied'>

const drafts: Draft[] = [
  {
    slug: 'the-rack',
    title: 'The shoe rack',
    category: 'shoe-racks',
    seoPhrase: 'The standing shoe rack as its listings describe it',
    metaDescription:
      'What a standing shoe rack is by its own listings: tiers counted in every title, pairs counted in few, widths that slide, and the word the category leans on.',
    whatItIs:
      'By its listings, a shoe rack here is a set of metal, bamboo or fabric tiers counted in the title, sold at a fixed width or at a width that slides.',
    sections: [
      {
        heading: 'Tiers in every title, pairs in few',
        paragraphs: [
          'Every rack title gives a tier count, from a low boot rack to a tall tower. Only {w:pairs} of the {w:cat:shoe-racks} listings say how many pairs the tiers take, and those give ranges or a floor rather than a single figure.',
          'The racks with the most tiers print [[ten tiers]], and none of them prints a height. Two print a width, and the third prints [[a wide build]] instead.',
        ],
      },
      {
        heading: 'Stacking and sliding',
        paragraphs: [
          'Stackable and expandable are the rack’s own words. They describe what the rack does when more shoes arrive, and most of the listings that print them stop before saying how far that goes.',
          'The racks that expand print [[an adjustable width]], [[adjustable storage]] or a range, and a range appears once. A fixed rack that prints stackable gives its size, when it gives one, for a single unit.',
        ],
      },
      {
        heading: 'Materials as the listings name them',
        paragraphs: [
          'The materials arrive as words: [[non-woven shelves]], [[bamboo construction]], [[a sturdy wire grid]], [[heavy duty iron]], [[heavy-duty steel]]. The site repeats them and says nothing about what they are like.',
          '[[Tool-free assembly]] and [[easy assembly]] each appear on a single rack. They are the seller’s words about effort; nothing here describes putting a rack together.',
        ],
      },
    ],
    insets: [
      { asin: 'B08MJMN4Q9', phrase: 'use upright or upside down' },
      { asin: 'B0DFYFKV4C', phrase: 'an adjustable height for boots' },
      { asin: 'B0DYNZ4MFB', phrase: 'a cover, a side pocket and a vertical shelf' },
    ],
    sources: sources('ftcAdFaq', 'ftcSubstantiation'),
    assumes: { 'phrase:ten tiers': 3, 'width-range': 1, 'phrase:tool-free assembly': 1, 'phrase:easy assembly:shoe-racks': 1 },
  },
  {
    slug: 'the-desk',
    title: 'The desk',
    category: 'desks',
    seoPhrase: 'The home office desk as its listings describe it',
    metaDescription:
      'What a home office desk is by its own listings: a length in inches, a load figure on the electric frames, no named safety listing, and a word it barely uses.',
    whatItIs:
      'By its listings, a desk here is a work surface measured in inches, either at one fixed height or on an electric frame with memory presets.',
    sections: [
      {
        heading: 'Where the load figure lives',
        paragraphs: [
          'Desks are the only category where a load figure is common. {W:stating:weight-capacity:desks} of the {w:sub:desks:electric-standing} electric desks print [[176 lbs]], and no fixed-height desk prints a load.',
          'The desks with a capacity print [[a stable steel frame]] or no frame word at all. The desk that prints [[sturdy]] gives a length and no load, and so does the desk that prints [[small spaces]].',
        ],
      },
      {
        heading: 'Power, and the listing it does not name',
        paragraphs: [
          '{W:powered} desk listings describe something that runs on mains power: {w:electric} electric lifts, and an L-shaped desk with [[an LED light]] and [[a power outlet]]. {Z:safety-listing} of them {p:safety-listing|names|name} a UL or ETL listing. The site records that as not stated and draws no conclusion from it in either direction.',
          'OSHA’s Nationally Recognized Testing Laboratory program recognizes private organizations to certify products against its electrical standards. None of these listings names such an organization.',
        ],
      },
      {
        heading: 'Presets and effort',
        paragraphs: [
          'Memory presets are counted as printed, [[four memory presets]] or [[three memory presets]]. The site says nothing about what a preset is set to.',
          '[[Easy assembly]] appears on {w:phrase:easy assembly:desks} desk listings. It is the seller’s word about effort, and nothing on this site describes the assembly itself.',
        ],
      },
    ],
    insets: [
      { asin: 'B0HFFW7DWC', phrase: 'a reinforcement structure' },
      { asin: 'B0CS3K9CWC', phrase: 'large legroom' },
      { asin: 'B0DJ2XKJJT', phrase: 'a one-piece seamless desktop' },
    ],
    sources: sources('bifmaStandards', 'oshaNrtl'),
    assumes: {
      'stating:weight-capacity:desks': 3,
      'used:sturdy:desks': 1,
      'used:space-saving-and-compact:desks': 1,
      'stating:weight-capacity:chairs': 1,
    },
  },
  {
    slug: 'the-bookcase',
    title: 'The bookcase',
    category: 'bookcases',
    seoPhrase: 'The bookcase as its listings describe it, shelf by shelf',
    metaDescription:
      'What a bookcase is by its own listings: open shelves counted in tiers or cubes, a size on some and none on others, and no shelf load printed on any of them.',
    whatItIs:
      'By its listings, a bookcase here is a stack of open shelves counted in tiers or cubes, narrow or wide, with no load given for any shelf.',
    sections: [
      {
        heading: 'Shelves without a shelf load',
        paragraphs: [
          'Every bookcase listing counts its shelves, and none says what a shelf holds. That is the category’s plainest silence, and it is the same on the tallest listing as on the smallest.',
          'The largest figure printed on any bookcase is [[71 inches]], on the taller Furinno LUDER. {W:stating:assembled-dimensions:bookcases} bookcase listings print all three dimensions, and the rest print none.',
        ],
      },
      {
        heading: 'The words it does not use',
        paragraphs: [
          'None of the bookcases prints sturdy, heavy-duty or space-saving. Of the {w:words} words this site tracks, the only one any of them uses is [[stackable]], on the cube organizer, so that is the word this piece leans on, by a single listing.',
          'The narrow DUMOS unit prints [[a tall narrow standing build]]. Tall and narrow are the closest a bookcase listing comes to a size word, and neither comes with a figure on that listing.',
        ],
      },
      {
        heading: 'Outside one standard’s scope',
        paragraphs: [
          'The federal specification for clothing storage units, {f:astm-csu}, says it does not cover shelving units such as bookcases. This site says nothing more about bookcases and that standard than that sentence.',
        ],
      },
    ],
    insets: [
      { asin: 'B0H1G1G996', phrase: 'open display storage' },
      { asin: 'B0CNTD7YGW', phrase: 'a fit for cubby bins' },
      { asin: 'B074NHRZQX', phrase: 'three cubes' },
    ],
    sources: sources('astmF2057', 'ftcAdFaq'),
    assumes: {
      'stating:weight-capacity:bookcases': 0,
      'used:stackable-and-expandable:bookcases': 1,
      'used:sturdy:bookcases': 0,
      'used:heavy-duty:bookcases': 0,
      'used:space-saving-and-compact:bookcases': 0,
      'silent:assembled-dimensions:bookcases': 2,
    },
  },
  {
    slug: 'the-chair',
    title: 'The chair',
    category: 'chairs',
    seoPhrase: 'The home office desk chair as its listings describe it',
    metaDescription:
      'What a desk chair is by its own listings: mesh backs and criss-cross seats, parts named without figures, one weight capacity, and not a single size anywhere.',
    whatItIs:
      'By its listings, a chair here is either a mesh task chair on a swivel base or a wide criss-cross seat, and none of them gives a size.',
    sections: [
      {
        heading: 'A word with nothing to count',
        paragraphs: [
          '{W:used:ergonomic-and-lumbar-support:chairs} of the {w:cat:chairs} chair listings print [[ergonomic]] or [[lumbar support]]. None prints a figure the site could set against either phrase, and the site does not supply one.',
          'BIFMA publishes a test standard for general-purpose office chairs, {f:bifma-chairs}. No chair listing here names it or any other standard.',
        ],
      },
      {
        heading: 'What the chairs do state',
        paragraphs: [
          'The only figure in the category is a weight capacity, [[330 LBS]], on a TRALT chair. The rest of what the chairs state are parts and motions: [[flip-up armrests]], [[a rocking mode]], [[a 360 degree swivel]], [[silent wheels]].',
          'No chair listing prints a seat height, a seat width or an overall size. The comparison tables on the gear page leave that column out instead of filling it with blanks.',
        ],
      },
      {
        heading: 'The criss-cross seats',
        paragraphs: [
          'The criss-cross chairs print [[a cross-legged shape]] or [[a cross-legged seat]], a wide seat and [[adjustable height]], and none of them prints ergonomic. One is stated with [[no wheels]].',
        ],
      },
    ],
    insets: [
      { asin: 'B0CG6V2XGS', phrase: 'gaming chair' },
      { asin: 'B0FQDM23S4', phrase: 'a sponge seat' },
      { asin: 'B0CP22DQQS', phrase: '3D armrests' },
    ],
    sources: sources('bifmaStandards', 'ftcDeception'),
    assumes: {
      'stating:weight-capacity:chairs': 1,
      'stating:assembled-dimensions:chairs': 0,
      'phrase:ergonomic:chairs': 8,
      'phrase:no wheels': 1,
    },
  },
  {
    slug: 'the-dresser',
    title: 'The dresser',
    category: 'dressers',
    seoPhrase: 'The fabric-drawer dresser as its listings describe it',
    metaDescription:
      'What a dresser is by its own listings: fabric drawers counted in every title, wooden tops on some, no size on any, other names on a few, and one anti-tip claim.',
    whatItIs:
      'By its listings, a dresser here is a tower of fabric drawers or bins counted in the title, often with a wooden top and never with a printed size.',
    sections: [
      {
        heading: 'The word it leans on',
        paragraphs: [
          '[[Sturdy]] appears on {w:used:sturdy:dressers} dresser listings, attached to a frame each time: [[a sturdy steel frame]], [[a sturdy metal frame]], [[a sturdy frame]]. No dresser listing prints a load for a drawer or for the top.',
          'None of the dressers prints heavy-duty. The frame words that do appear name a metal or steel, and the site takes them as the seller’s words and nothing more.',
        ],
      },
      {
        heading: 'A word about tipping',
        paragraphs: [
          '{W:antitip} dresser {p:antitip|listing|listings} {p:antitip|prints|print} [[anti-tip]], and none names a part. The word’s own page sets out what the federal standard for clothing storage units requires and what that listing leaves out.',
          'No dresser listing prints a height, a width or a depth, including the ones whose titles say [[tall]] or [[wide]].',
        ],
      },
      {
        heading: 'Dresser, nightstand or TV stand',
        paragraphs: [
          '{W:dual} dresser listings also call themselves something else, {w:dual-title} of them in the title: a [[nightstand]], a [[tall nightstand]] or a [[TV stand]]. Each of those cards carries a note, and the site does not decide what the piece is.',
          '{W:stating:what-the-top-is-made-of:dressers} dresser listings name a top, as [[a wooden top]] or [[a wood tabletop]].',
        ],
      },
    ],
    insets: [
      { asin: 'B0GY3P6NVK', phrase: 'seven easy-pull bins' },
      { asin: 'B0B8NYH6CC', phrase: 'a fit for televisions up to 45 inches' },
      { asin: 'B0FL6X1JZS', phrase: 'nine fabric drawers' },
    ],
    sources: sources('cfr1261', 'astmF2057'),
    assumes: {
      'used:heavy-duty:dressers': 0,
      'used:anti-tip:dressers': 1,
      'stating:assembled-dimensions:dressers': 0,
      'stating:weight-capacity:dressers': 0,
    },
  },
]

export const pieces: Piece[] = drafts.map((d) => ({ ...d, leanWord: leanWord(d.category), leanTied: leanTied(d.category) }))

export const pieceBySlug = (slug: string) => pieces.find((p) => p.slug === slug)
