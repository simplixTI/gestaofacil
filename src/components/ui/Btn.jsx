import { T } from "../../constants/theme";

export function Btn({ children, onClick, ghost = false, danger = false, sm = false, type = "button" }) {
  const bg = danger ? "#ef4444" : ghost ? T.surface : T.pri;
  const cl = ghost && !danger ? T.txtS : "#fff";
  const br = ghost && !danger ? `1.5px solid ${T.border}` : "none";
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        background: bg,
        color: cl,
        border: br,
        borderRadius: T.radS,
        padding: sm ? "6px 12px" : "9px 16px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        boxShadow: ghost ? "none" : "0 1px 3px rgba(71,85,105,.2)",
        transition: "all .15s",
        fontFamily: "'Inter',system-ui,sans-serif",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = ".85")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </button>
  );
}
