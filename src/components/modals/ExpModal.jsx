import { useState, useEffect } from "react";
import { Plus, X, CheckCircle2 } from "lucide-react";
import { T, EXP_TIPOS, TIPO_CLR, TIPO_BG } from "../../constants/theme";
import { EXP_F } from "../../constants/blanks";
import { money } from "../../utils/money";
import { actLabel, uniqueId } from "../../utils/helpers";
import { OLay, MH, Btn, FI, FS } from "../ui";
import { CARD, G3, TH, TD } from "../../styles/common";

export function ExpModal({ show, activity, onClose, onSave }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...EXP_F });

  useEffect(() => {
    if (show && activity) setItems(activity.expenses || []);
  }, [show, activity]);

  const addItem = () => {
    if (!form.descricao || !form.valor) return;
    setItems((p) => [...p, { ...form, id: uniqueId(), valor: parseFloat(form.valor) }]);
    setForm({ ...EXP_F });
  };

  const removeItem = (id) => setItems((p) => p.filter((it) => it.id !== id));
  const total = items.reduce((s, e) => s + (parseFloat(e.valor) || 0), 0);

  return (
    <OLay show={show} onClose={onClose} wide>
      {activity && (
        <>
          <MH title={`Despesas — ${actLabel(activity)}`} onClose={onClose} />
          <div
            style={{
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: T.rad,
              padding: 14,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.txtS,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                marginBottom: 10,
              }}
            >
              Adicionar Despesa
            </div>
            <div style={{ ...G3, marginBottom: 10 }}>
              <FS
                label="Tipo"
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                opts={EXP_TIPOS}
              />
              <FI
                label="Descrição"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                ph="Ex: Hotel 1 noite"
              />
              <FI
                label="Valor (R$)"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
                type="number"
                ph="0,00"
              />
            </div>
            <Btn onClick={addItem}>
              <Plus size={13} /> Adicionar
            </Btn>
          </div>

          {items.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px",
                color: T.txtX,
                fontSize: 13,
                background: T.bg,
                borderRadius: T.rad,
                border: `1px dashed ${T.border}`,
                marginBottom: 14,
              }}
            >
              Nenhuma despesa cadastrada.
            </div>
          ) : (
            <div style={{ ...CARD, overflow: "hidden", marginBottom: 14 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ ...TH, paddingLeft: 20 }}>Tipo</th>
                    <th style={TH}>Descrição</th>
                    <th style={{ ...TH, textAlign: "right" }}>Valor</th>
                    <th style={{ ...TH, width: 40 }} />
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td style={{ ...TD, paddingLeft: 20 }}>
                        <span
                          style={{
                            padding: "2px 9px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 600,
                            background: TIPO_BG[it.tipo] || "#f1f5f9",
                            color: TIPO_CLR[it.tipo] || T.txtS,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {it.tipo}
                        </span>
                      </td>
                      <td style={{ ...TD, fontWeight: 500, color: T.txt }}>{it.descricao}</td>
                      <td
                        style={{
                          ...TD,
                          textAlign: "right",
                          fontWeight: 700,
                          color: "#dc2626",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {money(it.valor)}
                      </td>
                      <td style={{ ...TD, textAlign: "center", paddingRight: 12 }}>
                        <button
                          onClick={() => removeItem(it.id)}
                          type="button"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: T.txtX,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <X size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "12px 20px",
                  borderTop: `1px solid ${T.borderS}`,
                  background: "#fafafa",
                  borderRadius: `0 0 ${T.rad} ${T.rad}`,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: T.txt }}>
                  Total: <span style={{ color: "#dc2626", marginLeft: 6 }}>{money(total)}</span>
                </span>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn ghost onClick={onClose}>
              Cancelar
            </Btn>
            <Btn
              onClick={() => {
                onSave(activity.id, items);
                onClose();
              }}
            >
              <CheckCircle2 size={13} /> Salvar Despesas
            </Btn>
          </div>
        </>
      )}
    </OLay>
  );
}
