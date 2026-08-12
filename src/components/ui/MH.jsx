import { X } from "lucide-react";
import { T } from "../../constants/theme";

export function MH({ title, onClose }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 22,
        paddingBottom: 16,
        borderBottom: `1px solid ${T.borderS}`,
      }}
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: 16,
          color: T.txt,
          fontFamily: "'Poppins',sans-serif",
        }}
      >
        {title}
      </span>
      <button
        onClick={onClose}
        type="button"
        style={{
          background: "#f1f5f9",
          border: "none",
          cursor: "pointer",
          color: T.txtM,
          width: 30,
          height: 30,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
