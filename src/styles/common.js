import { T } from "../constants/theme";

export const CARD = {
  background: T.surface,
  borderRadius: T.rad,
  border: `1px solid ${T.border}`,
  boxShadow: T.shadow,
};

export const TH = {
  textAlign: "left",
  padding: "12px 20px",
  fontSize: 11,
  fontWeight: 600,
  color: T.txtX,
  textTransform: "uppercase",
  letterSpacing: ".06em",
  background: "#f8fafc",
  borderBottom: `1px solid ${T.borderS}`,
  whiteSpace: "nowrap",
};

export const TD = {
  padding: "13px 20px",
  fontSize: 13,
  borderBottom: `1px solid ${T.borderS}`,
  color: T.txtS,
  verticalAlign: "middle",
};

export const G2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
};

export const G3 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 14,
};

export const INPUT_ST = {
  border: `1.5px solid ${T.border}`,
  borderRadius: T.radS,
  padding: "10px 13px",
  fontSize: 13,
  outline: "none",
  width: "100%",
  fontFamily: "'Inter',system-ui,sans-serif",
  color: T.txt,
  transition: "border-color .15s",
};

export const LABEL_ST = {
  fontSize: 12,
  fontWeight: 500,
  color: T.txtS,
  marginBottom: 4,
  display: "block",
};
