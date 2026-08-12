import { useEffect } from "react";
import { T, MODALITIES, ACT_ST, SS } from "../../constants/theme";
import { ss } from "../../utils/helpers";
import { BLANK_A } from "../../constants/blanks";
import { OLay, MH, Btn, FI, FS, TimeSel } from "../ui";
import { G2, G3, INPUT_ST, LABEL_ST } from "../../styles/common";

const SINGLE_DAY_MODALITIES = [
  "Palestra",
  "Curso Básico 2h",
  "Curso Básico 3h",
  "Diagnóstico Padrão de Clareza",
  "Simplificação de Documentos",
];

function getDefaultSched() {
  return {
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    format: "Online",
    value: "",
    participants: "",
    dates: [
      { date: "", startTime: "", endTime: "" },
      { date: "", startTime: "", endTime: "" },
      { date: "", startTime: "", endTime: "" },
    ],
  };
}

export function ActivityModal({
  activity,
  contacts,
  onClose,
  onChange,
  onSave,
  onDelete,
}) {
  if (!activity) return null;
  const aModal = activity;

  useEffect(() => {
    const matched = contacts.find((c) => c.name === aModal.client);
    if (matched && matched.category && aModal.clientCategory !== matched.category) {
      onChange({ ...aModal, clientCategory: matched.category });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aModal.client, contacts]);

  const set = (f) => onChange({ ...aModal, ...f });

  const schedFor = (m) => (aModal.typeSchedules || {})[m] || getDefaultSched();
  const updateSched = (m, f) => {
    const cur = schedFor(m);
    set({
      typeSchedules: { ...(aModal.typeSchedules || {}), [m]: { ...cur, ...f } },
    });
  };

  const updateDate = (m, i, f) => {
    const sched = schedFor(m);
    const ds = [...(sched.dates || [])];
    while (ds.length <= i) ds.push({ date: "", startTime: "", endTime: "" });
    ds[i] = { ...ds[i], ...f };
    updateSched(m, { dates: ds });
  };

  const ct = contacts.find((c) => c.name === aModal.client);
  const depts = ct?.departments || [];
  const selDept = depts.find((d) => d.name === aModal.department);
  const hasDepts = depts.length > 0;

  const clientCat = ct?.category || "";
  const isPrivado = clientCat === "Privado";
  const visibleSt = ACT_ST.filter((st) => !(st === "Aguarda nota de empenho" && isPrivado));

  return (
    <OLay show={!!aModal} onClose={onClose} wide>
      <MH title={aModal.id ? "Editar Atividade" : "Nova Atividade"} onClose={onClose} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={LABEL_ST}>
            Modalidade *{" "}
            <span style={{ fontSize: 10, color: T.txtX, fontWeight: 400 }}>(múltipla seleção)</span>
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              background: "#f8fafc",
              border: `1.5px solid ${T.border}`,
              borderRadius: T.radS,
              padding: "10px 13px",
            }}
          >
            {MODALITIES.map((m) => {
              const checked = (aModal.types || []).includes(m);
              const sched = schedFor(m);
              const isC20 = m === "Curso Avançado Online 10h";
              const isPCS = m === "Prática Coletiva Supervisionada";
              const isC20Pres = isC20 && sched.format === "Presencial";
              const isPCSOnline = isPCS && sched.format === "Online";
              const isSingleDay = SINGLE_DAY_MODALITIES.includes(m) || (isPCS && !isPCSOnline);

              const inpSt = {
                border: `1.5px solid ${T.border}`,
                borderRadius: 6,
                padding: "7px 9px",
                fontSize: 12,
                color: T.txt,
                background: "#fff",
                outline: "none",
                width: "100%",
                fontFamily: "'Inter',system-ui,sans-serif",
              };

              return (
                <div key={m} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        fontSize: 13,
                        color: T.txt,
                        userSelect: "none",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const cur = aModal.types || [];
                          const willCheck = !checked;
                          const newTypeSchedules = willCheck
                            ? { ...(aModal.typeSchedules || {}), [m]: getDefaultSched() }
                            : { ...(aModal.typeSchedules || {}) };
                          if (!willCheck) delete newTypeSchedules[m];
                          set({
                            types: checked ? cur.filter((x) => x !== m) : [...cur, m],
                            typeSchedules: newTypeSchedules,
                          });
                        }}
                        style={{ width: 14, height: 14, accentColor: T.pri, cursor: "pointer" }}
                      />
                      {m}
                    </label>
                    {checked && (
                      <div
                        style={{
                          display: "flex",
                          gap: 0,
                          background: "#f1f5f9",
                          borderRadius: 6,
                          overflow: "hidden",
                          border: `1px solid ${T.border}`,
                        }}
                      >
                        {["Online", "Presencial"].map((f) => (
                          <button
                            key={f}
                            onClick={() => updateSched(m, { format: f })}
                            type="button"
                            style={{
                              padding: "3px 10px",
                              fontSize: 11,
                              fontWeight: 600,
                              border: "none",
                              cursor: "pointer",
                              background: sched.format === f ? T.pri : "transparent",
                              color: sched.format === f ? "#fff" : T.txtM,
                              transition: "all .15s",
                            }}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {checked && !isC20Pres && !isPCSOnline && (
                    <div
                      style={{
                        paddingLeft: 22,
                        display: "grid",
                        gridTemplateColumns: isSingleDay ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr",
                        gap: 8,
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 10, fontWeight: 500, color: T.txtS }}>
                          {isC20 ? "Data início" : "Data"}
                        </span>
                        <input
                          type="date"
                          value={sched.startDate}
                          onChange={(e) => updateSched(m, { startDate: e.target.value })}
                          style={inpSt}
                        />
                      </div>
                      {!isSingleDay && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <span style={{ fontSize: 10, fontWeight: 500, color: T.txtS }}>Data fim</span>
                          <input
                            type="date"
                            value={sched.endDate}
                            onChange={(e) => updateSched(m, { endDate: e.target.value })}
                            style={inpSt}
                          />
                        </div>
                      )}
                      <TimeSel
                        label="Hora início"
                        value={sched.startTime || ""}
                        onChange={(v) => updateSched(m, { startTime: v })}
                      />
                      <TimeSel
                        label="Hora fim"
                        value={sched.endTime || ""}
                        onChange={(v) => updateSched(m, { endTime: v })}
                      />
                    </div>
                  )}

                  {checked && (isC20Pres || isPCSOnline) && (
                    <div style={{ paddingLeft: 22, display: "flex", flexDirection: "column", gap: 6 }}>
                      {Array.from({ length: isC20Pres ? 3 : 2 }, (_, i) => {
                        const d = (sched.dates || [])[i] || { date: "", startTime: "", endTime: "" };
                        return (
                          <div
                            key={i}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr 1fr",
                              gap: 8,
                              background: "#f8fafc",
                              borderRadius: 6,
                              padding: "8px 10px",
                              border: `1px solid ${T.borderS}`,
                            }}
                          >
                            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                              <span style={{ fontSize: 10, fontWeight: 500, color: T.txtS }}>
                                Data {i + 1}
                              </span>
                              <input
                                type="date"
                                value={d.date}
                                onChange={(e) => updateDate(m, i, { date: e.target.value })}
                                style={inpSt}
                              />
                            </div>
                            <TimeSel
                              label="Hora início"
                              value={d.startTime || ""}
                              onChange={(v) => updateDate(m, i, { startTime: v })}
                            />
                            <TimeSel
                              label="Hora fim"
                              value={d.endTime || ""}
                              onChange={(v) => updateDate(m, i, { endTime: v })}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {checked && (
                    <div
                      style={{
                        paddingLeft: 22,
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                        marginTop: 2,
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 10, fontWeight: 500, color: T.txtS }}>Valor (R$)</span>
                        <input
                          type="text"
                          value={sched.value || ""}
                          onChange={(e) => updateSched(m, { value: e.target.value.replace(",", ".") })}
                          placeholder="Ex: 8000"
                          style={inpSt}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 10, fontWeight: 500, color: T.txtS }}>
                          Nº de Participantes
                        </span>
                        <input
                          type="text"
                          value={sched.participants || ""}
                          onChange={(e) => updateSched(m, { participants: e.target.value })}
                          placeholder="Ex: 30"
                          style={inpSt}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={G3}>
          <FI
            label="Cliente"
            value={aModal.client}
            onChange={(e) => set({ client: e.target.value })}
            ph="Nome do cliente"
          />
          <FS
            label="Setor do Cliente"
            value={aModal.clientCategory || ""}
            onChange={(e) => set({ clientCategory: e.target.value })}
            opts={["", "Público", "Privado", "Outros"]}
          />
          <FS
            label="Formato"
            value={aModal.format}
            onChange={(e) => set({ format: e.target.value })}
            opts={["Presencial", "Online", "EAD", "Híbrido"]}
          />
        </div>

        <div
          style={{
            background: "#f0f5ff",
            border: "1px solid #c7d2fe",
            borderRadius: T.radS,
            padding: "12px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#3730a3",
              marginBottom: 2,
              letterSpacing: ".04em",
              textTransform: "uppercase",
            }}
          >
            🏢 Departamento Contratante
          </div>
          <div style={G2}>
            <FI
              label="Contato"
              value={aModal.departmentContact || ""}
              onChange={(e) => set({ departmentContact: e.target.value })}
              ph="Nome da pessoa"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={LABEL_ST}>
                Departamento
                {hasDepts && (
                  <span style={{ fontSize: 10, color: T.txtX, fontWeight: 400, marginLeft: 6 }}>
                    (ou selecione da lista)
                  </span>
                )}
              </label>
              <input
                list="dept-dl"
                value={aModal.department || ""}
                onChange={(e) => {
                  const d = depts.find((d) => d.name === e.target.value);
                  set({
                    department: e.target.value,
                    departmentContact: d?.contactName || aModal.departmentContact || "",
                  });
                }}
                placeholder="Ex: RH, Jurídico, Gestão de Pessoas..."
                style={{ ...INPUT_ST, background: "#fff" }}
                onFocus={(e) => (e.target.style.borderColor = T.pri)}
                onBlur={(e) => (e.target.style.borderColor = T.border)}
              />
              {hasDepts && (
                <datalist id="dept-dl">
                  {depts.map((d) => (
                    <option key={d.id} value={d.name} />
                  ))}
                </datalist>
              )}
            </div>
          </div>
          {selDept && (selDept.email || selDept.phone || selDept.whatsapp) && (
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                paddingTop: 6,
                borderTop: `1px solid #c7d2fe`,
              }}
            >
              {selDept.email && <span style={{ fontSize: 11, color: "#4338ca" }}>✉️ {selDept.email}</span>}
              {selDept.phone && <span style={{ fontSize: 11, color: "#4338ca" }}>📞 {selDept.phone}</span>}
              {selDept.whatsapp && (
                <span style={{ fontSize: 11, color: "#4338ca" }}>💬 {selDept.whatsapp}</span>
              )}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
          <FI label="Cidade" value={aModal.city} onChange={(e) => set({ city: e.target.value })} ph="Cidade" />
          <FI
            label="UF"
            value={aModal.state}
            onChange={(e) => set({ state: e.target.value })}
            ph="UF"
            max={2}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={LABEL_ST}>
            Status
            {isPrivado && (
              <span style={{ fontSize: 10, color: T.txtX, marginLeft: 8, fontWeight: 400 }}>
                — Nota de empenho não disponível (setor privado)
              </span>
            )}
          </label>
          <div
            style={{
              display: "flex",
              gap: 0,
              background: T.bg,
              borderRadius: T.radS,
              border: `1px solid ${T.border}`,
              overflow: "hidden",
            }}
          >
            {visibleSt.map((st, i) => {
              const on = aModal.status === st;
              const { bg } = ss(st, SS);
              return (
                <button
                  key={st}
                  onClick={() => set({ status: st })}
                  type="button"
                  style={{
                    flex: 1,
                    padding: "8px 4px",
                    border: "none",
                    borderRight: i < visibleSt.length - 1 ? `1px solid ${T.border}` : "none",
                    background: on ? bg : "transparent",
                    color: on ? "#4b5563" : T.txtX,
                    cursor: "pointer",
                    fontSize: 10,
                    fontWeight: on ? 700 : 400,
                    lineHeight: 1.3,
                    textAlign: "center",
                    transition: "all .15s",
                  }}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        <FI
          label="Observações"
          value={aModal.notes || ""}
          onChange={(e) => set({ notes: e.target.value })}
          ph="Ex: Curso para 30 pessoas..."
          ml
        />
      </div>

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
        <div>{aModal.id && <Btn danger onClick={() => onDelete(aModal.id)}>Excluir</Btn>}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn ghost onClick={onClose}>
            Cancelar
          </Btn>
          <Btn onClick={onSave}>{aModal.id ? "Salvar Alterações" : "Salvar Atividade"}</Btn>
        </div>
      </div>
    </OLay>
  );
}
