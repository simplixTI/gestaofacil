import { CAT_CLR } from "../../constants/theme";

export function Av({ category, size = 36 }) {
  const letters = { Público: "PU", Privado: "PR", Outros: "OU" };
  const lbl = letters[category] || "?";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: CAT_CLR[category] || "#475569",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          color: "#fff",
          fontWeight: 800,
          fontSize: size * 0.4,
          letterSpacing: "-.02em",
          fontFamily: "'Inter',system-ui,sans-serif",
          lineHeight: 1,
        }}
      >
        {lbl}
      </span>
    </div>
  );
}
