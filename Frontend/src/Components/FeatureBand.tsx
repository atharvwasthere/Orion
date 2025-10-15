import * as React from "react"

type FeatureItem = {
  title?: string
  description: string
  icon?: React.ReactNode
}

type FeatureBandProps = {
  id?: string
  headline: string
  items: readonly [FeatureItem, FeatureItem, FeatureItem]
  className?: string
}
/**
 * FeatureBand — big headline on left, three compact features on right.
 * Responsive: single column on mobile, 12-col grid on lg+.
 */
export function FeatureBand({ id, headline, items, className }: FeatureBandProps) {
  return (
    <section
      id={id}
      className={[
        "w-full py-20 md:py-24",
        "bg-background text-foreground",
        className ?? "",
      ].join(" ")}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Headline */}
          <div className="lg:col-span-5">
            <h2
              id={id ? `${id}-title` : undefined}
              className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]"
            >
              {headline}
            </h2>
          </div>

          {/* Right: Three features */}
          <div className="lg:col-span-7">
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {items.map((item, i) => (
                <li key={i} className="max-w-xs">
                  <div className="mb-4 h-10 w-10 select-none">
                    {/* Default icon = simple blue glyph; replace with lucide if you like */}
                    {item.icon ?? <DefaultGlyph idx={i} />}
                  </div>
                  {item.title ? (
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  ) : null}
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/** tiny decorative blue glyphs — swap with lucide icons if installed */
function DefaultGlyph({ idx = 0 }: { idx?: number }) {
  const seeds = [
    // sparkle
    "M12 2l1.8 4.6L18 8l-4.2 1.4L12 14l-1.8-4.6L6 8l4.2-1.4L12 2z",
    // feather
    "M4 20c8-1 14-7 14-14v0c-4 0-8 2-11 5S4 16 4 20z",
    // orb stripes
    "M4 12a8 8 0 1 0 16 0H4zm0-3a8 8 0 0 1 16 0H4zm0 6a8 8 0 0 0 16 0H4z",
  ]
  const d = seeds[idx % seeds.length]
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden="true">
      <path d={d} className="fill-blue-600/95" />
    </svg>
  )
}
