import { T } from "../../constants/theme";
import { OLay, MH, Btn } from "../ui";

export function FinanceModal({ show, contact, onClose, onEdit }) {
  if (!show || !contact) return null;
  const ct = contact;

  const hasPayData =
    ct.pagRazaoSocial ||
    ct.pagCNPJ ||
    ct.pagName ||
    ct.pagEmail ||
    ct.pagWhatsapp ||
    ct.pagPhone ||
    ct.pagEndereco ||
    ct.pagInscMunicipal ||
    ct.pagInscEstadual;

  const hasDepts = (ct.departments || []).length > 0;

  const Row = ({ icon, label, value }) =>
    value ? (
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          padding: "6px 0",
          borderBottom: `1px solid ${T.borderS}`,
        }}
      >
        <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: T.txtX,
              textTransform: "uppercase",
              letterSpacing: ".06em",
              marginBottom: 1,
            }}
          >
            {label}
          </div>
          <div style={{ fontSize: 13, color: T.txt, wordBreak: "break-word" }}>{value}</div>
        </div>
      </div>
    ) : null;

  return (
    <OLay show={show} onClose={onClose} wide>
      <MH title={`Dados Financeiros — ${ct.name}`} onClose={onClose} />

      {hasDepts && (
        <div style={{ marginBottom: 18 }}>
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
            👥 Contratantes por Departamento
          </div>
          {(ct.departments || []).map((d, i) => (
            <div
              key={d.id || i}
              style={{
                background: T.bg,
                border: `1px solid ${T.border}`,
                borderRadius: T.radS,
                padding: "10px 14px",
                marginBottom: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span
                  style={{
                    background: T.priL,
                    color: T.pri,
                    padding: "2px 9px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {d.name || "Departamento"}
                </span>
                {d.contactName && (
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.txt }}>{d.contactName}</span>
                )}
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {d.email && (
                  <span
                    style={{
                      fontSize: 12,
                      color: T.txtM,
                      display: "flex",
                      gap: 5,
                      alignItems: "center",
                    }}
                  >
                    ✉️ {d.email}
                  </span>
                )}
                {d.whatsapp && (
                  <span
                    style={{
                      fontSize: 12,
                      color: "#16a34a",
                      display: "flex",
                      gap: 5,
                      alignItems: "center",
                    }}
                  >
                    💬 {d.whatsapp}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!hasDepts && (
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fcd34d",
            borderRadius: T.radS,
            padding: "8px 12px",
            fontSize: 12,
            color: "#92400e",
            marginBottom: 14,
          }}
        >
          ⚠️ Nenhum departamento/contratante cadastrado ainda.
        </div>
      )}

      <div>
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
          💳 Dados para Pagamento
        </div>
        {hasPayData ? (
          <div
            style={{
              background: T.bg,
              border: `1px solid ${T.border}`,
              borderRadius: T.rad,
              padding: 14,
            }}
          >
            <Row icon="🏢" label="Razão Social" value={ct.pagRazaoSocial} />
            <Row icon="📄" label="CNPJ" value={ct.pagCNPJ} />
            <Row icon="🏙️" label="Inscrição Municipal" value={ct.pagInscMunicipal} />
            <Row icon="🗺️" label="Inscrição Estadual" value={ct.pagInscEstadual} />
            <Row icon="📍" label="Endereço" value={ct.pagEndereco} />
            <div style={{ height: 8 }} />
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.txtX,
                textTransform: "uppercase",
                letterSpacing: ".06em",
                marginBottom: 6,
              }}
            >
              Responsável pelo pagamento
            </div>
            <Row icon="👤" label="Nome" value={ct.pagName} />
            <Row icon="✉️" label="E-mail" value={ct.pagEmail} />
            <Row icon="💬" label="WhatsApp" value={ct.pagWhatsapp} />
            <Row icon="📞" label="Telefone" value={ct.pagPhone} />
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "24px",
              color: T.txtX,
              fontSize: 13,
              background: T.bg,
              borderRadius: T.rad,
              border: `1px dashed ${T.border}`,
            }}
          >
            Nenhum dado financeiro cadastrado.
            <br />
            <span style={{ fontSize: 11, color: T.txtX }}>Clique em "Editar" para adicionar.</span>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 20,
          justifyContent: "flex-end",
          paddingTop: 14,
          borderTop: `1px solid ${T.borderS}`,
        }}
      >
        <Btn ghost onClick={onClose}>
          Fechar
        </Btn>
        <Btn
          onClick={() => {
            onClose();
            onEdit(ct);
          }}
        >
          ✏️ Editar Contato
        </Btn>
      </div>
    </OLay>
  );
}
