"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import {
  INITIAL_RULES,
  REQUESTS,
  type PurchaseRequest,
  type QueueId,
  type Risk,
  type Rule,
} from "./data";

export type View = "centro" | "bandeja" | "detalle" | "automatizaciones";
export type Decision = "aprobada" | "devuelta";
export type ModalKind =
  | { kind: "approval"; requestId: string }
  | { kind: "email"; requestId: string }
  | { kind: "rule"; requestId?: string }
  | null;

export type Filters = {
  q: string;
  queue: QueueId | "todas";
  risk: Risk | "todos";
};

type ProcureCtx = {
  view: View;
  go: (v: View) => void;
  selectedId: string | null;
  openDetail: (id: string) => void;
  selected: PurchaseRequest | null;

  filters: Filters;
  setFilters: (f: Partial<Filters>) => void;
  density: "detallada" | "compacta";
  setDensity: (d: "detallada" | "compacta") => void;

  role: "Compras" | "Jefatura";
  toggleRole: () => void;

  decisions: Record<string, Decision>;
  decide: (id: string, d: Decision) => void;
  extraAudit: Record<string, string[]>;
  addAudit: (id: string, line: string) => void;

  selectedQuotes: Record<string, string>;
  selectQuote: (reqId: string, quoteId: string) => void;

  rules: Rule[];
  addRule: (r: Rule) => void;
  ruleJustCreated: boolean;

  modal: ModalKind;
  setModal: (m: ModalKind) => void;

  tourStep: number | null;
  startTour: () => void;
  nextTourCase: () => void;
};

const Ctx = createContext<ProcureCtx | null>(null);

export function useProcure(): ProcureCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useProcure outside provider");
  return v;
}

/** The 6 canonical scenarios, in tour order. */
const TOUR_IDS = REQUESTS.slice(0, 6).map((r) => r.id);

export function ProcureProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [view, setView] = useState<View>("centro");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<Filters>({ q: "", queue: "todas", risk: "todos" });
  const [density, setDensity] = useState<"detallada" | "compacta">("detallada");
  const [role, setRole] = useState<"Compras" | "Jefatura">("Compras");
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [extraAudit, setExtraAudit] = useState<Record<string, string[]>>({});
  const [selectedQuotes, setSelectedQuotes] = useState<Record<string, string>>({});
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [ruleJustCreated, setRuleJustCreated] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const [tourStep, setTourStep] = useState<number | null>(null);

  const go = useCallback((v: View) => {
    setView(v);
    if (v !== "detalle") window.scrollTo({ top: 0 });
  }, []);

  const openDetail = useCallback((id: string) => {
    setSelectedId(id);
    setView("detalle");
    window.scrollTo({ top: 0 });
  }, []);

  const setFilters = useCallback((f: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...f }));
  }, []);

  const toggleRole = useCallback(() => {
    setRole((r) => {
      const next = r === "Compras" ? "Jefatura" : "Compras";
      toast(`Vista cambiada a ${next}`, "info");
      return next;
    });
  }, [toast]);

  const addAudit = useCallback((id: string, line: string) => {
    setExtraAudit((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), line] }));
  }, []);

  const decide = useCallback(
    (id: string, d: Decision) => {
      setDecisions((prev) => ({ ...prev, [id]: d }));
      addAudit(id, d === "aprobada" ? "09:02 · Aprobada desde Noria Procure" : "09:02 · Devuelta al solicitante");
      toast(d === "aprobada" ? `${id} aprobada y registrada en SIGA` : `${id} devuelta al solicitante`, d === "aprobada" ? "ok" : "danger");
    },
    [addAudit, toast]
  );

  const selectQuote = useCallback((reqId: string, quoteId: string) => {
    setSelectedQuotes((prev) => ({ ...prev, [reqId]: quoteId }));
  }, []);

  const addRule = useCallback(
    (r: Rule) => {
      setRules((prev) => [r, ...prev]);
      setRuleJustCreated(true);
      toast(`Regla ${r.id} creada · próximas compras se auto-aprueban`, "ok");
    },
    [toast]
  );

  const startTour = useCallback(() => {
    setTourStep(0);
    setSelectedId(TOUR_IDS[0]);
    setView("detalle");
    window.scrollTo({ top: 0 });
    toast("Recorrido guiado · paso 1 de 6", "info");
  }, [toast]);

  const nextTourCase = useCallback(() => {
    setTourStep((prev) => {
      const next = prev === null ? 0 : (prev + 1) % TOUR_IDS.length;
      setSelectedId(TOUR_IDS[next]);
      window.scrollTo({ top: 0 });
      toast(`Recorrido guiado · paso ${next + 1} de 6`, "info");
      return next;
    });
  }, [toast]);

  const selected = useMemo(
    () => REQUESTS.find((r) => r.id === selectedId) ?? null,
    [selectedId]
  );

  const value: ProcureCtx = {
    view,
    go,
    selectedId,
    openDetail,
    selected,
    filters,
    setFilters,
    density,
    setDensity,
    role,
    toggleRole,
    decisions,
    decide,
    extraAudit,
    addAudit,
    selectedQuotes,
    selectQuote,
    rules,
    addRule,
    ruleJustCreated,
    modal,
    setModal,
    tourStep,
    startTour,
    nextTourCase,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
