"use client";

import { Fragment } from "react";
import { Spotlight } from "@/components/annotations/Spotlight";
import { useT } from "@/components/i18n/LocaleProvider";
import { SCRIPT } from "../data";
import { KV, PageHead, SectionLabel, StatusChip } from "../components/bits";

/** Render {{variables}} in the script body highlighted in the accent. */
function HighlightedBody({ body }: { body: string }) {
  const parts = body.split(/(\{\{[a-z_]+\}\})/g);
  return (
    <pre className="rounded-2xl border border-hairline bg-surface p-5 text-ink/80">
      {parts.map((p, i) =>
        p.startsWith("{{") ? (
          <span key={i} className="text-accent">
            {p}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        )
      )}
    </pre>
  );
}

export function ScriptDetail() {
  const t = useT();
  return (
    <div className="max-w-3xl">
      <PageHead
        eyebrow={t({ en: "Scripts", es: "Guiones" })}
        title={SCRIPT.name}
        desc={t({
          en: "What the AI voice agent says, listens for and extracts — versioned like code.",
          es: "Lo que el agente de voz con IA dice, escucha y extrae, versionado como código.",
        })}
        actions={
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px] text-mute">v{SCRIPT.version}</span>
            <StatusChip tone="ok" label={t(SCRIPT.status)} />
          </div>
        }
      />

      <section className="mb-8">
        <SectionLabel accessory={<span className="font-mono text-[10px] text-mute">{SCRIPT.language}</span>}>
          {t({ en: "Content · spoken in Spanish", es: "Contenido" })}
        </SectionLabel>
        <HighlightedBody body={SCRIPT.body} />
      </section>

      <section className="mb-8">
        <SectionLabel>Variables</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {SCRIPT.variables.map((v) => (
            <span key={v} className="rounded-full border border-hairline px-3 py-1 font-mono text-[11px] text-accent">
              {"{{" + v + "}}"}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionLabel>{t({ en: "Voice & timing", es: "Voz y tiempos" })}</SectionLabel>
        <div className="grid grid-cols-2 gap-x-8 md:grid-cols-3">
          <KV k={t({ en: "Voice", es: "Voz" })} v={SCRIPT.voice} />
          <KV k={t({ en: "Language", es: "Idioma" })} v={SCRIPT.language} />
          {SCRIPT.timing.map((row) => (
            <KV key={row.label.en} k={t(row.label)} v={t(row.value)} />
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {SCRIPT.tuning.map((row) => (
            <div key={row.label.en} className="flex items-center gap-4">
              <span className="w-48 shrink-0 text-[12px] text-mute">{t(row.label)}</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: "var(--hairline)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${row.value * 100}%`, background: "var(--accent)" }}
                />
              </div>
              <span className="w-8 text-right font-mono text-[11px] tabular-nums text-mute">{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionLabel>{t({ en: "Speech recognition", es: "Reconocimiento de voz" })}</SectionLabel>
        <p className="mb-2 text-[12px] text-mute">
          {t({
            en: "Boosted words the agent must recognize correctly:",
            es: "Palabras reforzadas que el agente debe reconocer correctamente:",
          })}
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {SCRIPT.keywords.map((k) => (
            <span key={k} className="rounded-full border border-hairline px-3 py-1 font-mono text-[11px]">
              {k}
            </span>
          ))}
        </div>
        <div className="rounded-xl border border-hairline">
          {SCRIPT.pronunciation.map((p, i) => (
            <div
              key={p.word}
              className={`flex items-center justify-between px-4 py-2.5 ${i > 0 ? "border-t border-hairline" : ""}`}
            >
              <span className="text-[13px]">{p.word}</span>
              <span className="font-mono text-[12px] text-mute">{p.ipa}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mb-8">
        <Spotlight
          note={t({
            en: "These seven fields are extracted from every conversation as structured data — nobody has to listen to routine calls.",
            es: "Estos siete campos se extraen de cada conversación como datos estructurados, sin que una persona escuche las llamadas rutinarias.",
          })}
          align="right"
        />
        <SectionLabel
          accessory={
            <span className="font-mono text-[10px] text-mute">
              {SCRIPT.schema.length} {t({ en: "fields", es: "campos" })}
            </span>
          }
        >
          {t({ en: "Post-call analysis schema", es: "Esquema de análisis posterior" })}
        </SectionLabel>
        <div className="rounded-xl border border-hairline">
          {SCRIPT.schema.map((f, i) => (
            <div
              key={f.field}
              className={`flex flex-col gap-0.5 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between ${
                i > 0 ? "border-t border-hairline" : ""
              }`}
            >
              <span className="font-mono text-[12px] text-accent">{f.field}</span>
              <span className="text-[12px] text-mute">{t(f.desc)}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionLabel>{t({ en: "Version history", es: "Historial de versiones" })}</SectionLabel>
        <ol className="flex flex-col">
          {SCRIPT.versions.map((v) => (
            <li key={v.v} className="flex items-baseline gap-4 border-t border-hairline py-2.5 first:border-t-0">
              <span className="w-8 shrink-0 font-mono text-[12px]">{v.v}</span>
              <span className="w-28 shrink-0 font-mono text-[11px] text-mute">{t(v.date)}</span>
              <span className="text-[13px] text-ink/80">{t(v.note)}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
