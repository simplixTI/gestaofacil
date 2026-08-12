import { T } from "../../constants/theme";

export function SectionHeader({ title, actions }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 700,
          color: T.txt,
          fontFamily: "'Inter',system-ui,sans-serif",
          letterSpacing: "-.02em",
        }}
      >
        {title}
      </h1>
      {actions && <div style={{ display: "flex", gap: 9 }}>{actions}</div>}
    </div>
  );
}
