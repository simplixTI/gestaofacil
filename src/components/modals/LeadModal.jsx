import { CheckCircle2 } from "lucide-react";
import { T, LEAD_ST, HIST_CLR } from "../../constants/theme";
import { BLANK_LEAD } from "../../constants/blanks";
import { todayBR } from "../../utils/date";
import { OLay, MH, Btn, FI, FS } from "../ui";
import { G2 } from "../../styles/common";

export function LeadModal({
  lead,
  onClose,
  onChange,
  onSave,
  onSaveAndConvert,
  onDelete,
}) {
  if (!lead) return null;
  const lModal = lead;

  const history = lModal.statusHistory || [];
  const allSt = LEAD_ST;
  const currentIdx = allSt.indexOf(lModal.status);

  return (
    <OLay show={!!lModal} onClose={onClose} wide>
      <MH title={lModal.id ? "Editar Conversa" : "Nova Conversa"} onClose={onClose} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={G2}>
          <FI
            label="Organização *"
            value={lModal.organization}
            onChange={(e) => onChange({ ...lModal, organization: e.target.value })}
            ph="Nome da empresa"
          />
          <FI
            label="Nome do Contato"
            value={lModal.contactName}
            onChange={(e) => onChange({ ...lModal, contactName: e.target.value })}
            ph="Nome da pessoa"
          />
        </div>
        <FI
          label="Departamento"
          value={lModal.department || ""}
          onChange={(e) => onChange({ ...lModal, department: e.target.value })}
          ph="Ex: RH, Treinamento, Gestão de Pessoas..."
        />
        <FS
          label="Status"
          value={lModal.status}
          onChange={(e) => onChange({ ...lModal, status: e.target.value })}
          opts={allSt}
        />
        <div style={G2}>
          <FI
            label="Data de Início"
            value={lModal.startDate}
            onChange={(e) => onChange({ ...lModal, startDate: e.target.value })}
            type="date"
          />
          <FI
            label="Follow-up previsto"
            value={lModal.followUp}
            onChange={(e) => onChange({ ...lModal, followUp: e.target.value })}
            type="date"
          />
        </div>
        <FI
          label="Anotações da conversa"
          value={lModal.notes}
          onChange={(e) => onChange({ ...lModal, notes: e.target.value })}
          ph="Resumo da conversa, interesse demonstrado, próximos passos..."
          ml
        />
      </div>

      <div
        style={{
          marginTop: 16,
          background: T.bg,
          borderRadius: T.radS,
          padding: "14px 16px",
          border: `1px solid ${T.borderS}`,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: T.txtX,
            textTransform: "uppercase",
            letterSpacing: ".08em",
            marginBottom: 12,
          }}
        >
          📋 Histórico de Status
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {allSt.map((st, idx) => {
            const clr = HIST_CLR[st] || { bg: "#f1f5f9", dot: "#94a3b8", border: "#e2e8f0" };
            const entry = history.find((h) => h.status === st);
            const isCurrent = lModal.status === st;
            const isFuture = idx > currentIdx && !entry;
            return (
              <div key={st} style={{ display: "flex", alignItems: "stretch", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 20,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: isFuture ? "#e2e8f0" : clr.dot,
                      border: `2px solid ${isFuture ? "#cbd5e1" : clr.border}`,
                      flexShrink: 0,
                      marginTop: 2,
                      boxShadow: isCurrent ? "0 0 0 3px " + clr.bg : "none",
                    }}
                  />
                  {idx < allSt.length - 1 && (
                    <div
                      style={{
                        width: 2,
                        flex: 1,
                        background: isFuture ? "#e2e8f0" : clr.dot,
                        minHeight: 18,
                        marginTop: 2,
                        marginBottom: 2,
                        opacity: 0.5,
                      }}
                    />
                  )}
                </div>
                <div style={{ paddingBottom: idx < allSt.length - 1 ? 12 : 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: isCurrent ? 700 : 500,
                        color: isFuture ? T.txtX : T.txt,
                      }}
                    >
                      {st}
                    </span>
                    {isCurrent && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          background: clr.bg,
                          color: "#4b5563",
                          padding: "1px 7px",
                          borderRadius: 20,
                          border: `1px solid ${clr.border}`,
                        }}
                      >
                        atual
                      </span>
                    )}
                  </div>
                  {entry ? (
                    <div style={{ fontSize: 11, color: T.txtM, marginTop: 2 }}>📅 {entry.date}</div>
                  ) : isFuture ? (
                    <div style={{ fontSize: 11, color: T.txtX, marginTop: 2 }}>—</div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {lModal.status === "Proposta Enviada" && (
        <div
          style={{
            marginTop: 16,
            background: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: T.radS,
            padding: "12px 14px",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <CheckCircle2 size={16} style={{ color: "#16a34a", flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 2 }}>
              Proposta Enviada → Iniciar fluxo de contratação
            </div>
            <div style={{ fontSize: 11, color: "#15803d" }}>
              Ao confirmar, esta conversa será registrada em <b>Atividades</b> com status "Proposta Enviada" para seguir o fluxo de contratação.
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 22,
          justifyContent: "space-between",
          paddingTop: 16,
          borderTop: `1px solid ${T.borderS}`,
        }}
      >
        <div>{lModal.id && <Btn danger onClick={() => onDelete(lModal.id)}>Excluir</Btn>}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn ghost onClick={onClose}>
            Cancelar
          </Btn>
          {lModal.status === "Proposta Enviada" ? (
            <Btn onClick={onSaveAndConvert}>
              <CheckCircle2 size={13} /> Registrar Proposta em Atividades
            </Btn>
          ) : (
            <Btn onClick={onSave}>{lModal.id ? "Salvar" : "Registrar"}</Btn>
          )}
        </div>
      </div>
    </OLay>
  );
}
