import type { ColumnKey } from '../data/gear.ts'
import type { ProductFacts } from '../data/types.ts'
import { dimensionAxes, pairs, WORD_ORDER } from './catalog.ts'

const WORD_TITLE: Record<string, string> = {
  sturdy: 'Sturdy',
  'heavy-duty': 'Heavy-duty',
  'ergonomic-and-lumbar-support': 'Ergonomic, lumbar support',
  'space-saving-and-compact': 'Space-saving',
  'stackable-and-expandable': 'Stackable, expandable',
  'anti-tip': 'Anti-tip',
}

export interface Column {
  key: ColumnKey
  header: string
  value: (p: ProductFacts) => string | null
}

/** Values belong to the row (R2): every cell is read from that listing alone. */
export const COLUMNS: Record<ColumnKey, Column> = {
  units: {
    key: 'units',
    header: 'Counted units',
    value: (p) => (p.statedUnitCount === null ? null : p.statedUnitCount.split(';')[0].trim()),
  },
  pairs: {
    key: 'pairs',
    header: 'Pairs',
    value: (p) => {
      const pr = pairs(p)
      if (!pr) return null
      return pr.max === null ? `${pr.min} or more pairs` : `${pr.min} to ${pr.max} pairs`
    },
  },
  dims: {
    key: 'dims',
    header: 'Stated size',
    value: (p) => {
      if (p.statedDimensions === null) return null
      const axes = dimensionAxes(p)
      if (axes === 3) return p.statedDimensions
      if (/wide$/.test(p.statedDimensions)) return `${p.statedDimensions} (width only)`
      if (axes === 2) return `${p.statedDimensions} (two figures)`
      return `${p.statedDimensions} (one figure)`
    },
  },
  capacity: { key: 'capacity', header: 'Weight capacity', value: (p) => p.statedCapacity },
  presets: {
    key: 'presets',
    header: 'Memory presets',
    value: (p) => (p.statedPresets === null ? null : `${p.statedPresets} presets`),
  },
  top: { key: 'top', header: 'Top, as named', value: (p) => p.statedTopMaterial },
  alsoCalled: {
    key: 'alsoCalled',
    header: 'Also called',
    value: (p) => (p.alsoCalled === null ? null : `${p.alsoCalled.as} (${p.alsoCalled.where})`),
  },
  antiTip: {
    key: 'antiTip',
    header: 'Prints anti-tip',
    value: (p) => (p.statesAntiTip ? 'Prints the word' : null),
  },
  words: {
    key: 'words',
    header: 'Tracked words printed',
    value: (p) => {
      const list = WORD_ORDER.filter((w) => p.wordsUsed.includes(w)).map((w) => WORD_TITLE[w])
      return list.length === 0 ? 'None of them' : list.join('; ')
    },
  },
  features: {
    key: 'features',
    header: 'Other stated details',
    value: (p) => (p.features.length === 0 ? null : p.features.join('; ')),
  },
}

/**
 * R2: a column is shown only if at least one row has a value and the rows do
 * not all read the same. Returns the kept columns and, for the page, the
 * dropped ones with the reason.
 */
export function liveColumns(rows: ProductFacts[], keys: ColumnKey[]) {
  const kept: Column[] = []
  const dropped: { column: Column; reason: 'empty' | 'identical' }[] = []
  for (const key of keys) {
    const col = COLUMNS[key]
    const values = rows.map((r) => col.value(r))
    if (values.every((v) => v === null)) dropped.push({ column: col, reason: 'empty' })
    else if (new Set(values.map((v) => v ?? '∅')).size === 1) dropped.push({ column: col, reason: 'identical' })
    else kept.push(col)
  }
  return { kept, dropped }
}
