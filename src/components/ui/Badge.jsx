import { T, SS } from "../../constants/theme";
import { ss } from "../../utils/helpers";

export function Badge({ s }) {
  const { bg, dot } = ss(s, SS);
  return (
    <span
      style={{
        background: bg,
        color: "#4b5563",
        padding: "4px 11px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        boxShadow: "0 1px 4px rgba(0,0,0,.07)",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: dot,
          flexShrink: 0,
        }}
      />
      {s}
    </span>
  );
}
