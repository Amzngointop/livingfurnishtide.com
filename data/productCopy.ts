import type { ProductCopy } from './types.ts'

/*
 * Card copy, written only from each listing's supplied facts. Pros are what
 * the listing states; cons are what it leaves out. An absence is recorded as
 * an absence and never as a weakness. No typed figures: {dims} {units}
 * {capacity} {top} {presets} {also} come from the record, and anything
 * quoted verbatim sits in [[...]].
 */

export const copy: Record<string, ProductCopy> = {
  /* ---------------- shoe racks ---------------- */
  B0CNGTZ3B5: {
    summary: 'A fixed-width Kitsure rack whose listing gives {units} at {dims}, with non-woven shelves. It prints stackable and gives no pair count.',
    pros: ['Tier count printed: {units}', 'A width printed: {dims}', 'Shelf material named as non-woven', 'Stackable design stated'],
    cons: ['No pair count, so the tiers do not say how many shoes they take', 'No depth or height beside the width', 'No load figure for the non-woven shelves'],
    bestFor: 'A reader who wants a width figure and a named shelf material on a low rack.',
  },
  B08MJMN4Q9: {
    summary: 'A metal SONGMICS rack whose listing prints all three dimensions, {dims}, and a pair range alongside its tiers. It also states the rack can stand upright or upside down.',
    pros: ['Tiers and a pair range printed: {units}', 'All three dimensions printed: {dims}', 'Stackable design stated', 'Use upright or upside down stated'],
    cons: ['No weight capacity for any tier', 'Does not say what turning it upside down changes', 'Nothing printed about the metal beyond the word'],
    bestFor: 'A reader who wants the pair count and the full size on the same listing.',
    badge: {
      label: 'Only rack stating pairs and all three dimensions',
      basis: 'The listing states {units} and {dims}; no other rack here prints both a pair count and a full size.',
      rule: { kind: 'flag', value: 'pairs-and-three-dimensions' },
    },
  },
  B0C3R76MWB: {
    summary: 'A bamboo rack from ROMGUAR CRAFT whose listing gives {dims} and {units}. It prints stackable and names bamboo as the construction.',
    pros: ['Full size printed: {dims}', 'Construction named as bamboo', 'Tier count printed: {units}', 'Stackable design stated'],
    cons: ['No pair count for the tiers', 'No load figure for a bamboo shelf', 'No stacked height for the stackable claim'],
    bestFor: 'A reader who wants a printed size on a rack that is not metal.',
  },
  B0DK97R7DB: {
    summary: 'A Kitsure rack at {dims} with {units}. Its listing calls the shelf space-saving and the build sturdy, and gives no figure for either word.',
    pros: ['Width printed: {dims}', 'Tier count printed: {units}', 'Prints space-saving, with a width beside it', 'Prints sturdy'],
    cons: ['No weight capacity to go with sturdy', 'No depth or height to go with space-saving', 'No pair count printed for this rack'],
    bestFor: 'A reader tracking sturdy and space-saving on the same small listing.',
  },
  B0BBZYKGYV: {
    summary: 'A long KEETDY rack with a wire grid and {units}. The listing calls the grid sturdy and the build wide and stackable, and prints no size.',
    pros: ['Tier count printed: {units}', 'Wire grid shelves named', 'Prints stackable', 'Prints sturdy for the grid'],
    cons: ['No width, although the title says long', 'No pair count on the wire grid', 'No load for the grid shelves'],
    bestFor: 'A reader comparing racks that describe their length in words rather than inches.',
  },
  B0F2SDRZBV: {
    summary: 'A tall Kitsure tower with {units} at {dims}, sold with hooks. The listing calls it large-capacity and counts no pairs.',
    pros: ['Tier count printed: {units}', 'Width printed: {dims}', 'Hooks included, per the listing', 'Large-capacity build stated'],
    cons: ['No pair count behind large-capacity', 'No height for a tower with this many tiers', 'No weight capacity for the tower'],
    bestFor: 'A reader who wants a tier count and a width on a tall rack with hooks.',
  },
  B0DYNZ4MFB: {
    summary: 'A covered Kitsure tower with {units} at {dims}. The listing adds a side pocket and a vertical shelf.',
    pros: ['Tier count printed: {units}', 'Width printed: {dims}', 'Cover and side pocket stated', 'Vertical shelf stated'],
    cons: ['No height or depth for the covered tower', 'No pair count under the cover', 'Nothing on what the cover is made of'],
    bestFor: 'A reader who wants a covered rack with a printed width.',
    badge: {
      label: 'Only rack sold with a cover',
      basis: 'The listing states a cover, a side pocket and a vertical shelf; no other rack here mentions a cover.',
      rule: { kind: 'flag', value: 'cover' },
    },
  },
  B0CKXLKBVQ: {
    summary: 'A tall VTRIN rack with {units}, sold with hooks. Its listing calls the metal shelf sturdy and the build wide, without printing a width.',
    pros: ['Tier count printed: {units}', 'Hooks included, per the title', 'Metal shelves named', 'Prints sturdy for the shelf'],
    cons: ['No width, although the listing says wide', 'No height, although the title says tall', 'No pair count and no load figure'],
    bestFor: 'A reader comparing tall racks that print a tier count and no size.',
  },
  B0DFYFKV4C: {
    summary: 'An expandable metal rack with {units} and no brand in its title. The listing states an adjustable height for boots, dense mesh shelves and a stackable design.',
    pros: ['Tier count printed: {units}', 'Adjustable height for boots stated', 'Dense mesh shelves named', 'Prints stackable and expandable'],
    cons: ['No width range for a rack sold as expandable', 'No figure for the boot height', 'No brand named in the title'],
    bestFor: 'A reader who wants a low expandable rack that mentions boot height.',
    badge: {
      label: 'Fewest tiers stated',
      basis: '{units}; every other rack in this catalog states more.',
      rule: { kind: 'min', metric: 'tiers', value: 2 },
    },
  },
  B0CRGSVFY7: {
    summary: 'A Bumusty rack with {units} that states the range its width slides through, {dims}. The listing also calls the metal build sturdy.',
    pros: ['Width range printed: {dims}', 'Tier count printed: {units}', 'Metal build named', 'Prints expandable and sturdy'],
    cons: ['No depth or height at either width', 'No pair count at either end of the range', 'No load figure behind sturdy on this rack'],
    bestFor: 'A reader who wants the start and end of an expandable width in inches.',
    badge: {
      label: 'Only stated width range',
      basis: '{dims}, the one width range printed by any rack in this catalog.',
      rule: { kind: 'flag', value: 'width-range' },
    },
  },
  B0FFN9NTBR: {
    summary: 'An expandable HDDTTZ rack described as heavy duty iron, with {units}. The listing adds a non-slip build and easy assembly.',
    pros: ['Tiers and pairs printed: {units}', 'Iron named as the material', 'Non-slip build stated', 'Easy assembly stated'],
    cons: ['No weight capacity behind heavy duty', 'No width or width range', 'The pair count has no upper figure'],
    bestFor: 'A reader who wants a pair count on an expandable rack.',
    badge: {
      label: 'Only open-ended pair count',
      basis: '{units}: a floor with no upper figure, the only pair count of that kind here.',
      rule: { kind: 'flag', value: 'open-ended-pairs' },
    },
  },
  B0FHCYYYHJ: {
    summary: 'An expandable Detsuk rack with {units}. Its listing prints heavy-duty steel, a space-saving design and tool-free assembly.',
    pros: ['Tiers and a pair range printed: {units}', 'Steel named as the material', 'Adjustable width stated', 'Tool-free assembly stated'],
    cons: ['No width figure for the adjustable width', 'No load figure behind heavy-duty', 'No size behind space-saving'],
    bestFor: 'A reader who wants a pair range and several seller words on a single rack to compare.',
    badge: {
      label: 'Prints the most tracked words',
      basis: 'The listing prints heavy-duty, space-saving and expandable; no other rack prints as many of the words this site tracks.',
      rule: { kind: 'max', metric: 'wordCount', value: 3 },
    },
  },

  /* ---------------- desks ---------------- */
  B0HFFW7DWC: {
    summary: 'A DUMOS computer desk printed at {dims}, with a reinforcement structure and a simple workstation build.',
    pros: ['Single size figure printed: {dims}', 'Reinforcement structure stated', 'Simple workstation build stated', 'Modern black finish in the title'],
    cons: ['No depth or height beside the length', 'No weight capacity to go with the reinforcement', 'Does not say what the reinforcement is'],
    bestFor: 'A reader who wants the largest desk figure printed in this catalog.',
    badge: {
      label: 'Largest stated desk figure',
      basis: '{dims}, the largest single figure any desk listing here prints.',
      rule: { kind: 'max', metric: 'largestInch', value: 63 },
    },
  },
  B0CS3K9CWC: {
    summary: 'A Huuger desk printed at {dims} in rustic brown, with large legroom and a sturdy metal frame.',
    pros: ['Single size figure printed: {dims}', 'Metal frame named', 'Large legroom stated', 'Prints sturdy'],
    cons: ['No weight capacity behind sturdy', 'No figure for the legroom', 'Rustic brown is a color name, not a material'],
    bestFor: 'A reader weighing the word sturdy against a printed length.',
  },
  B08YWYVTS4: {
    summary: 'An SHW Mission desk printed at {dims}. The listing states a home office desk build and little else.',
    pros: ['Single size figure printed: {dims}', 'Home office desk build stated', 'Mission style named in the title', 'Black finish in the title'],
    cons: ['No depth or height for the Mission desk', 'No weight capacity printed', 'No storage, frame or top material named'],
    bestFor: 'A reader who wants a plain listing with a single printed figure.',
  },
  B0CXPKSPZ4: {
    summary: 'An L-shaped AODK desk printed at {dims}, with an LED light, a power outlet, a shelf, a storage bag and a hook. The layout is stated as reversible.',
    pros: ['Single size figure printed: {dims}', 'LED light and power outlet stated', 'Reversible L layout stated', 'Shelf, storage bag and hook included'],
    cons: ['No UL or ETL listing named for the outlet or the light', 'No size for the short side of the L', 'No weight capacity for either side'],
    bestFor: 'A reader comparing what an L-shaped desk listing includes.',
    badge: {
      label: 'Only desk stating a power outlet',
      basis: 'The listing states a power outlet and an LED light, and names no UL or ETL listing.',
      rule: { kind: 'flag', value: 'power-outlet' },
    },
  },
  B0D5BMFK9S: {
    summary: 'A Lufeiya desk printed at {dims}, with file drawers and a reversible layout.',
    pros: ['Single size figure printed: {dims}', 'Filing cabinet stated', 'Reversible layout stated', 'File drawers named in the title'],
    cons: ['No drawer count for the filing cabinet', 'No weight capacity for the desk or the drawers', 'No depth or height printed'],
    bestFor: 'A reader who wants filing storage on a desk with a printed length.',
  },
  B0H4CFBGJN: {
    summary: 'A small OLIXIS desk printed at {dims}, sold as a workstation for small spaces with a storage bag.',
    pros: ['Single size figure printed: {dims}', 'Workstation for small spaces stated', 'Storage bag included', 'Brown finish in the title'],
    cons: ['No depth or height behind small spaces', 'No weight capacity for the small desk', 'No frame or top material named'],
    bestFor: 'A reader who wants a space word with a printed figure beside it.',
    badge: {
      label: 'Smallest stated desk figure',
      basis: '{dims}; every other desk prints a larger figure as its biggest measurement.',
      rule: { kind: 'min', metric: 'largestInch', value: 31 },
    },
  },
  B0B41YH9B6: {
    summary: 'An ErGear electric standing desk printed at {dims}, with {presets} memory presets and a stable steel frame. The listing states {capacity}.',
    pros: ['Weight capacity printed: {capacity}', 'Desktop size printed: {dims}', 'Memory presets stated: {presets}', 'Easy assembly stated'],
    cons: ['No UL or ETL listing named', 'No height range for the electric lift', 'No test or standard named beside the capacity'],
    bestFor: 'A reader who wants a load figure, a preset count and a frame word together.',
    badge: {
      label: 'Load figure, preset count and frame word',
      basis: '{capacity}, {presets} memory presets and a stable steel frame, together on this listing and no other.',
      rule: { kind: 'flag', value: 'load-and-stable-frame-four-presets' },
    },
  },
  B0F8MHPVPH: {
    summary: 'A FEZIBO electric standing desk printed at {dims} in maple, with {presets} customizable memory presets.',
    pros: ['Desktop size printed: {dims}', 'Electric height adjustment stated', 'Customizable presets stated: {presets}', 'Maple named in the title'],
    cons: ['No weight capacity printed on this desk', 'No UL or ETL listing named for the lift', 'Maple is not stated as the desktop material'],
    bestFor: 'A reader comparing preset counts across electric desks.',
  },
  B0BZ7GXM4M: {
    summary: 'A Claiks electric standing desk printed at {dims} in rustic brown. The listing states {capacity}, {presets} memory presets, a stable steel frame and a cable management hub and hook.',
    pros: ['Weight capacity printed: {capacity}', 'Desktop size printed: {dims}', 'Cable management hub and hook stated', 'Memory presets stated: {presets}'],
    cons: ['No UL or ETL listing named for the motor', 'No height range printed', 'Rustic brown is a color name, not a top material'],
    bestFor: 'A reader who wants a load figure and cable handling on the same listing.',
    badge: {
      label: 'Load figure and a cable hub stated',
      basis: 'The listing states {capacity} and a cable management hub and hook; no other desk here prints both.',
      rule: { kind: 'flag', value: 'load-and-cable-hub' },
    },
  },
  B0DJ2XKJJT: {
    summary: 'A FLEXISPOT EN1 electric desk printed at {dims}, maple on a white frame, with {presets} memory presets. The listing states {capacity}, a one-piece seamless desktop and a quiet build.',
    pros: ['Weight capacity printed: {capacity}', 'One-piece seamless desktop stated', 'Memory presets stated: {presets}', 'Quiet build stated'],
    cons: ['No UL or ETL listing named', 'No noise figure behind quiet', 'No material named for the seamless desktop'],
    bestFor: 'A reader who wants a load figure beside a described desktop.',
    badge: {
      label: 'Load figure with a one-piece desktop',
      basis: 'The listing states {capacity} and a one-piece seamless desktop; no other desk describes its desktop that way.',
      rule: { kind: 'flag', value: 'load-and-seamless-desktop' },
    },
  },

  /* ---------------- bookcases ---------------- */
  B074NHRZQX: {
    summary: 'A narrow Furinno LUDER column counted in cubes, {units}, at {dims}. The listing states open shelves and easy assembly.',
    pros: ['Cube count printed: {units}', 'Full size printed: {dims}', 'Open shelves stated', 'Easy assembly stated'],
    cons: ['No load for a cube', 'No material named for the shelves', 'Does not say whether it stacks'],
    bestFor: 'A reader who wants a full printed size on a small cube column.',
    badge: {
      label: 'Cube count with all three dimensions',
      basis: '{units} and {dims}; the other listing that counts cubes prints no size.',
      rule: { kind: 'flag', value: 'cubes-with-dimensions' },
    },
  },
  B08XX3XYBB: {
    summary: 'A Furinno PASIR shelf with {units} at {dims}. The listing states little beyond those figures.',
    pros: ['Tier count printed: {units}', 'Full size printed: {dims}', 'Plain white finish in the title', 'None of the tracked words printed'],
    cons: ['No shelf load for any tier', 'No material named for the PASIR', 'No assembly claim either way'],
    bestFor: 'A reader who prefers figures to adjectives on a short shelf.',
  },
  B0BNHZCBWK: {
    summary: 'A VASAGLE bookshelf with {units} at {dims}, and nothing else stated.',
    pros: ['Tier count printed: {units}', 'Full size printed: {dims}', 'Figures in the title and the text agree', 'No tracked word printed'],
    cons: ['No shelf load stated', 'No material or finish named', 'No assembly information'],
    bestFor: 'A reader who wants a taller shelf with a printed size and no adjectives.',
  },
  B0DCB9L4HP: {
    summary: 'The taller Furinno LUDER, with {units} at {dims} and open shelves. Its largest figure is the largest printed on any bookcase here.',
    pros: ['Tier count printed: {units}', 'Full size printed: {dims}', 'Open shelves stated', 'Tall in the title, with a figure behind it'],
    cons: ['No shelf load for any of the tiers', 'No material named for the tall shelf', 'No anti-tip word or wall part named'],
    bestFor: 'A reader who wants the largest printed bookcase figure in the catalog.',
    badge: {
      label: 'Most tiers stated',
      basis: '{units} and {dims}; no other bookcase listing counts more tiers, and like every bookcase here it prints no shelf load.',
      rule: { kind: 'max', metric: 'tiers', value: 6 },
    },
  },
  B0H1G1G996: {
    summary: 'A DUMOS shelving unit with {units}, described as tall, narrow and standing, with open display storage.',
    pros: ['Tier count printed: {units}', 'Narrow standing build stated', 'Open display storage stated', 'Black finish in the title'],
    cons: ['No size, although the listing says tall and narrow', 'No shelf load for the display tiers', 'No material named'],
    bestFor: 'A reader comparing how narrow is described without inches.',
  },
  B0CNTD7YGW: {
    summary: 'A Homes: Inside + Out Apexa organizer with {units}, a stackable wood build and a fit for cubby bins.',
    pros: ['Cube count printed: {units}', 'Wood build stated', 'Fit for cubby bins stated', 'Prints stackable'],
    cons: ['No size, so the bin fit cannot be checked', 'No stacked height or stacking limit', 'No load for either cube'],
    bestFor: 'A reader who wants a small cube organizer described as stackable.',
    note: 'The listing describes it for [[a dorm or teen room]]. That is the listing’s wording, and this site does not extend it.',
    badge: {
      label: 'Only stackable bookcase listing',
      basis: 'It prints a stackable wood build; no other bookcase listing uses any of the words this site tracks.',
      rule: { kind: 'flag', value: 'stackable-bookcase' },
    },
  },

  /* ---------------- chairs ---------------- */
  B0FQDM23S4: {
    summary: 'A BestOffice mid-back swivel chair whose listing prints ergonomic, lumbar support and a breathable backrest, on a sponge seat with rolling wheels.',
    pros: ['Lumbar support and adjustable height stated', 'Breathable backrest stated', 'Sponge seat stated', 'Rolling wheels stated'],
    cons: ['No seat height or seat width', 'No weight capacity for the sponge seat', 'Ergonomic printed with nothing to measure it by'],
    bestFor: 'A reader who wants a mid-back chair that names its seat material.',
  },
  B0CG6V2XGS: {
    summary: 'A TRALT chair with lumbar support, a headrest and flip-up armrests. The listing states {capacity} and uses the words ergonomic and gaming chair.',
    pros: ['Weight capacity printed: {capacity}', 'Headrest stated', 'Flip-up armrests stated', 'Lumbar support stated'],
    cons: ['No size of any kind', 'No test named beside the capacity', 'Calls itself an office chair and a gaming chair without saying what differs'],
    bestFor: 'A reader who wants a chair listing with a load figure on it.',
    badge: {
      label: 'Only chair stating a weight figure',
      basis: 'The listing states {capacity}, the only load figure in the chair category.',
      rule: { kind: 'flag', value: 'chair-weight-figure' },
    },
  },
  B0GZGKNCLJ: {
    summary: 'A DUMOS mid-back mesh chair with lumbar support, adjustable height, a fixed armrest, a rocking mode and a 360 degree swivel. It prints ergonomic.',
    pros: ['Rocking mode stated', '360 degree swivel stated', 'Fixed armrest stated', 'Adjustable height stated'],
    cons: ['No range for the height adjustment', 'No weight capacity on the rocking chair', 'No figure for the rocking mode'],
    bestFor: 'A reader who wants a chair that states a rocking mode.',
    badge: {
      label: 'Only chair stating a rocking mode',
      basis: 'The listing states a rocking mode; no other chair here mentions one.',
      rule: { kind: 'flag', value: 'rocking-mode' },
    },
  },
  B0DKNN49QP: {
    summary: 'A NEO CHAIR high-back mesh chair with adjustable lumbar support, breathable mesh and flip-up armrests. It prints ergonomic.',
    pros: ['High back stated', 'Adjustable lumbar support stated', 'Flip-up armrests stated', 'Breathable mesh stated'],
    cons: ['No back height, although it is called high', 'No weight capacity for the high-back chair', 'No range for the lumbar adjustment'],
    bestFor: 'A reader comparing high-back mesh chairs by the parts they name.',
  },
  B0H3JK9Y46: {
    summary: 'A Sweetcrispy mid-back mesh chair with lumbar support, flip-up arms and a swivel task build. It is the mesh chair here that does not print ergonomic.',
    pros: ['Lumbar support stated', 'Flip-up arms stated', 'Swivel task build stated', 'Mid-back mesh stated'],
    cons: ['No seat height or height range', 'No weight capacity for the task chair', 'No word on wheels either way'],
    bestFor: 'A reader who wants a task chair described without the word ergonomic.',
  },
  B0CQD3K8PJ: {
    summary: 'A TRALT mesh chair in an executive shape with adjustable lumbar support. It prints ergonomic.',
    pros: ['Adjustable lumbar support stated', 'Mesh build stated', 'Executive chair shape stated', 'Prints ergonomic'],
    cons: ['No weight capacity printed on this TRALT listing', 'No armrest or headrest details', 'No size for the executive shape'],
    bestFor: 'A reader comparing the TRALT listings side by side.',
  },
  B0H79CXGNX: {
    summary: 'A small armless Sweetcrispy chair with a low mesh back, adjustable lumbar support and swivel wheels. It prints ergonomic.',
    pros: ['Armless low back stated', 'Adjustable lumbar support stated', 'Swivel wheels stated', 'Mesh named'],
    cons: ['No seat size, although small is in the title', 'No weight capacity for the armless chair', 'No height adjustment stated'],
    bestFor: 'A reader who wants an armless mesh chair described by its parts.',
  },
  B0CP22DQQS: {
    summary: 'A Marsail high-back mesh chair with adjustable lumbar support, 3D armrests, a headrest and swivel wheels. It prints ergonomic.',
    pros: ['3D armrests stated', 'Headrest stated', 'Adjustable lumbar support stated', 'Swivel wheels stated'],
    cons: ['Does not say what 3D means for the armrests', 'No weight capacity for the Marsail', 'No back or seat height'],
    bestFor: 'A reader who wants a high-back chair that names its armrest type.',
    badge: {
      label: 'Only chair stating 3D armrests',
      basis: 'The listing states 3D armrests; no other chair here describes its armrests that way.',
      rule: { kind: 'flag', value: '3d-armrests' },
    },
  },
  B0H7VKYTV5: {
    summary: 'A DUMOS mid-back chair with Ergonomic in its title, lumbar support, a breathable backrest, a fixed armrest, adjustable height and a 360 degree swivel.',
    pros: ['Lumbar support stated', 'Breathable backrest stated', 'Fixed armrest stated', 'Adjustable height and swivel stated'],
    cons: ['No figure or standard behind the title word', 'No weight capacity for the mid-back chair', 'No seat or back size'],
    bestFor: 'A reader tracing how ergonomic is used when it sits in the title itself.',
    badge: {
      label: 'Only chair with Ergonomic in the title',
      basis: 'The word sits in the product title; the listing prints no size, load or standard beside it.',
      rule: { kind: 'flag', value: 'ergonomic-in-title' },
    },
  },
  B0D6QX1MRC: {
    summary: 'An Orange Factory criss-cross chair with a wide fabric seat, a cross-legged shape, adjustable height, a 360 degree swivel and silent wheels.',
    pros: ['Wide fabric seat stated', 'Cross-legged shape stated', 'Silent wheels stated', 'Adjustable height stated'],
    cons: ['No seat width, although wide is stated', 'No weight capacity for the fabric seat', 'No figure behind silent'],
    bestFor: 'A reader who wants a criss-cross seat on wheels.',
  },
  B0FQP3NQDQ: {
    summary: 'An OLIXIS criss-cross chair with a wide armless seat, adjustable height, a swivel rolling base and a fabric finish.',
    pros: ['Wide armless seat stated', 'Swivel rolling base stated', 'Adjustable height stated', 'Fabric finish stated'],
    cons: ['No seat size printed', 'No load figure for the rolling base', 'No height range for the OLIXIS seat'],
    bestFor: 'A reader comparing criss-cross seats from a brand that also sells desks and dressers here.',
  },
  B0FLPXDVJX: {
    summary: 'A DUMOS criss-cross chair stated with no wheels, with an armless wide seat, adjustable height and a swivel.',
    pros: ['Stated without wheels', 'Armless wide seat stated', 'Swivel stated', 'Adjustable height stated'],
    cons: ['No seat width behind wide', 'No weight capacity for the wheel-free seat', 'No figures for the swivel or the seat'],
    bestFor: 'A reader who wants a criss-cross seat listed without wheels.',
    badge: {
      label: 'Only chair stated without wheels',
      basis: 'The listing states a seat with no wheels; every other chair either names wheels or says nothing about them.',
      rule: { kind: 'flag', value: 'no-wheels' },
    },
  },

  /* ---------------- dressers ---------------- */
  B0FS291QM5: {
    summary: 'A small SONGMICS dresser with {units} in cloud white and a steel frame.',
    pros: ['Drawer count printed: {units}', 'Fabric drawers stated', 'Steel frame named', 'Cloud white finish in the title'],
    cons: ['No size, although small is in the title', 'No load for a drawer or for the top', 'No top material named for the small dresser'],
    bestFor: 'A reader who wants the fewest drawers printed on any dresser here.',
    badge: {
      label: 'Fewest stated drawers',
      basis: '{units}; every other dresser listing counts more.',
      rule: { kind: 'min', metric: 'drawers', value: 3 },
    },
  },
  B0GL7NSMLL: {
    summary: 'A Sweetcrispy tower with {units} and a sturdy frame, sold as both a dresser and a {also}.',
    pros: ['Drawer count printed: {units}', 'Fabric drawers stated', 'Prints sturdy for the frame', 'Names both uses in the title'],
    cons: ['No height, although tall is in the title', 'No frame material named', 'No load figure behind sturdy'],
    bestFor: 'A reader looking at pieces sold under two names.',
  },
  B09537H92X: {
    summary: 'A small WLIVE tower with {units} in vertical fabric drawers, described as space-saving and sold as a dresser and a {also}.',
    pros: ['Drawer count printed: {units}', 'Vertical fabric drawers stated', 'Prints space-saving', 'Charcoal black finish in the title'],
    cons: ['No size behind space-saving', 'No frame material named for the tower', 'No top material named'],
    bestFor: 'A reader tracking space-saving on a listing that prints no size.',
  },
  B0H1WJ2MT9: {
    summary: 'An OLIXIS dresser with {units}, a {top} and a metal frame. The listing text also calls it a {also}, though the title does not.',
    pros: ['Drawer count printed: {units}', 'Top named: {top}', 'Metal frame named', 'Fabric drawers stated'],
    cons: ['No size of the dresser', 'No weight capacity for the wooden top', 'No television size stated'],
    bestFor: 'A reader comparing wooden tops across dressers.',
  },
  B0GY3P6NVK: {
    summary: 'An OLIXIS fabric dresser with {units}, described as easy-pull bins, a sturdy steel frame and a {top}.',
    pros: ['Drawer count printed: {units}', 'Top named: {top}', 'Steel frame named', 'Easy-pull bins stated'],
    cons: ['No size of any kind for the white tower', 'No figure behind easy-pull', 'No weight capacity to go with sturdy'],
    bestFor: 'A reader who wants a white tower with a named top.',
  },
  B0CGZLDFHZ: {
    summary: 'A tall WLIVE dresser in rustic brown with {units} in vertical fabric drawers.',
    pros: ['Drawer count printed: {units}', 'Vertical fabric drawers stated', 'Tall vertical design stated', 'Rustic brown finish in the title'],
    cons: ['No height, although tall appears in the title and the text', 'No frame or top material named', 'No load figure of any kind'],
    bestFor: 'A reader comparing tall towers that print no height.',
  },
  B0B8NYH6CC: {
    summary: 'A wide WLIVE dresser with {units}, sold as a dresser and a {also}. The listing states [[a fit for televisions up to 45 inches]].',
    pros: ['Drawer count printed: {units}', 'Television fit stated as a size in inches', 'Wide storage design stated', 'TV stand named in the title'],
    cons: ['No size, although wide is stated', 'No load figure for the top', 'No top material named for the TV stand'],
    bestFor: 'A reader who wants a dresser listing that states a television fit.',
    badge: {
      label: 'Only listing stating a television fit',
      basis: 'The listing states [[a fit for televisions up to 45 inches]]; it gives no load for the top.',
      rule: { kind: 'flag', value: 'television-size' },
    },
  },
  B07FQLN6QW: {
    summary: 'A wide WLIVE dresser with {units}, a sturdy steel frame and a {top}.',
    pros: ['Drawer count printed: {units}', 'Top named: {top}', 'Steel frame named', 'Prints sturdy'],
    cons: ['No width, although wide is in the title', 'No load figure for the drawers', 'No weight capacity to back sturdy'],
    bestFor: 'A reader comparing wide dressers that name their top.',
  },
  B0GWHLR4TN: {
    summary: 'A Sweetcrispy storage tower with {units}, a metal frame and a {top}. The title calls it large storage.',
    pros: ['Drawer count printed: {units}', 'Top named: {top}', 'Metal frame named', 'Large storage in the title'],
    cons: ['No size behind large storage', 'No height for the tower', 'No load figure for the Sweetcrispy drawers'],
    bestFor: 'A reader who wants a high drawer count with a named top.',
  },
  B0FNRH6B2N: {
    summary: 'A tall storage organizer with no brand in its title, {units} as fabric bins, a {top} and a metal frame. It prints an anti-tip design and names no part.',
    pros: ['Drawer count printed: {units}', 'Anti-tip design stated', 'Top named: {top}', 'Metal frame named'],
    cons: ['No part named for the anti-tip design', 'No height, mass or storage volume', 'No brand named in the organizer title'],
    bestFor: 'A reader who wants to see how anti-tip is printed when no part is named.',
    badge: {
      label: 'Only listing printing anti-tip',
      basis: 'The listing states an anti-tip design and names no part; the site does not read the word as a device.',
      rule: { kind: 'flag', value: 'anti-tip' },
    },
  },
  B09MVQZ7VM: {
    summary: 'A wide WLIVE dresser with {units}, a sturdy steel frame and a smooth {top}. The title calls the finish black wood grain.',
    pros: ['Drawer count printed: {units}', 'Top named: {top}', 'Steel frame named', 'Wood grain look named in the title'],
    cons: ['Wood grain describes a look, not a material', 'No width behind wide', 'No load figure for the drawers behind sturdy'],
    bestFor: 'A reader checking how a wood look and a wood top are printed on the same listing.',
  },
  B0FL6X1JZS: {
    summary: 'A DUMOS dresser in matte black with {units}, a sturdy metal frame and a {top}.',
    pros: ['Drawer count printed: {units}', 'Top named: {top}', 'Metal frame named', 'Prints sturdy'],
    cons: ['No height for the highest drawer count here', 'No load figure for any drawer', 'No anti-tip word or wall part named'],
    bestFor: 'A reader who wants the highest printed drawer count.',
    badge: {
      label: 'Highest stated drawer count',
      basis: '{units}; no other dresser listing counts as many.',
      rule: { kind: 'max', metric: 'drawers', value: 9 },
    },
  },
}
