/** Chart legend — always rendered for ≥2 series (identity never rides on
 *  color-matching alone). Text stays in ink tokens; the dot carries the hue. */
export function Legend({
  items,
  className = "",
}: {
  items: { label: string; color: string; dashed?: boolean }[];
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${className}`}>
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5 text-[12px] text-mute">
          {it.dashed ? (
            <span
              className="inline-block h-0 w-4 border-t-2 border-dashed"
              style={{ borderColor: it.color }}
            />
          ) : (
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: it.color }} />
          )}
          {it.label}
        </span>
      ))}
    </div>
  );
}
