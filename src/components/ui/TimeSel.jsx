import { INPUT_ST, LABEL_ST } from "../../styles/common";
import { T } from "../../constants/theme";

export function TimeSel({ label, value, onChange }) {
  const hours = Array.from({ length: 10 }, (_, i) => String(i + 9).padStart(2, "0"));
  const mins = ["00", "15", "30"];
  const [h, m] = value ? value.split(":") : ["", ""];
  const selSt = { ...INPUT_ST, background: "#fff", padding: "7px 9px", fontSize: 12 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={LABEL_ST}>{label}</label>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <select
          value={h || ""}
          onChange={(e) => onChange(`${e.target.value}:${m || "00"}`)}
          style={selSt}
          onFocus={(e) => (e.target.style.borderColor = T.pri)}
          onBlur={(e) => (e.target.style.borderColor = T.border)}
        >
          <option value="">H</option>
          {hours.map((hh) => (
            <option key={hh} value={hh}>
              {hh}h
            </option>
          ))}
        </select>
        <select
          value={m || ""}
          onChange={(e) => onChange(`${h || "09"}:${e.target.value}`)}
          style={selSt}
          onFocus={(e) => (e.target.style.borderColor = T.pri)}
          onBlur={(e) => (e.target.style.borderColor = T.border)}
        >
          <option value="">Min</option>
          {mins.map((mm) => (
            <option key={mm} value={mm}>
              {mm}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
