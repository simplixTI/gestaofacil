export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const MONTHS_LONG = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export const MON_ABR = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

export const WDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const dimM = (m, y) => new Date(y, m + 1, 0).getDate();
export const fd1 = (m, y) => new Date(y, m, 1).getDay();

export const parseBR = (br) => {
  if (!br || !br.includes("/")) return null;
  const [d, m, y] = br.split("/");
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
};

export const sortByDate = (arr) =>
  [...arr].sort((a, b) => {
    const p = (s) =>
      s && s.includes("/") ? s.split("/").reverse().join("") : "99999999";
    return p(a.startDate || a.dueDate).localeCompare(p(b.startDate || b.dueDate));
  });

export const iso2br = (iso) => {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length === 3) {
    return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return (
    String(d.getDate()).padStart(2, "0") +
    "/" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "/" +
    d.getFullYear()
  );
};

export const br2iso = (br) => {
  if (!br || !br.includes("/")) return br || "";
  const [d, m, y] = br.split("/");
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

export const fmtD = (v) => (v && v.includes("-") ? iso2br(v) : v);

export const fmtDateLong = (br) => {
  if (!br) return "";
  const p = br.split("/");
  if (p.length < 3) return br;
  const mon = MONTHS_LONG[parseInt(p[1]) - 1];
  return mon ? `${p[0]} de ${mon}, ${p[2]}` : br;
};

export const todayBR = () => {
  const d = new Date();
  return (
    String(d.getDate()).padStart(2, "0") +
    "/" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "/" +
    d.getFullYear()
  );
};

export const dateFromParts = (day, month, year) => {
  const d = new Date(year, month, day);
  return Number.isNaN(d.getTime()) ? null : d;
};
