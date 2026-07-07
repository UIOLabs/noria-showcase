/** Nice-number tick generation for a single y axis. */
export function niceTicks(maxValue: number, count = 4, minValue = 0): number[] {
  if (!isFinite(maxValue) || maxValue <= minValue) return [minValue, minValue + 1];
  const span = niceNum(maxValue - minValue, false);
  const step = niceNum(span / count, true);
  const lo = Math.floor(minValue / step) * step;
  const hi = Math.ceil(maxValue / step) * step;
  const ticks: number[] = [];
  for (let v = lo; v <= hi + step * 0.5; v += step) ticks.push(round(v));
  return ticks;
}

function niceNum(range: number, round: boolean): number {
  const exp = Math.floor(Math.log10(range));
  const frac = range / 10 ** exp;
  let nice: number;
  if (round) {
    nice = frac < 1.5 ? 1 : frac < 3 ? 2 : frac < 7 ? 5 : 10;
  } else {
    nice = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10;
  }
  return nice * 10 ** exp;
}

function round(v: number): number {
  return Math.abs(v) < 1e-9 ? 0 : +v.toPrecision(12);
}

export function fmtCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `${Math.round(n / 1000)}K`;
  if (abs >= 1_000) return `${+(n / 1000).toFixed(1)}K`;
  return `${round(n)}`;
}
