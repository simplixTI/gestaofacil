import { INPUT_ST, LABEL_ST } from "../../styles/common";
import { T } from "../../constants/theme";

export function FS({ label, value, onChange, opts }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={LABEL_ST}>{label}</label>}
      <select
        value={value}
        onChange={onChange}
        style={{ ...INPUT_ST, background: "#fff" }}
        onFocus={(e) => (e.target.style.borderColor = T.pri)}
        onBlur={(e) => (e.target.style.borderColor = T.border)}
      >
        {opts.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
