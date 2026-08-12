import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, MapPin, Wallet, MoreVertical } from "lucide-react";
import { T, SS, FMT_PASTEL } from "../../constants/theme";
import { fmtDateLong } from "../../utils/date";
import { money } from "../../utils/money";
import { ss, actLabel, shortSt } from "../../utils/helpers";
import { Av } from "../ui";

export function ActivityCard({ a, onOpen, onExpenses }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { bg, dot } = ss(a.status, SS);
  const expTotal = (a.expenses || []).reduce((s, e) => s + (parseFloat(e.valor) || 0), 0);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const sameDay = a.startDate === a.endDate || !a.endDate;
  let dateStr = fmtDateLong(a.startDate);
  if (!sameDay && a.endDate) dateStr = `${fmtDateLong(a.startDate)} - ${fmtDateLong(a.endDate)}`;

  const loc = [a.city, a.state].filter(Boolean).join(" - ");
  const fmtStyle = FMT_PASTEL[a.format] || { background: "#f1f5f9", color: T.txtS };

  return (
    <div
      style={{
        background: T.surface,
        borderRadius: T.radL,
        border: `1px solid ${T.border}`,
        boxShadow: T.shadow,
        padding: "18px 20px",
        cursor: "pointer",
        transition: "box-shadow .15s, transform .1s",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = T.shadowM;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = T.shadow;
        e.currentTarget.style.transform = "translateY(0)";
      }}
      onClick={() => onOpen(a)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span
          style={{
            background: bg,
            color: "#4b5563",
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            whiteSpace: "nowrap",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            flexShrink: 0,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: dot, flexShrink: 0 }} />
          {shortSt(a.status)}
        </span>
        <div style={{ flex: 1, height: 1, background: T.border }} />
        <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            type="button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.txtX,
              padding: 4,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
            }}
          >
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                zIndex: 50,
                background: T.surface,
                border: `1px solid ${T.border}`,
                borderRadius: T.radS,
                boxShadow: T.shadowM,
                minWidth: 160,
                padding: 4,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onOpen(a);
                }}
                type="button"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  color: T.txt,
                  borderRadius: 6,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = T.bg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                ✏️ Editar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onExpenses(a);
                }}
                type="button"
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  color: T.txt,
                  borderRadius: 6,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = T.bg)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                💰 Despesas
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
        <div
          style={{
            fontSize: 19,
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: "-.01em",
            lineHeight: 1.2,
          }}
        >
          {a.client || "—"}
        </div>
        {a.clientCategory && <Av category={a.clientCategory} size={26} />}
      </div>
      <div style={{ fontSize: 16, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
        {actLabel(a)}
      </div>

      {a.departmentContact || a.department ? (
        <div style={{ marginBottom: 10 }}>
          {a.departmentContact && (
            <div
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "#374151",
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
                fontSize: 16,
                fontWeight: 500,
                color: "#374151",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginTop: a.departmentContact ? 2 : 0,
              }}
            >
              {a.department}
            </div>
          )}
        </div>
      ) : (
        <div style={{ marginBottom: 10 }} />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Calendar size={12} style={{ color: T.txtX, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: T.txtS }}>{dateStr}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={12} style={{ color: T.txtX, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: T.txtS }}>
            {a.startTime} - {a.endTime}
          </span>
        </div>
        {loc && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={12} style={{ color: T.txtX, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: T.txtS }}>{loc}</span>
          </div>
        )}
      </div>

      <div style={{ height: 1, background: T.borderS, marginBottom: 14 }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span
            style={{
              ...fmtStyle,
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <MapPin size={9} />
            {a.format}
          </span>
          {expTotal > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onExpenses(a);
              }}
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fca5a5",
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Wallet size={9} />
              {money(expTotal)}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: T.txtX,
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            Valor
          </span>
          <span style={{ fontSize: 14, fontWeight: 400, color: "#16a34a", whiteSpace: "nowrap" }}>
            {money(a.value)}
          </span>
        </div>
      </div>

      {a.notes && (
        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            color: T.txtM,
            borderTop: `1px solid ${T.borderS}`,
            paddingTop: 10,
          }}
        >
          {a.notes}
        </div>
      )}
    </div>
  );
}
