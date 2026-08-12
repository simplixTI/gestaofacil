import { useState } from "react";
import { X, Plus } from "lucide-react";
import { T } from "../../constants/theme";
import { uniqueId } from "../../utils/helpers";
import { OLay, MH, Btn, FI, FS } from "../ui";
import { G2 } from "../../styles/common";

export function ContactModal({ show, contact, onClose, onChange, onSave, onDelete }) {
  const [ctTab, setCtTab] = useState("geral");
  if (!show || !contact) return null;

  const ct = contact;
  const set = (f) => onChange({ ...ct, ...f });
  const depts = ct.departments || [];

  const addDept = () =>
    onChange({
      ...ct,
      departments: [...depts, { id: uniqueId(), name: "", contactName: "", email: "", phone: "", whatsapp: "" }],
    });

  const updDept = (id, f) =>
    onChange({
      ...ct,
      departments: depts.map((d) => (d.id === id ? { ...d, ...f } : d)),
    });

  const remDept = (id) => onChange({ ...ct, departments: depts.filter((d) => d.id !== id) });

  const tabSt = {
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    padding: "7px 14px",
    borderRadius: T.radS,
    border: "none",
    transition: "all .15s",
  };

  return (
    <OLay show={show} onClose={onClose} wide>
      <MH title={ct.id ? "Editar Contato" : "Novo Contato"} onClose={onClose} />

      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 18,
          background: T.bg,
          padding: 4,
          borderRadius: T.radS,
        }}
      >
        {[
          ["geral", "Geral"],
          ["depts", "Departamentos"],
          ["pag", "Resp. Pagamento"],
        ].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setCtTab(v)}
            type="button"
            style={{
              ...tabSt,
              background: ctTab === v ? T.surface : "transparent",
              color: ctTab === v ? T.txt : T.txtM,
              boxShadow: ctTab === v ? T.shadow : "none",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {ctTab === "geral" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <FI
            label="Nome da Organização *"
            value={ct.name}
            onChange={(e) => set({ name: e.target.value })}
            ph="Nome da empresa, órgão ou organização"
          />
          <div style={G2}>
            <FI
              label="Nome do Responsável"
              value={ct.contactName}
              onChange={(e) => set({ contactName: e.target.value })}
              ph="Nome do contato principal"
            />
            <FS
              label="Setor"
              value={ct.category}
              onChange={(e) => set({ category: e.target.value })}
              opts={["Público", "Privado", "Outros"]}
            />
          </div>
          <FI
            label="Departamento"
            value={ct.mainDepartment || ""}
            onChange={(e) => set({ mainDepartment: e.target.value })}
            ph="Ex: RH, Treinamentos, Jurídico..."
          />
          <FI
            label="E-mail"
            value={ct.email}
            onChange={(e) => set({ email: e.target.value })}
            type="email"
            ph="email@empresa.com.br"
          />
          <div style={G2}>
            <FI
              label="Telefone"
              value={ct.phone}
              onChange={(e) => set({ phone: e.target.value })}
              ph="(00) 00000-0000"
            />
            <FI
              label="WhatsApp"
              value={ct.whatsapp}
              onChange={(e) => set({ whatsapp: e.target.value })}
              ph="(00) 00000-0000"
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
            <FI label="Cidade" value={ct.city} onChange={(e) => set({ city: e.target.value })} ph="Cidade" />
            <FI
              label="UF"
              value={ct.state}
              onChange={(e) => set({ state: e.target.value })}
              ph="UF"
              max={2}
            />
          </div>
          <FI
            label="Endereço"
            value={ct.address || ""}
            onChange={(e) => set({ address: e.target.value })}
            ph="Rua, número, bairro, CEP"
          />
          <div style={{ display: "flex", gap: 20 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={!!ct.alreadyBought}
                onChange={(e) => set({ alreadyBought: e.target.checked })}
                style={{ width: 15, height: 15, accentColor: T.pri, cursor: "pointer" }}
              />
              <span style={{ fontSize: 13, color: T.txt, fontWeight: 500 }}>Já comprou</span>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input
                type="checkbox"
                checked={!!ct.quotedNotBought}
                onChange={(e) => set({ quotedNotBought: e.target.checked })}
                style={{ width: 15, height: 15, accentColor: T.pri, cursor: "pointer" }}
              />
              <span style={{ fontSize: 13, color: T.txt, fontWeight: 500 }}>Orçou e não comprou</span>
            </label>
          </div>
          <FI
            label="Observações"
            value={ct.notes}
            onChange={(e) => set({ notes: e.target.value })}
            ph="Ex: Interesse em cursos e palestras..."
            ml
          />
        </div>
      )}

      {ctTab === "depts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              fontSize: 12,
              color: T.txtM,
              background: T.priL,
              padding: "8px 12px",
              borderRadius: T.radS,
            }}
          >
            Adicione um contato por departamento.
          </div>
          {depts.map((d, i) => (
            <div
              key={d.id}
              style={{
                background: T.bg,
                border: `1px solid ${T.border}`,
                borderRadius: T.rad,
                padding: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: T.txt }}>Contratante {i + 1}</span>
                <button
                  onClick={() => remDept(d.id)}
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#ef4444",
                    fontSize: 11,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <X size={13} /> Remover
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={G2}>
                  <FI
                    label="Departamento"
                    value={d.name}
                    onChange={(e) => updDept(d.id, { name: e.target.value })}
                    ph="Ex: RH, Treinamento, TI"
                  />
                  <FI
                    label="Nome do Contratante"
                    value={d.contactName}
                    onChange={(e) => updDept(d.id, { contactName: e.target.value })}
                    ph="Nome de quem compra"
                  />
                </div>
                <div style={G2}>
                  <FI
                    label="E-mail"
                    value={d.email}
                    onChange={(e) => updDept(d.id, { email: e.target.value })}
                    ph="email@empresa.com.br"
                  />
                  <FI
                    label="WhatsApp"
                    value={d.whatsapp || ""}
                    onChange={(e) => updDept(d.id, { whatsapp: e.target.value })}
                    ph="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>
          ))}
          <Btn ghost onClick={addDept}>
            <Plus size={13} /> Adicionar Contratante/Departamento
          </Btn>
        </div>
      )}

      {ctTab === "pag" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              fontSize: 12,
              color: T.txtM,
              background: T.priL,
              padding: "8px 12px",
              borderRadius: T.radS,
            }}
          >
            Dados de quem cuida do pagamento — pode ser diferente do contratante do curso.
          </div>
          <div
            style={{
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: T.rad,
              padding: 14,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.txtS,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                marginBottom: 12,
              }}
            >
              🏢 Dados da Empresa
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <FI
                label="Razão Social"
                value={ct.pagRazaoSocial || ""}
                onChange={(e) => set({ pagRazaoSocial: e.target.value })}
                ph="Razão Social completa"
              />
              <div style={G2}>
                <FI
                  label="CNPJ"
                  value={ct.pagCNPJ || ""}
                  onChange={(e) => set({ pagCNPJ: e.target.value })}
                  ph="00.000.000/0001-00"
                />
                <div style={G2}>
                  <FI
                    label="Insc. Municipal"
                    value={ct.pagInscMunicipal || ""}
                    onChange={(e) => set({ pagInscMunicipal: e.target.value })}
                    ph="Nº"
                  />
                  <FI
                    label="Insc. Estadual"
                    value={ct.pagInscEstadual || ""}
                    onChange={(e) => set({ pagInscEstadual: e.target.value })}
                    ph="Nº"
                  />
                </div>
              </div>
              <FI
                label="Endereço completo"
                value={ct.pagEndereco || ""}
                onChange={(e) => set({ pagEndereco: e.target.value })}
                ph="Rua, número, bairro, cidade, UF, CEP"
                ml
              />
            </div>
          </div>
          <div
            style={{
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: T.rad,
              padding: 14,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.txtS,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                marginBottom: 12,
              }}
            >
              👤 Responsável pelo Pagamento
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <FI
                label="Nome do Responsável"
                value={ct.pagName || ""}
                onChange={(e) => set({ pagName: e.target.value })}
                ph="Nome completo"
              />
              <FI
                label="E-mail"
                value={ct.pagEmail || ""}
                onChange={(e) => set({ pagEmail: e.target.value })}
                type="email"
                ph="email@empresa.com.br"
              />
              <div style={G2}>
                <FI
                  label="WhatsApp"
                  value={ct.pagWhatsapp || ""}
                  onChange={(e) => set({ pagWhatsapp: e.target.value })}
                  ph="(00) 00000-0000"
                />
                <FI
                  label="Telefone"
                  value={ct.pagPhone || ""}
                  onChange={(e) => set({ pagPhone: e.target.value })}
                  ph="(00) 00000-0000"
                />
              </div>
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
        <div>{ct.id && <Btn danger onClick={() => onDelete(ct.id)}>Excluir</Btn>}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn ghost onClick={onClose}>
            Cancelar
          </Btn>
          <Btn onClick={onSave}>{ct.id ? "Salvar Alterações" : "Salvar Contato"}</Btn>
        </div>
      </div>
    </OLay>
  );
}
