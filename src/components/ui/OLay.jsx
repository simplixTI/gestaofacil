import { useEffect } from "react";
import { T } from "../../constants/theme";
import { CARD } from "../../styles/common";

export function OLay({ show, onClose, wide, children }) {
  useEffect(() => {
    if (!show) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: 20,
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...CARD,
          padding: 28,
          width: "100%",
          maxWidth: wide ? 600 : 480,
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: T.shadowL,
          borderRadius: T.radL,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
