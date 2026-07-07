# Noria — Product Lines Showcase

A front-end-only, fully clickable showcase of three products built by **Noria
Technologies**, presented as one Noria-branded site with a product switcher.
Each tab drops you into a working demo — buttons, filters, modals, charts, and
live boards all respond — with **no backend, no database, no external APIs**.
Everything runs off mocked demo state in the browser and exports to static HTML.

> All companies, people, suppliers, ERP names, machine codes, phone numbers,
> and metrics in the demos are **fictional**. Nothing traces to a real client.

## Quick start

```bash
pnpm install   # or: npm install
pnpm dev       # or: npm run dev  → http://localhost:3000
```

Static build (deployable to any static host):

```bash
pnpm build     # outputs ./out
```

## The three product lines

| Route | Product line | What it is | Demo UI language |
|---|---|---|---|
| `/procure` | **Noria Procure** | AI procurement copilot on top of a client ERP — turns purchase requests into explained, auditable decisions | Spanish |
| `/plant` | **Noria Plant OS** | Manufacturing control center — live factory floor, finite-capacity scheduling with a "vs reality" backtest, margin & scrap analytics | Spanish |
| `/dispatch` | **Noria Dispatch** | AI voice operations for collections — AI agents dial, humans take over the moment someone answers | English |

## The plan (as executed)

### 1. Design system — ported from the Noria site

The token architecture comes from Noria's marketing site: **semantic CSS
variables** (`--bg`, `--ink`, `--accent`, `--mute`, `--hairline`, plus
`--surface`, `--ok/--warn/--danger/--info` added for product UIs) swapped by a
`data-theme` attribute on `<html>`, configured entirely in
[`app/globals.css`](app/globals.css) via Tailwind CSS v4's CSS-first config.

Two deliberate changes from the source site:

- **Emerald-forward.** The brand emerald `#27e0a2` is the primary accent in
  both themes (`#0e8a5f` on light for contrast); on the site it was only the
  logo glow.
- **User-owned theme.** The site swaps themes on scroll; here a persistent
  light/dark toggle lives in the nav (localStorage + system preference, with a
  pre-paint inline script so there is no flash).

Fonts (same five as the site, via `next/font`): **Fraunces** (display),
**Geist** (body), **JetBrains Mono** (labels/kickers/numbers), **Space
Grotesk** (wordmark), **Archivo 900** (the liquid-chrome NORIA logo, ported
as-is). The aesthetic is hairline borders, faint blueprint grids, ambient
emerald glows — no drop shadows, no gloss.

### 2. Architecture

```
app/
  layout.tsx            fonts, theme bootstrap, Noria shell
  page.tsx              product index (one viewport, three doors — not a landing page)
  procure|plant|dispatch/page.tsx
components/
  shell/                Nav (product switcher tabs), ThemeToggle, Footer, BrandLogo
  ui/                   Modal, Drawer, Toast — shared interaction primitives
  charts/               hand-built, theme-aware SVG charts (bars, lines, donut,
                        sparklines, stacked breakdown) — single-axis by design,
                        hairline grids, hover tooltips, accessible palettes
  annotations/          IntroPanel (per-demo explainer bar), Spotlight (feature callouts)
  demos/
    procure/            ProcureDemo + views + data.ts + procure.css
    plant/              PlantDemo + views + data.ts + plant.css
    dispatch/           DispatchDemo + views + data.ts + dispatch.css
lib/products.ts         product registry (tabs, names, taglines)
```

Each demo is a self-contained client component tree: all state lives in React
(mock records in `data.ts` module constants; "live" behavior driven by
intervals started in `useEffect`). Demo-specific styling is scoped under a
`.demo-<name>` class with theme-aware product variables, so each product keeps
its own identity inside the Noria chrome — in both themes.

### 3. Per-demo structure

**Noria Procure** (`components/demos/procure/`) — sidebar shell with role
toggle and streaming ERP-sync console. Views: *Centro* (command dashboard),
*Bandeja* (request inbox with live search/queue/risk filters and an AI copilot
side panel), *Detalle* (the signature screen: quote comparison with a price
chart that re-ranks as you select quotes, decision table, a 7-prompt AI
copilot, authorization panel, audit trail), *Automatizaciones* (rule builder +
a simulator that flips to "auto-approved" once a rule exists). Approval and
AI-drafted-email modals; toasts on every mutation.

**Noria Plant OS** (`components/demos/plant/`) — navy control-center chrome.
Views: *Panel* (KPI cards, revenue/margin/scrap charts, client and sales
tables with drill-down modals), *Planta* (the animated five-stage process-flow
board — extrusion → printing → lamination → cutting → sealing — with machine
health, plus a live orders table), *Planificador* (order queue + hand-built
Gantt with stage filters, zoom, and a job drawer with rescheduling actions;
the *vs Realidad* tab backtests the scheduler against reality with a
three-number hero band). Stage palette validated for color-vision safety in
both themes.

**Noria Dispatch** (`components/demos/dispatch/`) — monochrome ops terminal.
Views: *Live ops* (in-flight call board that genuinely churns: per-call timers,
progress slivers shifting emerald→amber→rose, flashing throughput sparkline,
outcome breakdown), *Campaigns* (list + five-step launch wizard with a live
plain-English plan summary and a launch confirm), *Attempts* (outcome-filtered
call log; each row opens a drawer with the AI call summary, sentiment,
transcript, and extracted structured fields), *Script* (the AI voice
configuration surface: prompt body, voice tuning, pronunciation dictionary,
post-call analysis schema).

### 4. Annotation layer

A slim, dismissible **IntroPanel** captions each demo (what it is, what's
real), and a few pulsing **Spotlight** dots explain standout features on
hover. Copy is minimal and declarative — one idea per element.

## Stack

Next.js 16 (App Router, `output: "export"`) · React 19 · Tailwind CSS v4
(CSS-first) · `motion` for transitions · TypeScript. Chosen to match the Noria
site (uioai) exactly, so this showcase can later be folded into it.
