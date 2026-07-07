"use client";

import { useEffect, useRef, useState } from "react";

/** Measure a container's width so SVG charts render at exact pixel size
 *  (crisp hairlines, unscaled text) instead of stretching a viewBox. */
export function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setWidth(Math.round(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, width };
}
