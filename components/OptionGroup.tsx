'use client'

/**
 * R8: a labelled group, never a fieldset with a legend. Options are buttons
 * with aria-pressed. A switched-off option is disabled and its reason is
 * printed under the group.
 */
export function OptionGroup<T extends string>({
  id,
  label,
  options,
  value,
  onChange,
  reasons = {},
}: {
  id: string
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  reasons?: Partial<Record<T, string | null>>
}) {
  const off = options.filter((o) => reasons[o.value])
  return (
    <div role="group" aria-labelledby={`${id}-label`} className="mt-6">
      <p id={`${id}-label`} className="label label-lg">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const reason = reasons[o.value]
          return (
            <button
              key={o.value}
              type="button"
              className="btn btn-sm"
              aria-pressed={value === o.value}
              disabled={Boolean(reason)}
              onClick={() => onChange(o.value)}
            >
              <span className="btn-label">{o.label}</span>
            </button>
          )
        })}
      </div>
      {off.length > 0 ? (
        <ul className="mt-3 space-y-1 text-[13px] text-bone-3">
          {off.map((o) => (
            <li key={o.value} data-disabled-reason="">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em]">Switched off · {o.label}:</span> {reasons[o.value]}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
