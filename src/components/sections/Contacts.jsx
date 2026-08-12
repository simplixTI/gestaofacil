import { useState } from "react";
import { Plus, Download, Upload, List, Columns, Wallet } from "lucide-react";
import * as XLSX from "xlsx";
import { T, CAT_CLR, CAT_BG, CAT_TX } from "../../constants/theme";
import { SectionHeader, Btn, Av } from "../ui";
import { TH, TD, CARD } from "../../styles/common";

export function Contacts({
  contacts,
  loading,
  categoryFilter,
  onCategoryFilterChange,
  onNew,
  onEdit,
  onFinances,
  onImport,
}) {
  const [view, setView] = useState("kanban");
  const fContacts = contacts.filter(
    (ct) => categoryFilter === "all" || ct.category === categoryFilter
  );

  const exportContacts = () => {
    const filt = contacts.filter((ct) => categoryFilter === "all" || ct.category === categoryFilter);
    const ws1 = XLSX.utils.json_to_sheet(
      filt.map((ct) => ({
        Organização: ct.name,
        Responsável: ct.contactName,
        Categoria: ct.category,
        "E-mail": ct.email,
        Telefone: ct.phone,
        WhatsApp: ct.whatsapp,
        Cidade: ct.city,
        UF: ct.state,
        Observações: ct.notes,
        "Razão Social": ct.pagRazaoSocial || "",
        "Pag. Nome": ct.pagName || "",
        "Pag. E-mail": ct.pagEmail || "",
        "Pag. WhatsApp": ct.pagWhatsapp || "",
        "Pag. Telefone": ct.pagPhone || "",
        CNPJ: ct.pagCNPJ || "",
        "Insc. Municipal": ct.pagInscMunicipal || "",
        "Insc. Estadual": ct.pagInscEstadual || "",
        Endereço: ct.pagEndereco || "",
      }))
    );
    const deptRows = filt.flatMap((ct) =>
      (ct.departments || []).map((d) => ({
        Organização: ct.name,
        Departamento: d.name,
        Contratante: d.contactName,
        "E-mail": d.email,
        WhatsApp: d.whatsapp || "",
      }))
    );
    const ws2 = XLSX.utils.json_to_sheet(
      deptRows.length ? deptRows : [{ Organização: "(nenhum departamento cadastrado)" }]
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "Contatos");
    XLSX.utils.book_append_sheet(wb, ws2, "Departamentos");
    XLSX.writeFile(wb, `contatos${categoryFilter !== "all" ? "-" + categoryFilter : ""}.xlsx`);
  };

  const cats = [
    ["all", "Todos"],
    ["Público", "Público"],
    ["Privado", "Privado"],
    ["Outros", "Outros"],
  ];

  return (
    <div>
      <SectionHeader
        title="Contatos"
        actions={[
          <Btn key="exp" ghost onClick={exportContacts}>
            <Download size={14} /> Exportar
          </Btn>,
          <Btn key="imp" ghost onClick={onImport}>
            <Upload size={14} /> Importar
          </Btn>,
          <Btn key="new" onClick={onNew}>
            <Plus size={14} /> Novo Contato
          </Btn>,
        ]}
      />

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
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
            boxShadow: T.shadow,
            borderRadius: T.radS,
            padding: 3,
            flexShrink: 0,
          }}
        >
          {cats.map(([v, l]) => (
            <button
              key={v}
              onClick={() => onCategoryFilterChange(v)}
              type="button"
              style={{
                background: categoryFilter === v ? T.pri : "transparent",
                color: categoryFilter === v ? "#fff" : T.txtM,
                border: "none",
                padding: "6px 10px",
                borderRadius: T.radS,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all .15s",
              }}
            >
              {l}{" "}
              {v !== "all" ? `(${contacts.filter((c) => c.category === v).length})` : ``}
            </button>
          ))}
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 2,
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: T.radS,
            padding: 3,
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

      {!loading && view === "list" && (
        <div style={{ ...CARD, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Organização", "Responsável", "E-mail", "Telefone", "Local", "Dados Fin."].map((h) => (
                  <th key={h} style={TH}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...TD, textAlign: "center", padding: "48px", color: T.txtX }}>
                    Nenhum contato.
                  </td>
                </tr>
              ) : (
                fContacts.map((ct) => (
                  <tr
                    key={ct.id}
                    onClick={() => onEdit(ct)}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = T.bg)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "")}
                  >
                    <td style={{ ...TD, paddingLeft: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Av category={ct.category} size={32} />
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: T.txt,
                              fontSize: 13,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            {ct.name}
                            {(ct.mainDepartment || (ct.departments && ct.departments.length > 0)) && (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 500,
                                  color: T.txtM,
                                  background: T.bg,
                                  borderRadius: 4,
                                  padding: "1px 6px",
                                  flexShrink: 0,
                                }}
                              >
                                {ct.mainDepartment || ct.departments[0].name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...TD, fontSize: 12 }}>{ct.contactName || "—"}</td>
                    <td style={{ ...TD, fontSize: 12, color: T.txtM }}>{ct.email || "—"}</td>
                    <td style={{ ...TD, fontSize: 12, color: T.txtM }}>
                      {ct.whatsapp || ct.phone || "—"}
                    </td>
                    <td style={{ ...TD, fontSize: 12, color: T.txtM }}>
                      {[ct.city, ct.state].filter(Boolean).join(" - ") || "—"}
                    </td>
                    <td style={{ ...TD, paddingRight: 16 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFinances(ct);
                        }}
                        type="button"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "4px 10px",
                          borderRadius: T.radS,
                          border: `1px solid ${ct.pagCNPJ || ct.pagRazaoSocial ? "#86efac" : T.border}`,
                          background: ct.pagCNPJ || ct.pagRazaoSocial ? "#f0fdf4" : T.bg,
                          color: ct.pagCNPJ || ct.pagRazaoSocial ? "#16a34a" : T.txtM,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <Wallet size={10} />
                        {ct.pagCNPJ || ct.pagRazaoSocial ? "Dados ✓" : "Dados"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && view === "kanban" && (
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
          {cats
            .filter(([v]) => v !== "all")
            .filter(([v]) => categoryFilter === "all" || categoryFilter === v)
            .map(([cat, label]) => {
              const col = fContacts.filter((c) => c.category === cat);
              return (
                <div key={cat} style={{ width: 280, flexShrink: 0 }}>
                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: T.radS,
                      background: CAT_BG[cat] || T.bg,
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: CAT_CLR[cat] || T.pri,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 11,
                        color: CAT_TX[cat] || T.txtS,
                        flex: 1,
                        textTransform: "uppercase",
                        letterSpacing: ".07em",
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        background: "rgba(255,255,255,.8)",
                        color: CAT_TX[cat] || T.txtS,
                        padding: "1px 7px",
                        borderRadius: 20,
                        fontWeight: 700,
                      }}
                    >
                      {col.length}
                    </span>
                  </div>
                  {col.map((ct) => (
                    <div
                      key={ct.id}
                      onClick={() => onEdit(ct)}
                      style={{
                        ...CARD,
                        padding: "12px 14px",
                        marginBottom: 8,
                        cursor: "pointer",
                        transition: "box-shadow .15s",
                        borderLeft: `3px solid ${CAT_CLR[ct.category] || T.pri}`,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = T.shadowM)}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = T.shadow)}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                        <Av category={ct.category} size={28} />
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 14,
                              color: T.txt,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              marginBottom: 4,
                            }}
                          >
                            {ct.name}
                          </div>
                          {ct.contactName && <div style={{ fontSize: 13, color: T.txtM }}>{ct.contactName}</div>}
                          {(ct.mainDepartment || (ct.departments && ct.departments.length > 0)) && (
                            <div
                              style={{
                                fontSize: 12,
                                color: T.txtM,
                                marginTop: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              {ct.mainDepartment || ct.departments[0].name}
                            </div>
                          )}
                        </div>
                      </div>
                      {[ct.email, ct.phone || ct.whatsapp, [ct.city, ct.state].filter(Boolean).join(" - ")].map(
                        (t, i) =>
                          t ? (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                gap: 7,
                                fontSize: 12,
                                color: T.txtM,
                                marginBottom: 4,
                                alignItems: "center",
                              }}
                            >
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {t}
                              </span>
                            </div>
                          ) : null
                      )}
                      <div
                        style={{
                          marginTop: 8,
                          paddingTop: 8,
                          borderTop: `1px solid ${T.borderS}`,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onFinances(ct);
                          }}
                          type="button"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 10px",
                            borderRadius: T.radS,
                            border: `1px solid ${ct.pagCNPJ || ct.pagRazaoSocial ? "#86efac" : T.border}`,
                            background: ct.pagCNPJ || ct.pagRazaoSocial ? "#f0fdf4" : T.bg,
                            color: ct.pagCNPJ || ct.pagRazaoSocial ? "#16a34a" : T.txtM,
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          <Wallet size={10} />
                          {ct.pagCNPJ || ct.pagRazaoSocial ? "Dados Financeiros ✓" : "Dados Financeiros"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
