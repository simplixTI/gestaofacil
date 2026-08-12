import { INPUT_ST, LABEL_ST } from "../../styles/common";
import { T } from "../../constants/theme";

export function FI({
  label,
  value,
  onChange,
  type = "text",
  ph = "",
  max,
  ro = false,
  ml = false,
}) {
  const st = {
    ...INPUT_ST,
    background: ro ? "#f8fafc" : "#fff",
    color: ro ? T.txtX : T.txt,
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={LABEL_ST}>{label}</label>}
      {ml ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={ph}
          rows={3}
          style={{ ...st, resize: "vertical" }}
        />
      ) : (
        <input
          value={value}
          onChange={onChange}
          type={type}
          placeholder={ph}
          maxLength={max}
          readOnly={ro}
          style={st}
          onFocus={(e) => {
            if (!ro) e.target.style.borderColor = T.pri;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = T.border;
          }}
        />
      )}
    </div>
  );
}
