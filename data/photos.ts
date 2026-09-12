/*
 * Four photo slots. Each src is the JSON-LD contentUrl read from the Pexels
 * photo page, checked with GET for 200 and image/jpeg. Alt text follows the
 * description on the stock page. No faces, no brands, no catalog products,
 * and no text is ever set over the pixels.
 */

export interface Photo {
  id: 'spread-words' | 'spread-numbers' | 'spread-pieces' | 'contents'
  src: string
  width: number
  height: number
  alt: string
  credit: string
  creditUrl: string
  pageUrl: string
  /** CSS aspect-ratio for the slot. */
  aspect: string
}

export const photos: Record<Photo['id'], Photo> = {
  'spread-words': {
    id: 'spread-words',
    src: 'https://images.pexels.com/photos/34701790/pexels-photo-34701790/free-photo-of-cozy-interior-of-cabin-overlooking-lake-at-dusk.jpeg',
    width: 3815,
    height: 2861,
    alt: 'A dim cabin interior with wood-paneled walls, lit lamps and a chair by windows that look out on a lake at dusk',
    credit: 'April Choitz',
    creditUrl: 'https://www.pexels.com/@april-choitz-2027796355/',
    pageUrl: 'https://www.pexels.com/photo/cozy-interior-of-cabin-overlooking-lake-at-dusk-34701790/',
    aspect: '21 / 9',
  },
  'spread-numbers': {
    id: 'spread-numbers',
    src: 'https://images.pexels.com/photos/8337527/pexels-photo-8337527.jpeg',
    width: 6940,
    height: 5076,
    alt: 'Close-up of dark stained wood with pronounced grain running across the frame',
    credit: 'Adam Balcombe',
    creditUrl: 'https://www.pexels.com/@adam-balcombe-49911013/',
    pageUrl: 'https://www.pexels.com/photo/dark-stains-on-wood-8337527/',
    aspect: '16 / 9',
  },
  'spread-pieces': {
    id: 'spread-pieces',
    src: 'https://images.pexels.com/photos/13278838/pexels-photo-13278838.jpeg',
    width: 6240,
    height: 4160,
    alt: 'A dimly lit reading room with full bookshelves, two dark armchairs and a warm lamp between them',
    credit: 'Ayşe İpek',
    creditUrl: 'https://www.pexels.com/@simlibas/',
    pageUrl: 'https://www.pexels.com/photo/lamp-shade-between-black-armchairs-13278838/',
    aspect: '16 / 9',
  },
  contents: {
    id: 'contents',
    src: 'https://images.pexels.com/photos/31224475/pexels-photo-31224475/free-photo-of-moody-corridor-with-ambient-lighting-and-cozy-chair.jpeg',
    width: 3970,
    height: 5955,
    alt: 'A dim hallway with wooden floors leading toward a glowing room with a chair at the far end',
    credit: 'Eyüpcan Timur',
    creditUrl: 'https://www.pexels.com/@eyupcan-timur-424989336/',
    pageUrl: 'https://www.pexels.com/photo/moody-corridor-with-ambient-lighting-and-cozy-chair-31224475/',
    aspect: '1 / 1',
  },
}
