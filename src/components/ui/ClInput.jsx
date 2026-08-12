import { INPUT_ST, LABEL_ST } from "../../styles/common";
import { T } from "../../constants/theme";

export function ClInput({ value, onChange, contacts }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={LABEL_ST}>Cliente</label>
      <input
        list="cl-dl"
        value={value}
        onChange={onChange}
        placeholder="Digite o nome do cliente..."
        style={{ ...INPUT_ST, background: "#fff" }}
        onFocus={(e) => (e.target.style.borderColor = T.pri)}
        onBlur={(e) => (e.target.style.borderColor = T.border)}
      />
      <datalist id="cl-dl">
        {contacts.map((c) => (
          <option key={c.id} value={c.name} />
        ))}
      </datalist>
    </div>
  );
}
