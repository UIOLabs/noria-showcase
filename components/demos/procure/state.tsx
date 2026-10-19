"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useT } from "@/components/i18n/LocaleProvider";
import type { Text } from "@/lib/i18n";
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

export type Role = "Compras" | "Jefatura";
export type Density = "detallada" | "compacta";

export const ROLE_LABEL: Record<Role, Text> = {
  Compras: { en: "Purchasing", es: "Compras" },
  Jefatura: { en: "Manager", es: "Jefatura" },
};

export const DENSITY_LABEL: Record<Density, Text> = {
  detallada: { en: "Detailed", es: "Detallada" },
  compacta: { en: "Compact", es: "Compacta" },
};

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
  density: Density;
  setDensity: (d: Density) => void;

  role: Role;
  toggleRole: () => void;

  decisions: Record<string, Decision>;
  decide: (id: string, d: Decision) => void;
  extraAudit: Record<string, Text[]>;
  addAudit: (id: string, line: Text) => void;

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
  const t = useT();
  const [view, setView] = useState<View>("centro");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<Filters>({ q: "", queue: "todas", risk: "todos" });
  const [density, setDensity] = useState<Density>("detallada");
  const [role, setRole] = useState<Role>("Compras");
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [extraAudit, setExtraAudit] = useState<Record<string, Text[]>>({});
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
      toast(t({ en: `View switched to ${ROLE_LABEL[next].en}`, es: `Vista cambiada a ${ROLE_LABEL[next].es}` }), "info");
      return next;
    });
  }, [toast, t]);

  const addAudit = useCallback((id: string, line: Text) => {
    setExtraAudit((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), line] }));
  }, []);

  const decide = useCallback(
    (id: string, d: Decision) => {
      setDecisions((prev) => ({ ...prev, [id]: d }));
      addAudit(
        id,
        d === "aprobada"
          ? { en: "09:02 · Approved from Procure", es: "09:02 · Aprobada desde Procure" }
          : { en: "09:02 · Returned to the requester", es: "09:02 · Devuelta al solicitante" }
      );
      toast(
        d === "aprobada"
          ? t({ en: `${id} approved and logged in SIGA`, es: `${id} aprobada y registrada en SIGA` })
          : t({ en: `${id} returned to the requester`, es: `${id} devuelta al solicitante` }),
        d === "aprobada" ? "ok" : "danger"
      );
    },
    [addAudit, toast, t]
  );

  const selectQuote = useCallback((reqId: string, quoteId: string) => {
    setSelectedQuotes((prev) => ({ ...prev, [reqId]: quoteId }));
  }, []);

  const addRule = useCallback(
    (r: Rule) => {
      setRules((prev) => [r, ...prev]);
      setRuleJustCreated(true);
      toast(
        t({
          en: `Rule ${r.id} created · future purchases auto-approve`,
          es: `Regla ${r.id} creada · próximas compras se auto-aprueban`,
        }),
        "ok"
      );
    },
    [toast, t]
  );

  const startTour = useCallback(() => {
    setTourStep(0);
    setSelectedId(TOUR_IDS[0]);
    setView("detalle");
    window.scrollTo({ top: 0 });
    toast(t({ en: "Guided tour · step 1 of 6", es: "Recorrido guiado · paso 1 de 6" }), "info");
  }, [toast, t]);

  const nextTourCase = useCallback(() => {
    setTourStep((prev) => {
      const next = prev === null ? 0 : (prev + 1) % TOUR_IDS.length;
      setSelectedId(TOUR_IDS[next]);
      window.scrollTo({ top: 0 });
      toast(t({ en: `Guided tour · step ${next + 1} of 6`, es: `Recorrido guiado · paso ${next + 1} de 6` }), "info");
      return next;
    });
  }, [toast, t]);

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
