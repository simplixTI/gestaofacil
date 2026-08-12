import { useState } from "react";
import { List, Columns } from "lucide-react";
import { T, SS, NEXT_BTN_CLR, NEXT_ST, PREV_ST, DASH_GROUPS } from "../../constants/theme";
import { sortByDate, MON_ABR } from "../../utils/date";
import { money } from "../../utils/money";
import { ss, actLabel } from "../../utils/helpers";
import { Av } from "../ui";
import { CARD } from "../../styles/common";

export function ProximasAtividades({ activities, onOpen, onStatusChange, onVerTodas }) {
  const [dView, setDView] = useState("kanban");
  const pending = sortByDate(activities.filter((a) => a.status !== "Realizado"));

  const handleAdvance = (id, st) => {
    if (st === "Realizado" && !window.confirm("Marcar como Realizado? A atividade sairá da lista de pendentes."))
      return;
    onStatusChange(id, st);
  };

  const NEXT_LABEL = {
    Confirmado: "Confirmado",
    "Aguarda nota de empenho": "Empenho",
    "Aguardando pagamento": "Pagamento",
    Realizado: "Realizado",
  };

  return (
    <div style={{ ...CARD, padding: 24, marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: T.txt }}>Próximas Atividades</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              gap: 2,
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: T.radS,
              padding: 3,
            }}
          >
            {[
              ["list", <List size={12} />],
              ["kanban", <Columns size={12} />],
            ].map(([v, ic]) => (
              <button
                key={v}
                onClick={() => setDView(v)}
                type="button"
                style={{
                  padding: "5px 7px",
                  borderRadius: 6,
                  border: "none",
                  background: dView === v ? T.pri : "transparent",
                  color: dView === v ? "#fff" : T.txtX,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {ic}
              </button>
            ))}
          </div>
          <button
            onClick={onVerTodas}
            style={{
              fontSize: 12,
              color: T.pri,
              background: T.priL,
              border: "none",
              padding: "5px 12px",
              borderRadius: T.radS,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Ver todas →
          </button>
        </div>
      </div>

      {dView === "list" && (
        <div>
          {DASH_GROUPS.map(([st, label]) => {
            const gActs = sortByDate(pending.filter((a) => a.status === st));
            if (!gActs.length) return null;
            const { dot } = ss(st, SS);
            return (
              <div key={st} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot, flexShrink: 0 }} />
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 11,
                      color: "#4b5563",
                      textTransform: "uppercase",
                      letterSpacing: ".07em",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      background: "rgba(255,255,255,.8)",
                      color: "#4b5563",
                      padding: "1px 8px",
                      borderRadius: 20,
                      fontWeight: 700,
                    }}
                  >
                    {gActs.length}
                  </span>
                </div>
                {gActs.map((a, idx) => {
                  const parts = a.startDate.split("/");
                  const isLast = idx === gActs.length - 1;
                  return (
                    <div
                      key={a.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "52px 1px 1fr auto",
                        gap: "0 14px",
                        alignItems: "center",
                        padding: "12px 10px 12px 14px",
                        borderBottom: isLast ? "none" : `1px solid ${T.borderS}`,
                        borderRadius: T.radS,
                        transition: "background .15s",
                        borderLeft: "4px solid #e2e8f0",
                        marginBottom: 2,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = T.bg;
                        e.currentTarget.style.borderLeftColor = "#94a3b8";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "";
                        e.currentTarget.style.borderLeftColor = "#e2e8f0";
                      }}
                    >
                      <div style={{ textAlign: "center", flexShrink: 0, cursor: "pointer" }} onClick={() => onOpen(a)}>
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            color: T.txtX,
                            textTransform: "uppercase",
                            letterSpacing: ".1em",
                            lineHeight: 1,
                          }}
                        >
                          {MON_ABR[parseInt(parts[1]) - 1] || ""}
                        </div>
                        <div
                          style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color: T.txt,
                            lineHeight: 1.1,
                            marginTop: 2,
                            fontFamily: "'Poppins',sans-serif",
                          }}
                        >
                          {parts[0]}
                        </div>
                      </div>
                      <div style={{ width: 1, height: 36, background: T.border, flexShrink: 0 }} />
                      <div style={{ minWidth: 0, cursor: "pointer" }} onClick={() => onOpen(a)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: "#0f172a",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {a.client || "—"}
                          </div>
                          {a.clientCategory && <Av category={a.clientCategory} size={21} />}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: T.txtM,
                            marginTop: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {actLabel(a)}
                          {a.city ? " · " + a.city : ""}
                        </div>
                        {a.departmentContact && (
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 500,
                              color: "#0f172a",
                              marginTop: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {a.departmentContact}
                          </div>
                        )}
                        {a.department && (
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 500,
                              color: "#0f172a",
                              marginTop: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {a.department}
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontSize: 9,
                              fontWeight: 600,
                              color: T.txtX,
                              textTransform: "uppercase",
                              letterSpacing: ".06em",
                            }}
                          >
                            Valor
                          </div>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#0f172a",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {money(a.value)}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 3 }}>
                          {PREV_ST[a.status] && (
                            <button
                              onClick={() => onStatusChange(a.id, PREV_ST[a.status])}
                              title={"← " + PREV_ST[a.status]}
                              type="button"
                              style={{
                                background: "#f1f5f9",
                                border: "none",
                                borderRadius: 6,
                                width: 24,
                                height: 24,
                                cursor: "pointer",
                                fontSize: 13,
                                color: T.txtM,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                lineHeight: 1,
                              }}
                            >
                              ‹
                            </button>
                          )}
                          {NEXT_ST[a.status] && (
                            <button
                              onClick={() => handleAdvance(a.id, NEXT_ST[a.status])}
                              title={NEXT_ST[a.status]}
                              type="button"
                              style={{
                                background: (NEXT_BTN_CLR[a.status] || { bg: T.priL }).bg,
                                border: `1px solid ${(NEXT_BTN_CLR[a.status] || { border: T.priB }).border}`,
                                borderRadius: 6,
                                padding: "3px 8px",
                                height: 24,
                                cursor: "pointer",
                                fontSize: 10,
                                color: "#4b5563",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                gap: 3,
                              }}
                            >
                              {NEXT_LABEL[NEXT_ST[a.status]] || NEXT_ST[a.status]} ›
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {!pending.length && (
            <div style={{ textAlign: "center", padding: "32px", color: T.txtX, fontSize: 13 }}>
              Nenhuma atividade pendente.
            </div>
          )}
        </div>
      )}

      {dView === "kanban" && (
        <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 4 }}>
          {DASH_GROUPS.map(([st, label]) => {
            const gActs = sortByDate(pending.filter((a) => a.status === st));
            const { bg, dot } = ss(st, SS);
            return (
              <div key={st} style={{ width: 270, flexShrink: 0 }}>
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: T.radS,
                    background: bg,
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot, flexShrink: 0 }} />
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 12,
                      color: "#4b5563",
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      background: "rgba(255,255,255,.8)",
                      color: "#4b5563",
                      padding: "1px 8px",
                      borderRadius: 20,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {gActs.length}
                  </span>
                </div>
                {gActs.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => onOpen(a)}
                    style={{
                      ...CARD,
                      padding: "12px 14px",
                      marginBottom: 8,
                      cursor: "pointer",
                      transition: "box-shadow .15s, border-left-color .15s",
                      borderLeft: "4px solid #e2e8f0",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = T.shadowM;
                      e.currentTarget.style.borderLeftColor = "#94a3b8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = T.shadow;
                      e.currentTarget.style.borderLeftColor = "#e2e8f0";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#0f172a",
                          lineHeight: 1.2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {a.client || "—"}
                      </div>
                      {a.clientCategory && <Av category={a.clientCategory} size={23} />}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: T.txtM,
                        marginBottom: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {actLabel(a)}
                      {a.city ? " · " + a.city : ""}
                    </div>
                    {a.departmentContact && (
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#0f172a",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginBottom: 1,
                        }}
                      >
                        {a.departmentContact}
                      </div>
                    )}
                    {a.department && (
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#0f172a",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginBottom: 6,
                        }}
                      >
                        {a.department}
                      </div>
                    )}
                    {!a.department && !a.departmentContact && <div style={{ marginBottom: 6 }} />}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ fontSize: 12, color: T.txtX }}>{a.startDate}</span>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 600,
                            color: T.txtX,
                            textTransform: "uppercase",
                            letterSpacing: ".06em",
                          }}
                        >
                          Valor
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{money(a.value)}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                      {PREV_ST[a.status] && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(a.id, PREV_ST[a.status]);
                          }}
                          type="button"
                          style={{
                            background: "#f1f5f9",
                            border: "none",
                            borderRadius: 6,
                            padding: "4px 10px",
                            cursor: "pointer",
                            fontSize: 11,
                            color: T.txtM,
                          }}
                        >
                          ‹ Voltar
                        </button>
                      )}
                      {NEXT_ST[a.status] && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdvance(a.id, NEXT_ST[a.status]);
                          }}
                          type="button"
                          style={{
                            background: (NEXT_BTN_CLR[a.status] || { bg: T.priL }).bg,
                            border: `1px solid ${(NEXT_BTN_CLR[a.status] || { border: T.priB }).border}`,
                            borderRadius: 6,
                            padding: "4px 10px",
                            cursor: "pointer",
                            fontSize: 11,
                            color: "#4b5563",
                            fontWeight: 600,
                          }}
                        >
                          {NEXT_LABEL[NEXT_ST[a.status]] || NEXT_ST[a.status]} ›
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {!gActs.length && (
                  <div
                    style={{
                      padding: "18px 10px",
                      textAlign: "center",
                      fontSize: 12,
                      color: T.txtX,
                      background: T.bg,
                      borderRadius: T.radS,
                      border: `1px dashed ${T.border}`,
                    }}
                  >
                    Nenhuma
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
