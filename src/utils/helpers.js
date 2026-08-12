export const normalize = (s) =>
  s
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim() || "";

export const actLabel = (a) =>
  a.types && a.types.length > 0 ? a.types.join(", ") : a.type || "";

export const shortSt = (s) =>
  (
    {
      "Proposta Enviada": "Proposta",
      Confirmado: "Confirmado",
      "Aguarda nota de empenho": "Aguarda Empenho",
      "Aguardando pagamento": "Aguarda Pagamento",
      Realizado: "Realizado",
    }[s] || s
  );

export const ss = (s, SS) => SS[s] || { bg: "#f1f5f9", cl: "#475569", dot: "#94a3b8" };

export const tClr = (t, TYPE_CLR) => TYPE_CLR[t] || { bg: "#f1f5f9", border: "#e2e8f0", dot: "#94a3b8" };

export const uniqueId = () => Date.now() + Math.floor(Math.random() * 1000);
