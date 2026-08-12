import { useState } from "react";
import { Plus, List, Columns, Calendar, MapPin, Wallet } from "lucide-react";
import { T, ACT_ST, SS, FMT_PASTEL } from "../../constants/theme";
import { sortByDate } from "../../utils/date";
import { money } from "../../utils/money";
import { ss, tClr, actLabel } from "../../utils/helpers";
import { SectionHeader, Btn, Badge, Av, SkeletonRow } from "../ui";
import { TH, TD, CARD } from "../../styles/common";

const FILTERS = [
  ["all", "Todos"],
  ["Proposta Enviada", "Proposta"],
  ["Aguarda nota de empenho", "Aguarda Empenho"],
  ["Confirmado", "Confirmado"],
  ["Aguardando pagamento", "Aguarda Pgto"],
  ["Realizado", "Realizado"],
];

export function Activities({
  activities,
  loading,
  onNew,
  onOpen,
  onExpenses,
  statusFilter,
  onStatusFilterChange,
}) {
  const [view, setView] = useState("kanban");
  const fActs = sortByDate(
    activities.filter((a) => statusFilter === "all" || a.status === statusFilter)
  );

  return (
    <div>
      <SectionHeader
        title="Atividades"
        actions={[
          <Btn key="new" onClick={onNew}>
            <Plus size={14} /> Nova Atividade
          </Btn>,
        ]}
      />

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 18,
          alignItems: "center",
          overflowX: "auto",
          paddingBottom: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 2,
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: T.radS,
            padding: 3,
            flexShrink: 0,
          }}
        >
          {FILTERS.map(([v, l]) => (
            <button
              key={v}
              onClick={() => onStatusFilterChange(v)}
              type="button"
              style={{
                background: statusFilter === v ? T.pri : "transparent",
                color: statusFilter === v ? "#fff" : T.txtM,
                border: "none",
                padding: "6px 10px",
                borderRadius: T.radS,
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all .15s",
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: 2,
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: T.radS,
            padding: 3,
            marginLeft: "auto",
            flexShrink: 0,
          }}
        >
          {[
            ["list", <List size={13} />],
            ["kanban", <Columns size={13} />],
          ].map(([v, ic]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              type="button"
              style={{
                padding: "6px 8px",
                borderRadius: 6,
                border: "none",
                background: view === v ? T.pri : "transparent",
                color: view === v ? "#fff" : T.txtX,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {ic}
            </button>
          ))}
        </div>
      </div>

      {loading && view === "list" && (
        <div style={{ ...CARD, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
            <thead>
              <tr>
                {["Cliente / Modalidade", "Data", "Horário", "Local", "Formato", "Status", "Valor"].map((h) => (
                  <th key={h} style={TH}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{Array(6).fill(0).map((_, i) => <SkeletonRow key={i} />)}</tbody>
          </table>
        </div>
      )}

      {!loading && view === "list" && (
        <div style={{ ...CARD, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
            <thead>
              <tr>
                {["Cliente / Modalidade", "Data", "Horário", "Local", "Formato", "Status", "Valor"].map((h) => (
                  <th key={h} style={TH}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fActs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ ...TD, textAlign: "center", padding: "48px", color: T.txtX }}>
                    Nenhuma atividade encontrada.
                  </td>
                </tr>
              ) : (
                fActs.map((a) => {
                  const loc = [a.city, a.state].filter(Boolean).join(" - ") || "—";
                  const fmtStyle = FMT_PASTEL[a.format] || { bg: "#f1f5f9", cl: T.txtS };
                  return (
                    <tr
                      key={a.id}
                      onClick={() => onOpen(a)}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = T.bg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                    >
                      <td style={{ ...TD, paddingLeft: 20, maxWidth: 220 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 14,
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
                            fontSize: 11,
                            color: T.txtM,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginTop: 1,
                          }}
                        >
                          {actLabel(a)}
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
                              marginTop: 1,
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
                              marginTop: 1,
                            }}
                          >
                            {a.department}
                          </div>
                        )}
                      </td>
                      <td style={{ ...TD, whiteSpace: "nowrap", fontSize: 12 }}>
                        {a.startDate}
                        {a.endDate && a.endDate !== a.startDate ? (
                          <span style={{ color: T.txtX }}> → {a.endDate}</span>
                        ) : null}
                      </td>
                      <td style={{ ...TD, whiteSpace: "nowrap", fontSize: 12, color: T.txtM }}>
                        {a.startTime} – {a.endTime}
                      </td>
                      <td style={{ ...TD, fontSize: 12, color: T.txtM, whiteSpace: "nowrap" }}>{loc}</td>
                      <td style={TD}>
                        <span
                          style={{
                            padding: "2px 9px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 500,
                            background: fmtStyle.bg,
                            color: fmtStyle.cl,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {a.format}
                        </span>
                      </td>
                      <td style={TD}>
                        <Badge s={a.status} />
                      </td>
                      <td style={{ ...TD, whiteSpace: "nowrap" }}>
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 600,
                            color: T.txtX,
                            textTransform: "uppercase",
                            letterSpacing: ".06em",
                            marginBottom: 1,
                          }}
                        >
                          Valor
                        </div>
                        <div style={{ fontWeight: 600, fontSize: 12, color: "#0f172a" }}>{money(a.value)}</div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && view === "kanban" && (
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
          {ACT_ST.filter((st) => statusFilter === "all" || st === statusFilter).map((st) => {
            const { bg } = ss(st, SS);
            const colActs = fActs.filter((a) => a.status === st);
            return (
              <div key={st} style={{ width: 260, flexShrink: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                    padding: "8px 14px",
                    borderRadius: T.radS,
                    background: bg,
                    boxShadow: "0 2px 8px rgba(0,0,0,.07)",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 10,
                      color: "#4b5563",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textTransform: "uppercase",
                      letterSpacing: ".07em",
                      flex: 1,
                    }}
                  >
                    {st}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      background: "rgba(255,255,255,.85)",
                      color: "#4b5563",
                      padding: "2px 8px",
                      borderRadius: 20,
                      fontWeight: 700,
                      flexShrink: 0,
                      minWidth: 20,
                      textAlign: "center",
                    }}
                  >
                    {colActs.length}
                  </span>
                </div>
                {colActs.map((a) => {
                  const expTotal = (a.expenses || []).reduce(
                    (s, e) => s + (parseFloat(e.valor) || 0),
                    0
                  );
                  return (
                    <div
                      key={a.id}
                      onClick={() => onOpen(a)}
                      style={{
                        background: T.surface,
                        borderRadius: T.rad,
                        border: `1px solid ${T.border}`,
                        borderLeft: "4px solid #cbd5e1",
                        boxShadow: "0 2px 8px rgba(0,0,0,.06)",
                        padding: 0,
                        marginBottom: 10,
                        cursor: "pointer",
                        transition: "box-shadow .15s",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = T.shadowM)}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = T.shadow)}
                    >
                      <div style={{ padding: "10px 12px 0 12px", marginBottom: 4 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div
                              style={{
                                fontWeight: 700,
                                fontSize: 15,
                                color: "#0f172a",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {a.client || "—"}
                            </div>
                            {a.clientCategory && <Av category={a.clientCategory} size={23} />}
                          </div>
                          {(a.types && a.types.length > 0 ? a.types : [a.type])
                            .filter(Boolean)
                            .map((t, ti) => (
                              <div
                                key={ti}
                                style={{
                                  fontSize: 13,
                                  fontWeight: 500,
                                  color: T.txtM,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  marginTop: 1,
                                }}
                              >
                                {t}
                              </div>
                            ))}
                          {a.departmentContact && (
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 500,
                                color: "#0f172a",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                marginTop: 2,
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
                                marginTop: 2,
                              }}
                            >
                              {a.department}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ padding: "0 12px 10px 12px" }}>
                        <div style={{ fontSize: 12, color: T.txtS, marginBottom: 4 }}>
                          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                            <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                              <Calendar size={11} style={{ color: T.txtX }} />
                              {a.startDate}
                            </span>
                          </div>
                          {a.city && (
                            <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 4 }}>
                              <MapPin size={11} style={{ color: T.txtX }} />
                              {a.city}
                              {a.state && " - " + a.state}
                            </div>
                          )}
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              padding: "2px 8px",
                              borderRadius: 20,
                              fontSize: 10,
                              fontWeight: 600,
                              background: FMT_PASTEL[a.format]?.background || "#f1f5f9",
                              color: T.txtS,
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            {a.format}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            marginBottom: 4,
                          }}
                        >
                          <div style={{ textAlign: "right" }}>
                            <div
                              style={{
                                fontSize: 9,
                                fontWeight: 600,
                                color: T.txtX,
                                textTransform: "uppercase",
                                letterSpacing: ".06em",
                                marginBottom: 1,
                              }}
                            >
                              Valor
                            </div>
                            <div style={{ fontWeight: 400, fontSize: 12, color: "#0f172a" }}>
                              {money(a.value)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
