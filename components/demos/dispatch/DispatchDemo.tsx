"use client";

import "./dispatch.css";
import { useEffect, useState } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { IntroPanel } from "@/components/annotations/IntroPanel";
import {
  CAMPAIGNS,
  INITIAL_BOARD,
  tickBoard,
  type Board,
  type Campaign,
} from "./data";
import { LiveOps } from "./views/LiveOps";
import { Campaigns } from "./views/Campaigns";
import { Attempts } from "./views/Attempts";
import { ScriptDetail } from "./views/ScriptDetail";

type ViewId = "dashboard" | "campaigns" | "attempts" | "script";

const NAV: { id: ViewId; label: string }[] = [
  { id: "dashboard", label: "En vivo" },
  { id: "campaigns", label: "Campañas" },
  { id: "attempts", label: "Intentos" },
  { id: "script", label: "Guion" },
];

export function DispatchDemo() {
  const [view, setView] = useState<ViewId>("dashboard");
  const [board, setBoard] = useState<Board>(INITIAL_BOARD);
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS);

  // The demo's heartbeat — the live board churns whether or not you watch it.
  useEffect(() => {
    const iv = setInterval(() => setBoard(tickBoard), 1000);
    return () => clearInterval(iv);
  }, []);

  const runningCampaigns = campaigns.filter((c) => c.status === "running").length;

  function toggleCampaign(id: string) {
    setCampaigns((cs) =>
      cs.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "running" ? "paused" : "running" }
          : c
      )
    );
  }

  return (
    <ToastProvider>
      <div className="demo-dispatch mx-auto flex max-w-[1600px] flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="shrink-0 border-b border-hairline px-6 py-4 md:sticky md:top-16 md:min-h-[calc(100vh-4rem)] md:w-52 md:self-start md:border-b-0 md:border-r md:px-5 md:py-8">
          <div className="flex items-center justify-between md:block">
            <div className="flex items-center gap-2">
              <span className="h-[9px] w-[9px] rounded-full" style={{ background: "var(--ink)" }} />
              <span className="font-mono text-lg font-semibold uppercase tracking-[0.2em]">Dispatch</span>
            </div>
            <p className="tag !text-[9px] md:mt-1">Despachador de llamadas</p>
          </div>

          <nav className="mt-3 flex gap-1 overflow-x-auto md:mt-10 md:flex-col md:gap-0.5">
            {NAV.map((n) => {
              const active = view === n.id;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setView(n.id)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-full px-3 py-1.5 text-left text-[13px] transition-colors md:w-full md:rounded-lg ${
                    active ? "text-ink" : "text-mute hover:text-ink"
                  }`}
                  style={active ? { background: "color-mix(in oklab, var(--ink) 5%, transparent)" } : undefined}
                >
                  <span
                    className="h-1 w-1 rounded-full transition-colors"
                    style={{ background: active ? "var(--accent-glow)" : "var(--mute)" }}
                  />
                  {n.label}
                  {n.id === "dashboard" && (
                    <span className="ml-auto hidden font-mono text-[10px] tabular-nums text-mute md:inline">
                      {board.calls.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-6 hidden border-t border-hairline pt-4 md:block">
            <p className="font-mono text-[10px] text-mute">operador@demo.noria</p>
            <button type="button" className="mt-1 text-[12px] text-mute transition-colors hover:text-ink">
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Main pane */}
        <div className="min-w-0 flex-1 px-4 py-6 md:px-10 md:py-8">
          <IntroPanel
            kicker="Noria Dispatch"
            title="Operaciones de voz con IA"
            points={[
              "Los agentes de voz con IA llaman y una persona toma el control en cuanto alguien responde.",
              "Las llamadas se detienen al conectar: nadie recibe una llamada duplicada.",
              "Todos los nombres, números y saldos son ficticios.",
            ]}
          />

          {view === "dashboard" && <LiveOps board={board} runningCampaigns={runningCampaigns} />}
          {view === "campaigns" && (
            <Campaigns
              campaigns={campaigns}
              onToggle={toggleCampaign}
              onCreate={(c) => setCampaigns((cs) => [c, ...cs])}
            />
          )}
          {view === "attempts" && <Attempts />}
          {view === "script" && <ScriptDetail />}
        </div>
      </div>
    </ToastProvider>
  );
}
