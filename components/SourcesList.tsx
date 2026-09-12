import type { Source } from '@/data/types'

export function SourcesList({ sources, className = '' }: { sources: Source[]; className?: string }) {
  if (sources.length < 2) throw new Error('A content page needs at least two sources')
  return (
    <section className={className} aria-labelledby="sources-heading" id="sources">
      <p id="sources-heading" className="label label-lg">
        Sources
      </p>
      <ul className="mt-3 space-y-2 text-[15px]">
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} className="text-link" rel="noopener noreferrer" target="_blank">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
