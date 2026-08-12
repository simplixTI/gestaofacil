import { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import * as XLSX from "xlsx";
import { T } from "../../constants/theme";
import { normalize } from "../../utils/helpers";
import { OLay, MH, Btn } from "../ui";
import { uniqueId } from "../../utils/helpers";

const APP_FIELDS = [
  {
    key: "name",
    label: "Organização / Nome",
    aliases: ["nome", "name", "organização", "organizacao", "empresa", "company", "razao social", "razão social", "cliente"],
  },
  {
    key: "contactName",
    label: "Responsável",
    aliases: ["responsavel", "responsável", "contato", "contact", "nome do contato", "pessoa"],
  },
  {
    key: "category",
    label: "Setor / Categoria",
    aliases: ["categoria", "setor", "category", "tipo", "segmento", "tipo de cliente"],
  },
  {
    key: "email",
    label: "E-mail",
    aliases: ["email", "e-mail", "mail", "email principal"],
  },
  {
    key: "phone",
    label: "Telefone",
    aliases: ["telefone", "fone", "phone", "tel", "celular"],
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    aliases: ["whatsapp", "zap", "wpp", "whats"],
  },
  {
    key: "city",
    label: "Cidade",
    aliases: ["cidade", "city", "municipio", "município"],
  },
  {
    key: "state",
    label: "UF / Estado",
    aliases: ["uf", "estado", "state", "sigla", "estado/uf"],
  },
  {
    key: "address",
    label: "Endereço",
    aliases: ["endereco", "endereço", "address", "logradouro", "rua"],
  },
  {
    key: "notes",
    label: "Observações",
    aliases: ["observacoes", "observações", "obs", "notas", "notes", "comentarios", "comentários", "anotacoes", "anotações"],
  },
];

const validCats = ["Público", "Privado", "Outros"];

const autoMap = (headers) => {
  const m = {};
  for (const field of APP_FIELDS) {
    for (const h of headers) {
      const hn = normalize(h);
      if (
        field.aliases.some(
          (a) => normalize(a) === hn || hn.includes(normalize(a)) || normalize(a).includes(hn)
        )
      ) {
        if (!m[field.key]) m[field.key] = h;
        break;
      }
    }
  }
  return m;
};

const buildRows = (data, map) => {
  return data
    .map((obj) => {
      const g = (key) => {
        const col = map[key];
        return col ? String(obj[col] ?? "").trim() : "";
      };
      const cat = g("category");
      const resolvedCat =
        validCats.find((c) => normalize(c) === normalize(cat)) || (cat ? "Privado" : "Privado");
      return {
        name: g("name"),
        contactName: g("contactName"),
        category: resolvedCat,
        email: g("email"),
        phone: g("phone"),
        whatsapp: g("whatsapp"),
        city: g("city"),
        state: g("state").substring(0, 2).toUpperCase(),
        address: g("address"),
        notes: g("notes"),
        departments: [],
        pagRazaoSocial: "",
        pagName: "",
        pagEmail: "",
        pagWhatsapp: "",
        pagPhone: "",
        pagEndereco: "",
        pagCNPJ: "",
        pagInscMunicipal: "",
        pagInscEstadual: "",
      };
    })
    .filter((r) => r.name);
};

export function ImportModal({ show, onClose, onImport }) {
  const ref = useRef(null);
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [colMap, setColMap] = useState({});
  const [rawHeaders, setRawHeaders] = useState([]);

  const reset = () => {
    setRows([]);
    setErr("");
    setDone(false);
    setColMap({});
    setRawHeaders([]);
    if (ref.current) ref.current.value = "";
  };

  const parseData = (data, rawHdrs) => {
    const map = autoMap(rawHdrs);
    setRawHeaders(rawHdrs);
    setColMap(map);
    setRows(buildRows(data, map));
  };

  const parse = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErr("");
    setRows([]);
    const n = file.name.toLowerCase();

    if (n.endsWith(".csv")) {
      const r = new FileReader();
      r.onload = (ev) => {
        try {
          const lines = ev.target.result.split(/\r?\n/).filter((l) => l.trim());
          if (lines.length < 2) {
            setErr("O arquivo precisa ter cabeçalho e ao menos uma linha de dados.");
            return;
          }
          const sep = lines[0].includes(";") ? ";" : ",";
          const hdrs = lines[0].split(sep).map((h) => h.trim().replace(/^["']|["']$/g, ""));
          const data = lines.slice(1).map((l) => {
            const vals = l.split(sep).map((v) => v.trim().replace(/^["']|["']$/g, ""));
            const obj = {};
            hdrs.forEach((h, i) => {
              obj[h] = vals[i] || "";
            });
            return obj;
          });
          parseData(data, hdrs);
        } catch (e2) {
          setErr("Erro ao ler CSV: " + e2.message);
        }
      };
      r.readAsText(file, "UTF-8");
    } else if (n.endsWith(".xlsx") || n.endsWith(".xls") || n.endsWith(".ods")) {
      const r = new FileReader();
      r.onload = (ev) => {
        try {
          const wb = XLSX.read(new Uint8Array(ev.target.result), { type: "array" });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });
          const hdrs = data.length > 0 ? Object.keys(data[0]) : [];
          parseData(data, hdrs);
        } catch (e2) {
          setErr("Erro ao ler planilha: " + e2.message);
        }
      };
      r.readAsArrayBuffer(file);
    } else {
      setErr("Formatos aceitos: .csv · .xlsx · .xls · .ods");
    }
  };

  const doImport = () => {
    onImport(rows.map((r) => ({ ...r, id: uniqueId() })));
    setDone(true);
  };

  const mappedCount = Object.keys(colMap).filter((k) => colMap[k]).length;

  return (
    <OLay
      show={show}
      onClose={() => {
        onClose();
        reset();
      }}
      wide
    >
      <MH
        title="Importar Contatos"
        onClose={() => {
          onClose();
          reset();
        }}
      />
      {!done ? (
        <>
          <div
            style={{
              background: T.priL,
              border: `1px solid ${T.priB}`,
              borderRadius: T.radS,
              padding: "10px 14px",
              fontSize: 12,
              color: T.pri,
              marginBottom: 14,
            }}
          >
            Aceita qualquer planilha (.csv, .xlsx, .xls, .ods). O app identifica automaticamente as colunas compatíveis.
          </div>

          <div
            onClick={() => ref.current?.click()}
            style={{
              border: `2px dashed ${T.border}`,
              borderRadius: T.rad,
              padding: "28px",
              textAlign: "center",
              cursor: "pointer",
              background: "#f8fafc",
              marginBottom: 12,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.pri)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
          >
            <Upload size={24} style={{ color: T.txtX, marginBottom: 8 }} />
            <div style={{ fontWeight: 600, color: T.txtS, fontSize: 13 }}>Clique para selecionar arquivo</div>
            <div style={{ fontSize: 11, color: T.txtX, marginTop: 4 }}>.csv · .xlsx · .xls · .ods</div>
            <input ref={ref} type="file" accept=".csv,.xlsx,.xls,.ods" onChange={parse} style={{ display: "none" }} />
          </div>

          {err && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: T.radS,
                padding: "8px 12px",
                fontSize: 12,
                color: "#dc2626",
                display: "flex",
                gap: 6,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <AlertCircle size={14} />
              {err}
            </div>
          )}

          {rawHeaders.length > 0 && rows.length === 0 && (
            <div
              style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: T.radS,
                padding: "8px 12px",
                fontSize: 12,
                color: "#92400e",
                marginBottom: 12,
              }}
            >
              ⚠️ Nenhum contato encontrado. Verifique se a planilha tem uma coluna com o nome da organização.
            </div>
          )}

          {rows.length > 0 && (
            <>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.pri,
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <CheckCircle2 size={14} />
                {rows.length} contatos encontrados · {mappedCount} campos mapeados automaticamente
              </div>
              <div
                style={{
                  maxHeight: 150,
                  overflowY: "auto",
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radS,
                  marginBottom: 14,
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["Organização", "Responsável", "Setor", "E-mail", "Cidade"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "6px 12px",
                            textAlign: "left",
                            fontWeight: 600,
                            color: T.txtX,
                            borderBottom: `1px solid ${T.borderS}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 8).map((r, i) => (
                      <tr key={i}>
                        {[r.name, r.contactName, r.category, r.email, r.city].map((v, j) => (
                          <td
                            key={j}
                            style={{
                              padding: "5px 12px",
                              borderBottom: `1px solid ${T.borderS}`,
                              color: T.txtS,
                              maxWidth: 120,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {v || "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {rows.length > 8 && (
                      <tr>
                        <td colSpan={5} style={{ padding: "5px 12px", color: T.txtX, fontSize: 10, fontStyle: "italic" }}>
                          ... e mais {rows.length - 8} contatos
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn
                  ghost
                  onClick={() => {
                    reset();
                  }}
                >
                  Cancelar
                </Btn>
                <Btn onClick={doImport}>
                  <Upload size={13} /> Importar {rows.length} contatos
                </Btn>
              </div>
            </>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "#dcfce7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
            }}
          >
            <CheckCircle2 size={28} style={{ color: "#16a34a" }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: T.txt, marginBottom: 6 }}>
            Importação concluída!
          </div>
          <div style={{ fontSize: 13, color: T.txtM, marginBottom: 20 }}>
            {rows.length} contatos adicionados com sucesso.
          </div>
          <Btn
            onClick={() => {
              onClose();
              reset();
            }}
          >
            Fechar
          </Btn>
        </div>
      )}
    </OLay>
  );
}
