import type { CategorySlug, PieceSlug } from './types.ts'

/*
 * Five gear categories. Subgroup sizes are counted from data/facts.ts, never
 * typed. Columns list what a comparison table may show; a column that is
 * empty or identical for every row in a subgroup is dropped when rendered (R2).
 */

export type ColumnKey = 'units' | 'pairs' | 'dims' | 'capacity' | 'presets' | 'top' | 'alsoCalled' | 'antiTip' | 'words' | 'features'

export interface Subgroup {
  id: string
  title: string
  intro: string
}

export interface Category {
  slug: CategorySlug
  title: string
  pieceSlug: PieceSlug
  coreJob: string
  seoPhrase: string
  metaDescription: string
  intro: string
  subgroups: Subgroup[]
  columns: ColumnKey[]
  faq: { q: string; a: string }[]
  assumes: Record<string, number | string>
}

export const categories: Category[] = [
  {
    slug: 'shoe-racks',
    title: 'Standing Shoe Racks',
    pieceSlug: 'the-rack',
    coreJob: 'capacity counted in pairs, or not counted at all',
    seoPhrase: 'Standing shoe racks compared by what their listings print',
    metaDescription:
      'Standing shoe racks compared by what each listing prints: tiers, pairs, widths and the words stackable, expandable, sturdy and heavy-duty, nothing filled in.',
    intro:
      'Every rack here counts tiers in its title, and a few count pairs. The cards repeat what each listing states and mark what it leaves out; nothing is estimated and nothing is ranked by quality.',
    subgroups: [
      {
        id: 'fixed-width',
        title: 'Fixed width',
        intro: 'Racks sold at one width, from low bamboo shelves to tall towers with hooks or a cover.',
      },
      {
        id: 'expandable-width',
        title: 'Expandable width',
        intro:
          'Racks whose width slides. Each prints its tiers, and {w:width-range} of them {p:width-range|prints|print} the range it slides through.',
      },
    ],
    columns: ['units', 'pairs', 'dims', 'words', 'features'],
    faq: [
      {
        q: 'Do these shoe rack listings say how many pairs they hold?',
        a: '{W:pairs} of the {w:cat:shoe-racks} rack listings do, as a range or a floor. The rest count tiers only, and the site does not turn a tier count into pairs.',
      },
      {
        q: 'Does any shoe rack listing print a weight capacity?',
        a: '{Z:stating:weight-capacity:shoe-racks}. Heavy-duty appears on {w:used:heavy-duty:shoe-racks} rack listings without one, and the site does not estimate a load for any rack.',
      },
      {
        q: 'How wide do the expandable racks get?',
        a: '{W:width-range} of the {w:sub:shoe-racks:expandable-width} expandable listings {p:width-range|prints|print} a width range. The others print an adjustable width with no figures.',
      },
    ],
    assumes: { 'stating:weight-capacity:shoe-racks': 0 },
  },
  {
    slug: 'desks',
    title: 'Home Office Desks',
    pieceSlug: 'the-desk',
    coreJob: 'the only category where a load figure is common',
    seoPhrase: 'Home office desks compared by the figures their listings print',
    metaDescription:
      'Home office desks compared by what each listing prints: a length in inches, memory presets, a load figure on some electric frames, no named UL or ETL listing.',
    intro:
      'Every desk listing prints a size, and the electric ones mostly print a load. The cards repeat those figures as stated and add none, and nothing on this page advises on height or use.',
    subgroups: [
      {
        id: 'fixed-height',
        title: 'Fixed height',
        intro:
          'Desks at one height, each measured by a single figure in inches. {Z:substating:weight-capacity:desks:fixed-height} fixed-height listing prints a weight capacity.',
      },
      {
        id: 'electric-standing',
        title: 'Electric standing',
        intro:
          'Electric lifts with memory presets. {W:substating:weight-capacity:desks:electric-standing} of the {w:sub:desks:electric-standing} print a weight capacity. {Z:safety-listing} powered desk listing names a UL or ETL listing; the site notes that as not stated and draws no conclusion from it in either direction.',
      },
    ],
    columns: ['dims', 'capacity', 'presets', 'words', 'features'],
    faq: [
      {
        q: 'Which desk listings print a weight capacity?',
        a: '{W:stating:weight-capacity:desks} electric standing desks, each printing the same figure. No fixed-height desk listing prints one.',
      },
      {
        q: 'Do the electric desks name a UL or ETL listing?',
        a: '{O:safety-listing} of the {w:powered} powered desk listings names one. The site records that as not stated and draws no conclusion from it in either direction.',
      },
      {
        q: 'Does the site say what height to set a standing desk?',
        a: 'No. It counts what the listings print, such as memory presets, and gives no advice on desk height, sitting or standing.',
      },
    ],
    assumes: { 'substating:weight-capacity:desks:fixed-height': 0 },
  },
  {
    slug: 'bookcases',
    title: 'Bookcases',
    pieceSlug: 'the-bookcase',
    coreJob: 'shelves with no stated shelf load',
    seoPhrase: 'Bookcases compared by tiers, cubes and printed dimensions',
    metaDescription:
      'Bookcases compared by what each listing prints: tiers or cubes, dimensions on some and none on others, and the shelf load that no bookcase listing here gives.',
    intro:
      'Every bookcase listing counts its shelves and none says what a shelf holds. The cards repeat what is printed, and the single cube organizer stands on its own.',
    subgroups: [
      {
        id: 'tiered-shelves',
        title: 'Tiered shelves',
        intro:
          'Tiers of open shelves, with a narrow column counted in cubes instead. {Z:shelf-load} listing gives a load for a shelf.',
      },
      {
        id: 'cube-storage',
        title: 'Cube storage',
        intro:
          'A cube organizer on its own. With nothing else in its group, it is shown as a card with no comparison table.',
      },
    ],
    columns: ['units', 'dims', 'words', 'features'],
    faq: [
      {
        q: 'Do any bookcase listings print a shelf load?',
        a: 'No. Every bookcase listing counts its shelves and none gives a load for them, so there is no load figure to compare.',
      },
      {
        q: 'Which bookcase listings print their dimensions?',
        a: '{W:stating:assembled-dimensions:bookcases} of the {w:cat:bookcases} print a full set of dimensions. The narrow DUMOS unit and the cube organizer print none.',
      },
      {
        q: 'Why is the cube organizer shown without a comparison table?',
        a: 'It is the only listing in its group, and a comparison needs at least two rows to show anything.',
      },
    ],
    assumes: { 'shelf-load': 0, 'silent:assembled-dimensions:bookcases': 2, 'axes:3:bookcases': 4 },
  },
  {
    slug: 'chairs',
    title: 'Home Office Desk Chairs',
    pieceSlug: 'the-chair',
    coreJob: 'a word about bodies, and a single figure in the whole category',
    seoPhrase: 'Home office desk chairs compared by what their listings state',
    metaDescription:
      'Desk chairs compared by what each listing states: parts and motions, one weight capacity, no size of any kind, and ergonomic and lumbar support as quoted.',
    intro:
      'Chair listings name parts and motions and print almost no figures. The cards quote the seller’s words, add no meaning to them, and leave out a size column that would be empty on every row.',
    subgroups: [
      {
        id: 'mesh-task',
        title: 'Mesh task chairs',
        intro:
          'Mesh chairs on swivel bases, and {w:subused:ergonomic-and-lumbar-support:chairs:mesh-task} of the {w:sub:chairs:mesh-task} print ergonomic or lumbar support. No size column appears because no chair prints a size.',
      },
      {
        id: 'criss-cross',
        title: 'Criss-cross vanity chairs',
        intro:
          'Wide armless seats sold under the name criss cross. {O:subused:ergonomic-and-lumbar-support:chairs:criss-cross} of them {p:subused:ergonomic-and-lumbar-support:chairs:criss-cross|prints|print} ergonomic, and none prints a load or a size.',
      },
    ],
    columns: ['capacity', 'dims', 'words', 'features'],
    faq: [
      {
        q: 'Does any chair listing print its size?',
        a: 'No. None of the {w:cat:chairs} chair listings prints a seat height, a seat width or an overall size, so the comparison tables leave that column out.',
      },
      {
        q: 'What does ergonomic mean on these listings?',
        a: 'The listings do not say. {W:used:ergonomic-and-lumbar-support:chairs} of them print ergonomic or lumbar support, none attaches a figure or names a standard, and the site adds no meaning of its own.',
      },
      {
        q: 'Does any chair listing print a weight capacity?',
        a: '{W:stating:weight-capacity:chairs}, a TRALT chair. The site repeats that figure as printed and does not confirm it.',
      },
    ],
    assumes: { 'stating:weight-capacity:chairs': 1, 'stating:assembled-dimensions:chairs': 0, 'substating:weight-capacity:chairs:criss-cross': 0 },
  },
  {
    slug: 'dressers',
    title: 'Dressers & Chests of Drawers',
    pieceSlug: 'the-dresser',
    coreJob: '{w:cat:dressers} towers, {w:antitip} anti-tip {p:antitip|claim|claims}',
    seoPhrase: 'Fabric-drawer dressers compared by what their listings print',
    metaDescription:
      'Fabric-drawer dressers compared by what each listing prints: drawer counts, wooden tops, other names like nightstand or TV stand, and the one anti-tip claim.',
    intro:
      'Tall furniture can tip over. This page does not assess any dresser for that, gives no instructions for fitting anything, and repeats only what each listing prints.',
    subgroups: [
      {
        id: 'up-to-four',
        title: 'Four drawers or fewer',
        intro:
          'Small towers. {W:subdual:dressers:up-to-four} of the {w:sub:dressers:up-to-four} also call themselves a nightstand, and each of those cards says so.',
      },
      {
        id: 'five-to-seven',
        title: 'Five to seven drawers',
        intro:
          'Mid-sized towers. Some print a wooden top or a wood tabletop, and the {w:subdual:dressers:five-to-seven} that also call themselves a TV stand carry a note.',
      },
      {
        id: 'eight-or-more',
        title: 'Eight or more drawers',
        intro:
          'The highest drawer counts in the catalog, and the {p:antitip|listing|listings} that {p:antitip|prints|print} anti-tip. None of these listings prints a height.',
      },
    ],
    columns: ['units', 'top', 'alsoCalled', 'dims', 'antiTip', 'words', 'features'],
    faq: [
      {
        q: 'Which dresser listings print anti-tip?',
        a: '{W:antitip}, the organizer with anti-tip in its title. It names no part, and the site does not describe how any part is fitted.',
      },
      {
        q: 'Why do some dressers carry a nightstand or TV stand note?',
        a: '{W:dual} dresser listings also call themselves a nightstand or a TV stand. The note repeats the listing and leaves the call to the reader.',
      },
      {
        q: 'Do any dresser listings print a size?',
        a: 'No. None of the {w:cat:dressers} dresser listings prints a height, a width or a depth, including those titled tall or wide.',
      },
    ],
    assumes: {
      antitip: 1,
      'stating:assembled-dimensions:dressers': 0,
      'substating:assembled-dimensions:dressers:eight-or-more': 0,
    },
  },
]

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug)
