import { T } from "../../constants/theme";

export function Pill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? T.pri : "transparent",
        color: active ? "#fff" : T.txtM,
        border: "none",
        padding: "6px 14px",
        borderRadius: T.radS,
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all .15s",
      }}
    >
      {label}
    </button>
  );
}
