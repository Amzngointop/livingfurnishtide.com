import { plainProse, renderProse } from './Prose'

/** Native details/summary accordion; content is in the HTML whether or not it is open. */
export function FAQ({ items, id, heading, jsonLd = false }: { items: { q: string; a: string }[]; id: string; heading: string; jsonLd?: boolean }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((x) => ({
      '@type': 'Question',
      name: plainProse(x.q),
      acceptedAnswer: { '@type': 'Answer', text: plainProse(x.a) },
    })),
  }
  return (
    <section className="faq" aria-labelledby={id}>
      <h2 id={id}>{heading}</h2>
      <div className="mt-6 divide-y divide-walnut-3 border-y border-walnut-3">
        {items.map((x) => (
          <details key={x.q} className="group py-4">
            <summary className="flex items-start justify-between gap-6 text-[17px] text-bone">
              <span>{renderProse(x.q)}</span>
              <span aria-hidden="true" className="faq-mark font-mono text-[20px] leading-none text-patina">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-[70ch] text-[15px]">{renderProse(x.a)}</p>
          </details>
        ))}
      </div>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} /> : null}
    </section>
  )
}
