"use client";

export type StackedSegment = { label: string; value: number; color: string };

/**
 * Single horizontal 100% breakdown bar with 2px surface gaps between
 * segments. Render the itemized legend/list beside it in the consumer.
 */
export function StackedBar({
  segments,
  height = 10,
  className = "",
}: {
  segments: StackedSegment[];
  height?: number;
  className?: string;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const visible = segments.filter((s) => s.value > 0);

  return (
    <div
      className={`flex w-full overflow-hidden ${className}`}
      style={{ height, gap: 2 }}
      role="img"
      aria-label={visible.map((s) => `${s.label} ${Math.round((s.value / total) * 100)}%`).join(", ")}
    >
      {visible.map((s, i) => (
        <div
          key={s.label}
          title={`${s.label} — ${Math.round((s.value / total) * 100)}%`}
          style={{
            width: `${(s.value / total) * 100}%`,
            background: s.color,
            borderRadius:
              i === 0
                ? "4px 0 0 4px"
                : i === visible.length - 1
                  ? "0 4px 4px 0"
                  : 0,
            transition: "width 400ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      ))}
    </div>
  );
}
