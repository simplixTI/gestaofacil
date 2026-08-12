import { T } from "../../constants/theme";

export function MetricCard({ label, value, sub, cardBg, iconBg, iconColor, Icon }) {
  return (
    <div
      style={{
        background: cardBg || T.surface,
        borderRadius: T.rad,
        border: `1px solid ${T.border}`,
        boxShadow: T.shadow,
        padding: "16px 18px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: T.txtM,
            textTransform: "uppercase",
            letterSpacing: ".08em",
            lineHeight: 1.4,
            paddingRight: 6,
          }}
        >
          {label}
        </span>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: iconBg || "rgba(255,255,255,.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={13} style={{ color: iconColor || T.txtM }} />
        </div>
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: T.txt,
          letterSpacing: "-.02em",
          marginBottom: 3,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: T.txtM }}>{sub}</div>}
    </div>
  );
}
