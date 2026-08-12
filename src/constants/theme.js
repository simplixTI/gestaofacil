export const T = {
  pri: "#475569",
  priHov: "#334155",
  priL: "#f1f5f9",
  priB: "#cbd5e1",
  bg: "#f2f3f5",
  surface: "#ffffff",
  border: "#e8edf3",
  borderS: "#f1f5f9",
  txt: "#0f172a",
  txtS: "#475569",
  txtM: "#64748b",
  txtX: "#94a3b8",
  shadow: "0 2px 8px rgba(0,0,0,.05)",
  shadowM: "0 4px 16px rgba(0,0,0,.08)",
  shadowL: "0 8px 32px rgba(0,0,0,.12)",
  rad: "12px",
  radS: "8px",
  radL: "16px",
};

export const CAT_CLR = { Público: "#1e3a8a", Privado: "#3d8fa8", Outros: "#64748b" };
export const CAT_BG = { Público: "#eff6ff", Privado: "#f0fdf4", Outros: "#fffbeb" };
export const CAT_TX = { Público: "#4b5563", Privado: "#4b5563", Outros: "#4b5563" };

export const MODALITIES = [
  "Palestra",
  "Curso Básico 2h",
  "Curso Básico 3h",
  "Curso Avançado Online 10h",
  "Prática Coletiva Supervisionada",
  "Diagnóstico Padrão de Clareza",
  "Simplificação de Documentos",
];

export const FORMATS = ["Presencial", "Online", "EAD", "Híbrido"];

export const ACT_ST = [
  "Proposta Enviada",
  "Aguarda nota de empenho",
  "Confirmado",
  "Aguardando pagamento",
  "Realizado",
];

export const SS = {
  "Proposta Enviada": { bg: "#eff6ff", cl: "#4b5563", dot: "#93c5fd" },
  Confirmado: { bg: "#f0fdf4", cl: "#4b5563", dot: "#86efac" },
  "Aguarda nota de empenho": { bg: "#fffbeb", cl: "#4b5563", dot: "#fcd34d" },
  "Aguardando pagamento": { bg: "#fff1f2", cl: "#4b5563", dot: "#fda4af" },
  Realizado: { bg: "#f5f3ff", cl: "#4b5563", dot: "#a78bfa" },
  Recebido: { bg: "#f0fdf4", cl: "#4b5563", dot: "#86efac" },
  Pendente: { bg: "#fffbeb", cl: "#4b5563", dot: "#fcd34d" },
  "A Receber": { bg: "#eff6ff", cl: "#4b5563", dot: "#93c5fd" },
  Pago: { bg: "#ecfdf5", cl: "#4b5563", dot: "#6ee7b7" },
};

export const TYPE_CLR = {
  Palestra: { bg: "#fef3c7", border: "#f59e0b", dot: "#d97706" },
  "Curso Básico 2h": { bg: "#dcfce7", border: "#22c55e", dot: "#15803d" },
  "Curso Básico 3h": { bg: "#f3e8ff", border: "#a855f7", dot: "#7e22ce" },
  "Curso Avançado Online 10h": { bg: "#ffe4e6", border: "#f43f5e", dot: "#be123c" },
  "Prática Coletiva Supervisionada": { bg: "#ccfbf1", border: "#14b8a6", dot: "#0f766e" },
  "Diagnóstico Padrão de Clareza": { bg: "#fce7f3", border: "#ec4899", dot: "#be185d" },
  "Simplificação de Documentos": { bg: "#e0f2fe", border: "#0ea5e9", dot: "#0369a1" },
};

export const FMT_PASTEL = {
  Presencial: { background: "#f0fdf4", color: T.txtS },
  Online: { background: "#dbeafe", color: T.txtS },
  EAD: { background: "#ede9fe", color: T.txtS },
  Híbrido: { background: "#fef3c7", color: T.txtS },
};

export const NEXT_BTN_CLR = {
  Confirmado: { bg: "#f0fdf4", border: "#bbf7d0" },
  "Aguarda nota de empenho": { bg: "#fffbeb", border: "#fde68a" },
  "Aguardando pagamento": { bg: "#ffe4e6", border: "#fda4af" },
};

export const NEXT_ST = {
  "Proposta Enviada": "Aguarda nota de empenho",
  "Aguarda nota de empenho": "Confirmado",
  Confirmado: "Aguardando pagamento",
  "Aguardando pagamento": "Realizado",
};

export const PREV_ST = Object.fromEntries(
  Object.entries(NEXT_ST).map(([k, v]) => [v, k])
);

export const DASH_GROUPS = [
  ["Confirmado", "Confirmadas"],
  ["Proposta Enviada", "Proposta Enviada"],
  ["Aguarda nota de empenho", "Aguarda Nota Empenho"],
  ["Aguardando pagamento", "Aguarda Pagamento"],
];

export const EXP_TIPOS = [
  "Passagem Aérea",
  "Passagem Rodoviária",
  "Hospedagem",
  "Alimentação",
  "Translado",
  "Outro",
];

export const TIPO_CLR = {
  "Passagem Aérea": "#2563eb",
  "Passagem Rodoviária": "#7c3aed",
  Hospedagem: "#0891b2",
  Alimentação: "#16a34a",
  Translado: "#d97706",
  Outro: "#64748b",
};

export const TIPO_BG = {
  "Passagem Aérea": "#dbeafe",
  "Passagem Rodoviária": "#ede9fe",
  Hospedagem: "#cffafe",
  Alimentação: "#dcfce7",
  Translado: "#fef3c7",
  Outro: "#f1f5f9",
};

export const CANAL_OPTS = ["Contato", "Atendimento", "LinkedIn", "Instagram", "Indicação", "Outro"];

export const LEAD_ST = ["Aguardando Proposta", "Proposta Enviada", "Em contratação", "Encerrada"];

export const HIST_CLR = {
  "Aguardando Proposta": { bg: "#fffbeb", dot: "#fcd34d", border: "#fde68a" },
  "Proposta Enviada": { bg: "#f0fdf4", dot: "#86efac", border: "#bbf7d0" },
  "Em contratação": { bg: "#eff6ff", dot: "#93c5fd", border: "#bfdbfe" },
  Encerrada: { bg: "#f1f5f9", dot: "#94a3b8", border: "#e2e8f0" },
};

export const CANAL_CLR = {
  Contato: "#dbeafe",
  Atendimento: "#e0e7ff",
  LinkedIn: "#dbeafe",
  Instagram: "#fce7f3",
  Indicação: "#fffbeb",
  Outro: "#f1f5f9",
};

export const CANAL_DOT = {
  Contato: "#60a5fa",
  Atendimento: "#818cf8",
  LinkedIn: "#3b82f6",
  Instagram: "#f472b6",
  Indicação: "#fcd34d",
  Outro: "#9ca3af",
};

export const CANAL_ICO = {
  Contato: "📞",
  Atendimento: "🎧",
  LinkedIn: "💼",
  Instagram: "📸",
  Indicação: "🤝",
  Outro: "💬",
};
