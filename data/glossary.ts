/*
 * Twenty-four terms. Definitions carry tokens, never typed counts. `links`
 * are registry paths, so the link text comes from the target page title.
 */

export interface Term {
  slug: string
  term: string
  definition: string
  links: string[]
  assumes: Record<string, number>
}

export const glossary: Term[] = [
  {
    slug: 'flat-pack',
    term: 'Flat pack',
    definition:
      'Furniture shipped in pieces in a box and put together after delivery. None of the listings here uses the phrase, though several print [[easy assembly]] or [[tool-free assembly]].',
    links: ['/pieces/the-desk'],
    assumes: { 'phrase:flat pack': 0 },
  },
  {
    slug: 'tool-free-assembly',
    term: 'Tool-free assembly',
    definition:
      'The seller’s phrase for assembly that needs no tools. It appears on {w:phrase:tool-free assembly} {p:phrase:tool-free assembly|listing|listings}, and the site treats it as a claim about effort and describes no assembly.',
    links: ['/pieces/the-rack'],
    assumes: {},
  },
  {
    slug: 'particle-board',
    term: 'Particle board',
    definition:
      'A panel of cellulosic particles pressed together with resin, which is how federal composite wood rules define particleboard. No listing in this catalog uses the term.',
    links: ['/numbers/what-the-top-is-made-of'],
    assumes: { 'phrase:particleboard': 0, 'phrase:particle board': 0 },
  },
  {
    slug: 'mdf',
    term: 'MDF',
    definition:
      'Medium-density fiberboard. Federal composite wood rules define it as a panel of cellulosic fibers dry-formed and pressed from a resinated mat. No listing in this catalog uses the term or the abbreviation.',
    links: [],
    assumes: { 'phrase:MDF': 0, 'phrase:fiberboard': 0 },
  },
  {
    slug: 'wood-grain-finish',
    term: 'Wood grain finish',
    definition:
      'A surface made to look like wood. [[Wood Grain]] appears in {w:title:wood grain} dresser {p:title:wood grain|title|titles}, and the site does not read a look as a material.',
    links: ['/numbers/what-the-top-is-made-of'],
    assumes: {},
  },
  {
    slug: 'fabric-drawer',
    term: 'Fabric drawer',
    definition:
      'A drawer or bin of fabric that slides into a frame. Every dresser listing here describes fabric drawers or bins, and each counts them in the title.',
    links: ['/pieces/the-dresser'],
    assumes: {},
  },
  {
    slug: 'non-woven-fabric',
    term: 'Non-woven fabric',
    definition:
      'Fabric made by bonding fibers rather than weaving them. It appears in this catalog as [[non-woven shelves]] on a Kitsure shoe rack.',
    links: ['/gear/shoe-racks'],
    assumes: { 'phrase:non-woven': 1 },
  },
  {
    slug: 'steel-frame',
    term: 'Steel frame',
    definition:
      'The seller’s name for the material of a frame. [[Steel frame]] appears on {w:phrase:steel frame} listings, often after [[sturdy]] or [[stable]]; the site repeats the phrase and says nothing about the frame.',
    links: ['/words/sturdy'],
    assumes: {},
  },
  {
    slug: 'tier',
    term: 'Tier',
    definition:
      'One level of a rack or shelf unit, as counted in the title. Every shoe rack title here gives a tier count, and on a shoe rack the site does not treat that count as a capacity.',
    links: ['/numbers/capacity-in-pairs-drawers-and-tiers'],
    assumes: {},
  },
  {
    slug: 'cube',
    term: 'Cube',
    definition:
      'An open square compartment in a storage unit, counted the way a tier is. {W:phrase:cubes} bookcase {p:phrase:cubes|listing counts|listings count} cubes rather than tiers.',
    links: ['/gear/bookcases'],
    assumes: {},
  },
  {
    slug: 'expandable-rail',
    term: 'Expandable rail',
    definition:
      'A frame section that slides to change a rack’s width. The listings here never say rail; they print [[expandable]], [[an adjustable width]] or a range in inches.',
    links: ['/words/stackable-and-expandable'],
    assumes: { 'phrase:rail': 0 },
  },
  {
    slug: 'stackable-unit',
    term: 'Stackable unit',
    definition:
      'A piece described as able to sit on another of its kind. {W:phrase:stackable} listings print [[stackable]], and none prints the height of a stack.',
    links: [],
    assumes: {},
  },
  {
    slug: 'weight-capacity',
    term: 'Weight capacity',
    definition:
      'A load figure printed by the seller for a piece or a part of it. {W:stating:weight-capacity} of the {w:products} listings in this catalog print one.',
    links: ['/numbers/weight-capacity'],
    assumes: {},
  },
  {
    slug: 'shelf-load',
    term: 'Shelf load',
    definition:
      'A load figure for a single shelf, tier, drawer or top. {Z:shelf-load} {p:shelf-load|listing|listings} in this catalog {p:shelf-load|prints|print} one.',
    links: ['/pieces/the-bookcase'],
    assumes: {},
  },
  {
    slug: 'anti-tip-hardware',
    term: 'Anti-tip hardware',
    definition:
      'A part packed with a piece to keep it from tipping, often by connecting it to a wall. {W:antitip} {p:antitip|listing|listings} here {p:antitip|prints|print} anti-tip and {o:wall} {p:wall|names|name} such a part. This site gives no instructions for fitting one.',
    links: ['/words/anti-tip', '/numbers/what-holds-it-to-the-wall'],
    assumes: {},
  },
  {
    slug: 'tip-over',
    term: 'Tip-over',
    definition:
      'A piece of furniture tipping over. The federal standard for clothing storage units concerns it; this site counts the words listings print about it and assesses no piece.',
    links: ['/words/anti-tip'],
    assumes: {},
  },
  {
    slug: 'swivel',
    term: 'Swivel',
    definition:
      'A seat that turns on its base. Chair listings print [[swivel]] or [[a 360 degree swivel]], on mesh chairs and criss-cross seats alike.',
    links: ['/gear/chairs'],
    assumes: {},
  },
  {
    slug: 'caster',
    term: 'Caster',
    definition:
      'A wheel on a chair base. The listings say [[wheels]] rather than casters, and a criss-cross chair is stated with [[no wheels]].',
    links: ['/pieces/the-chair'],
    assumes: { 'phrase:caster': 0, 'phrase:casters': 0, 'phrase:no wheels': 1 },
  },
  {
    slug: 'gas-lift',
    term: 'Gas lift',
    definition:
      'The adjustable column under many desk chair seats. No listing here uses the term; the chair listings print [[adjustable height]] instead.',
    links: [],
    assumes: { 'phrase:gas lift': 0 },
  },
  {
    slug: 'lumbar-support',
    term: 'Lumbar support',
    definition:
      'A seller phrase for a feature of a chair backrest. {W:phrase:lumbar support} chair listings print it, and none attaches a figure or a standard to it.',
    links: ['/words/ergonomic-and-lumbar-support'],
    assumes: {},
  },
  {
    slug: 'mesh-back',
    term: 'Mesh back',
    definition:
      'A chair back of open fabric stretched over a frame. {W:phrase:mesh} chair {p:phrase:mesh|listing prints|listings print} mesh in the title or the description.',
    links: [],
    assumes: {},
  },
  {
    slug: 'sit-stand-desk',
    term: 'Sit-stand desk',
    definition:
      'A desk whose height changes by motor or by hand. The listings here print [[electric height adjustment]], and the site says nothing about working at any height.',
    links: ['/gear/desks'],
    assumes: {},
  },
  {
    slug: 'memory-preset',
    term: 'Memory preset',
    definition:
      'A saved height on an electric desk. Each electric desk listing here prints a preset count, and the site does not say what any preset should be.',
    links: ['/pieces/the-desk'],
    assumes: {},
  },
  {
    slug: 'zapatera',
    term: 'Zapatera',
    definition:
      'Spanish for a shoe rack or shoe cabinet, plural zapateras. The listing text supplied for this catalog is in English and does not use it.',
    links: ['/pieces/the-rack'],
    assumes: { 'phrase:zapatera': 0, 'phrase:zapateras': 0 },
  },
]
