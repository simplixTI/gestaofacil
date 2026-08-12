import { LayoutDashboard, Users, Calendar, BookOpen, MessageCircle, ChevronRight, LogOut } from "lucide-react";
import { T } from "../../constants/theme";
import LogoSrc from "../../assets/logo.png";

const nav = [
  { id: "dashboard", label: "Visão Geral", ic: LayoutDashboard },
  { id: "activities", label: "Atividades", ic: BookOpen },
  { id: "leads", label: "Em Conversa", ic: MessageCircle },
  { id: "calendar", label: "Calendário", ic: Calendar },
  { id: "contacts", label: "Contatos", ic: Users },
];

export function Sidebar({ page, onNavigate, sidebar, onToggle, onLogout }) {
  return (
    <aside
      style={{
        width: sidebar ? 210 : 58,
        background: "#f2f3f5",
        borderRight: `1px solid ${T.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width .2s ease",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "0 14px",
          height: 60,
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: `1px solid ${T.border}`,
          flexShrink: 0,
        }}
      >
        {sidebar ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src={LogoSrc} alt="Comunica Simples" style={{ height: 44, objectFit: "contain" }} />
          </div>
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#e0e7ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontWeight: 800, fontSize: 10, color: "#1e3a8a" }}>CS</span>
          </div>
        )}
      </div>
      <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map(({ id, label, ic: Ic }) => {
          const on = page === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: T.radS,
                border: "none",
                background: on ? T.priL : "transparent",
                color: on ? T.pri : T.txtM,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: on ? 600 : 400,
                width: "100%",
                transition: "all .15s",
                textAlign: "left",
              }}
            >
              <Ic size={16} style={{ flexShrink: 0, color: on ? T.pri : T.txtX }} />
              {sidebar && <span style={{ whiteSpace: "nowrap" }}>{label}</span>}
              {on && sidebar && (
                <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: T.pri }} />
              )}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: "8px 8px", borderTop: `1px solid ${T.border}` }}>
        <button
          onClick={onToggle}
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: T.radS,
            border: "none",
            background: "transparent",
            color: T.txtX,
            cursor: "pointer",
            fontSize: 12,
            width: "100%",
          }}
        >
          <ChevronRight
            size={13}
            style={{
              transform: sidebar ? "rotate(180deg)" : "none",
              transition: "transform .2s",
              flexShrink: 0,
            }}
          />
          {sidebar && "Recolher"}
        </button>
        <button
          onClick={onLogout}
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: T.radS,
            border: "none",
            background: "transparent",
            color: "#ef4444",
            cursor: "pointer",
            fontSize: 12,
            width: "100%",
          }}
        >
          <LogOut size={13} style={{ flexShrink: 0 }} />
          {sidebar && "Sair"}
        </button>
      </div>
    </aside>
  );
}
