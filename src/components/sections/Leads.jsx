import { useState } from "react";
import { Plus, Download, List, Columns } from "lucide-react";
import * as XLSX from "xlsx";
import { T, LEAD_ST } from "../../constants/theme";
import { SectionHeader, Btn } from "../ui";
import { CARD } from "../../styles/common";

const stStyle = (st) =>
  ({
    "Aguardando Proposta": { bg: "#fffbeb", dot: "#fcd34d" },
    "Proposta Enviada": { bg: "#f0fdf4", dot: "#86efac" },
    "Em contratação": { bg: "#eff6ff", dot: "#93c5fd" },
    Encerrada: { bg: "#f1f5f9", dot: "#9ca3af" },
  }[st] || { bg: "#f1f5f9", dot: "#9ca3af" });

export function Leads({ leads, onNew, onEdit, onExport }) {
  const [view, setView] = useState("kanban");

  const exportLeads = () => {
    const ws = XLSX.utils.json_to_sheet(
      leads.map((l) => ({
        Organização: l.organization,
        Contato: l.contactName,
        Canal: l.canal,
        Status: l.status,
        "Data Início": l.startDate,
        "Follow-up": l.followUp,
        Anotações: l.notes,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Conversas");
    XLSX.writeFile(wb, "conversas.xlsx");
  };

  return (
    <div>
      <SectionHeader
        title="Em Conversa"
        actions={[
          <div
            key="views"
            style={{
              display: "flex",
              gap: 2,
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: T.radS,
              padding: 3,
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
          </div>,
          <Btn key="exp" ghost onClick={exportLeads}>
            <Download size={14} /> Exportar
          </Btn>,
          <Btn key="new" onClick={onNew}>
            <Plus size={14} /> Nova Conversa
          </Btn>,
        ]}
      />

      {leads.length === 0 ? (
        <div style={{ ...CARD, padding: "60px 20px", textAlign: "center", color: T.txtX }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Nenhuma conversa em curso</div>
          <div style={{ fontSize: 13 }}>Registre conversas antes de enviar uma proposta</div>
        </div>
      ) : view === "list" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {leads.map((l) => {
            const stSt = stStyle(l.status);
            return (
              <div
                key={l.id}
                onClick={() => onEdit(l)}
                style={{
                  ...CARD,
                  padding: "16px 20px",
                  cursor: "pointer",
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  gap: 16,
                  alignItems: "start",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = T.shadowM)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = T.shadow)}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: T.txt }}>{l.organization}</div>
                  {l.contactName && <div style={{ fontSize: 12, color: T.txtM, marginTop: 2 }}>{l.contactName}</div>}
                  {l.notes && (
                    <div
                      style={{
                        fontSize: 12,
                        color: T.txtS,
                        marginTop: 6,
                        padding: "6px 10px",
                        background: T.bg,
                        borderRadius: T.radS,
                        borderLeft: "3px solid #e2e8f0",
                      }}
                    >
                      {l.notes}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  {l.startDate && <div style={{ fontSize: 11, color: T.txtX, marginTop: 4 }}>{l.startDate}</div>}
                </div>
                <div style={{ flexShrink: 0 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      background: stSt.bg,
                      color: "#4b5563",
                      boxShadow: "0 1px 3px rgba(0,0,0,.06)",
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: stSt.dot }} />
                    {l.status}
                  </span>
                  {l.followUp && <div style={{ fontSize: 11, color: T.txtX, marginTop: 4 }}>↩ {l.followUp}</div>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
          {LEAD_ST.map((st) => {
            const stCfg = stStyle(st);
            const col = leads.filter((l) => l.status === st);
            return (
              <div key={st} style={{ width: 260, flexShrink: 0 }}>
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: T.radS,
                    background: stCfg.bg,
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: stCfg.dot, flexShrink: 0 }} />
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 10,
                      color: "#4b5563",
                      flex: 1,
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {st}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      background: "rgba(255,255,255,.8)",
                      color: "#4b5563",
                      padding: "1px 7px",
                      borderRadius: 20,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {col.length}
                  </span>
                </div>
                {col.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => onEdit(l)}
                    style={{ ...CARD, padding: "10px 12px", marginBottom: 8, cursor: "pointer", transition: "box-shadow .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = T.shadowM)}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = T.shadow)}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: T.txt,
                        marginBottom: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {l.organization}
                    </div>
                    {l.contactName && (
                      <div
                        style={{
                          fontSize: 11,
                          color: T.txtM,
                          marginBottom: 4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {l.contactName}
                      </div>
                    )}
                    {l.notes && (
                      <div
                        style={{
                          fontSize: 11,
                          color: T.txtS,
                          padding: "5px 8px",
                          background: T.bg,
                          borderRadius: T.radS,
                          borderLeft: "2px solid #e2e8f0",
                          marginBottom: 4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {l.notes}
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                      {l.startDate && <span style={{ fontSize: 10, color: T.txtX }}>{l.startDate}</span>}
                      {l.followUp && <span style={{ fontSize: 10, color: T.txtM }}>↩ {l.followUp}</span>}
                    </div>
                  </div>
                ))}
                {!col.length && (
                  <div
                    style={{
                      padding: "16px 10px",
                      textAlign: "center",
                      fontSize: 11,
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
