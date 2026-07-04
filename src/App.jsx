import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { LayoutDashboard, Users, Calendar, DollarSign, Plus, X, List, Columns, ChevronLeft, ChevronRight, Mail, MessageCircle, MapPin, Clock, LogOut, BookOpen, Upload, Download, AlertCircle, CheckCircle2, Wallet, MoreVertical } from "lucide-react";
import * as XLSX from "xlsx";
const FONT_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Inter',system-ui,sans-serif;}
  @keyframes shimmer{0%{background-position:-700px 0}100%{background-position:700px 0}}
  .skeleton{background:linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%);background-size:700px 100%;animation:shimmer 1.4s infinite linear;border-radius:6px;}
`;
const T = {
    pri: "#475569", priHov: "#334155", priL: "#f1f5f9", priB: "#cbd5e1",
    bg: "#f2f3f5", surface: "#ffffff", border: "#e8edf3", borderS: "#f1f5f9",
    txt: "#0f172a", txtS: "#475569", txtM: "#64748b", txtX: "#94a3b8",
    shadow: "0 2px 8px rgba(0,0,0,.05)", shadowM: "0 4px 16px rgba(0,0,0,.08)", shadowL: "0 8px 32px rgba(0,0,0,.12)",
    rad: "12px", radS: "8px", radL: "16px",
};
const CAT_CLR = { Público: "#1e3a8a", Privado: "#3d8fa8", Outros: "#64748b" };
const CAT_BG = { Público: "#eff6ff", Privado: "#f0fdf4", Outros: "#fffbeb" };
const CAT_TX = { Público: "#4b5563", Privado: "#4b5563", Outros: "#4b5563" };
const MODALITIES = ["Palestra", "Curso Básico 2h", "Curso Básico 3h", "Curso Avançado Online 10h", "Prática Coletiva Supervisionada", "Diagnóstico Padrão de Clareza", "Simplificação de Documentos"];
const FORMATS = ["Presencial", "Online", "EAD", "Híbrido"];
const ACT_ST = ["Proposta Enviada", "Aguarda nota de empenho", "Confirmado", "Aguardando pagamento", "Realizado"];
const C0 = [
    { id: 1, name: "Banco do Brasil - RH", contactName: "Carlos Mendes", category: "Público", email: "rh@bb.com.br", phone: "(61) 99876-5432", whatsapp: "(61) 99876-5432", city: "Brasília", state: "DF", notes: "Interesse em cursos de compliance.", departments: [], pagRazaoSocial: "", pagName: "", pagEmail: "", pagWhatsapp: "", pagPhone: "", pagEndereco: "", pagCNPJ: "", pagInscMunicipal: "", pagInscEstadual: "" },
    { id: 2, name: "Magazine Luiza", contactName: "Patricia Lima", category: "Privado", email: "patricia@magazineluiza.com.br", phone: "(11) 97654-3210", whatsapp: "(11) 97654-3210", city: "São Paulo", state: "SP", notes: "", departments: [], pagRazaoSocial: "", pagName: "", pagEmail: "", pagWhatsapp: "", pagPhone: "", pagEndereco: "", pagCNPJ: "", pagInscMunicipal: "", pagInscEstadual: "" },
    { id: 3, name: "Prefeitura de São Paulo", contactName: "Maria Silva", category: "Público", email: "maria@prefsp.gov.br", phone: "(11) 99122-4567", whatsapp: "", city: "São Paulo", state: "SP", notes: "Exige nota de empenho.", departments: [], pagRazaoSocial: "", pagName: "", pagEmail: "", pagWhatsapp: "", pagPhone: "", pagEndereco: "", pagCNPJ: "", pagInscMunicipal: "", pagInscEstadual: "" },
    { id: 4, name: "Light", contactName: "Roberto Farias", category: "Privado", email: "treinamentos@light.com.br", phone: "(21) 98765-4321", whatsapp: "(21) 98765-4321", city: "Rio de Janeiro", state: "RJ", notes: "", departments: [], pagRazaoSocial: "", pagName: "", pagEmail: "", pagWhatsapp: "", pagPhone: "", pagEndereco: "", pagCNPJ: "", pagInscMunicipal: "", pagInscEstadual: "" },
    { id: 5, name: "TCU", contactName: "Ana Pereira", category: "Público", email: "capacitacao@tcu.gov.br", phone: "(61) 99234-5678", whatsapp: "", city: "Brasília", state: "DF", notes: "Órgão federal.", departments: [], pagRazaoSocial: "", pagName: "", pagEmail: "", pagWhatsapp: "", pagPhone: "", pagEndereco: "", pagCNPJ: "", pagInscMunicipal: "", pagInscEstadual: "" },
    { id: 6, name: "ONG Futuro Verde", contactName: "Sônia Carvalho", category: "Outros", email: "contato@futuroverde.org.br", phone: "(11) 98123-4567", whatsapp: "(11) 98123-4567", city: "Campinas", state: "SP", notes: "Desconto social: 30%.", departments: [], pagRazaoSocial: "", pagName: "", pagEmail: "", pagWhatsapp: "", pagPhone: "", pagEndereco: "", pagCNPJ: "", pagInscMunicipal: "", pagInscEstadual: "" },
    { id: 7, name: "Petrobras", contactName: "José Fernandes", category: "Público", email: "treinamento@petrobras.com.br", phone: "(21) 99876-1234", whatsapp: "(21) 99876-1234", city: "Rio de Janeiro", state: "RJ", notes: "", departments: [], pagRazaoSocial: "", pagName: "", pagEmail: "", pagWhatsapp: "", pagPhone: "", pagEndereco: "", pagCNPJ: "", pagInscMunicipal: "", pagInscEstadual: "" },
    { id: 8, name: "Embrapa", contactName: "Luiz Araújo", category: "Público", email: "rh@embrapa.br", phone: "(61) 99345-6789", whatsapp: "", city: "Brasília", state: "DF", notes: "Parceria de longa data.", departments: [], pagRazaoSocial: "", pagName: "", pagEmail: "", pagWhatsapp: "", pagPhone: "", pagEndereco: "", pagCNPJ: "", pagInscMunicipal: "", pagInscEstadual: "" },
];
const A0 = [
    { id: 3, types: ["Curso Básico 2h"], type: "Curso Básico 2h", format: "Presencial", client: "Magazine Luiza", startDate: "29/03/2026", endDate: "29/03/2026", startTime: "08:00", endTime: "10:00", city: "Rio de Janeiro", state: "RJ", status: "Proposta Enviada", value: 52000, tax: 10, expenses: [{ id: 101, descricao: "Passagem SP→RJ", tipo: "Passagem Aérea", valor: 850 }, { id: 102, descricao: "Hotel 1 noite", tipo: "Hospedagem", valor: 420 }], notes: "Turma de 25 pessoas" },
    { id: 4, types: ["Prática Coletiva Supervisionada"], type: "Prática Coletiva Supervisionada", format: "Presencial", client: "Prefeitura de São Paulo", startDate: "05/03/2026", endDate: "05/03/2026", startTime: "09:00", endTime: "14:00", city: "Brasília", state: "DF", status: "Aguarda nota de empenho", value: 8500, tax: 10, expenses: [], notes: "" },
    { id: 5, types: ["Curso Básico 2h"], type: "Curso Básico 2h", format: "EAD", client: "TCU", startDate: "10/04/2026", endDate: "10/04/2026", startTime: "08:00", endTime: "10:00", city: "", state: "", status: "Realizado", value: 12000, tax: 10, expenses: [], notes: "" },
    { id: 6, types: ["Palestra"], type: "Palestra", format: "Presencial", client: "Petrobras", startDate: "15/04/2026", endDate: "17/04/2026", startTime: "09:00", endTime: "18:00", city: "Rio de Janeiro", state: "RJ", status: "Proposta Enviada", value: 35000, tax: 10, expenses: [], notes: "Curso para 30 pessoas" },
];
// ── DATE UTILITIES ─────────────────────────────────────────
const parseBR = (br) => {
    if (!br || !br.includes("/"))
        return null;
    const [d, m, y] = br.split("/");
    return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
};
const sortByDate = (arr) => [...arr].sort((a, b) => {
    const p = (s) => s && s.includes("/") ? s.split("/").reverse().join("") : "99999999";
    return p(a.startDate || a.dueDate).localeCompare(p(b.startDate || b.dueDate));
});
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const MONTHS_LONG = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const MON_ABR = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const WDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const dimM = (m, y) => new Date(y, m + 1, 0).getDate();
const fd1 = (m, y) => new Date(y, m, 1).getDay();
const money = (v) => "R$ " + Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
const iso2br = (iso) => {
    if (!iso)
        return "";
    const parts = iso.split("-");
    if (parts.length === 3) {
        return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
    }
    const d = new Date(iso);
    return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
};
const br2iso = (br) => {
    if (!br || !br.includes("/"))
        return br || "";
    const [d, m, y] = br.split("/");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};
const fmtD = (v) => v && v.includes("-") ? iso2br(v) : v;
const fmtDateLong = (br) => {
    if (!br)
        return "";
    const p = br.split("/");
    if (p.length < 3)
        return br;
    const mon = MONTHS_LONG[parseInt(p[1]) - 1];
    return mon ? `${p[0]} de ${mon}, ${p[2]}` : br;
};
const calcNet = (gross, tax, expenses) => {
    const effT = Math.max(tax || 0, 10);
    const afterTax = gross * (1 - effT / 100);
    const expTotal = (expenses || []).reduce((s, e) => s + (parseFloat(e.valor) || 0), 0);
    return parseFloat((afterTax - expTotal).toFixed(2));
};
// ── STATUS STYLES ───────────────────────────────────────────
const SS = {
    "Proposta Enviada": { bg: "#eff6ff", cl: "#4b5563", dot: "#93c5fd" },
    "Confirmado": { bg: "#f0fdf4", cl: "#4b5563", dot: "#86efac" },
    "Aguarda nota de empenho": { bg: "#fffbeb", cl: "#4b5563", dot: "#fcd34d" },
    "Aguardando pagamento": { bg: "#fff1f2", cl: "#4b5563", dot: "#fda4af" },
    "Realizado": { bg: "#f5f3ff", cl: "#4b5563", dot: "#a78bfa" },
    "Recebido": { bg: "#f0fdf4", cl: "#4b5563", dot: "#86efac" },
    "Pendente": { bg: "#fffbeb", cl: "#4b5563", dot: "#fcd34d" },
    "A Receber": { bg: "#eff6ff", cl: "#4b5563", dot: "#93c5fd" },
    "Pago": { bg: "#ecfdf5", cl: "#4b5563", dot: "#6ee7b7" },
};
const ss = (s) => SS[s] || { bg: "#f1f5f9", cl: "#475569", dot: "#94a3b8" };
const shortSt = (s) => ({ "Proposta Enviada": "Proposta", "Confirmado": "Confirmado", "Aguarda nota de empenho": "Aguarda Empenho", "Aguardando pagamento": "Aguarda Pagamento", "Realizado": "Realizado" }[s] || s);
const TYPE_CLR = {
    "Palestra": { bg: "#fef3c7", border: "#f59e0b", dot: "#d97706" },
    "Curso Básico 2h": { bg: "#dcfce7", border: "#22c55e", dot: "#15803d" },
    "Curso Básico 3h": { bg: "#f3e8ff", border: "#a855f7", dot: "#7e22ce" },
    "Curso Avançado Online 10h": { bg: "#ffe4e6", border: "#f43f5e", dot: "#be123c" },
    "Prática Coletiva Supervisionada": { bg: "#ccfbf1", border: "#14b8a6", dot: "#0f766e" },
    "Diagnóstico Padrão de Clareza": { bg: "#fce7f3", border: "#ec4899", dot: "#be185d" },
    "Simplificação de Documentos": { bg: "#e0f2fe", border: "#0ea5e9", dot: "#0369a1" },
};
const tClr = (t) => TYPE_CLR[t] || { bg: "#f1f5f9", border: "#e2e8f0", dot: "#94a3b8" };
// ── STYLE CONSTANTS ────────────────────────────────────────
const CARD = { background: T.surface, borderRadius: T.rad, border: `1px solid ${T.border}`, boxShadow: T.shadow };
const TH = { textAlign: "left", padding: "12px 20px", fontSize: 11, fontWeight: 600, color: T.txtX, textTransform: "uppercase", letterSpacing: ".06em", background: "#f8fafc", borderBottom: `1px solid ${T.borderS}`, whiteSpace: "nowrap" };
const TD = { padding: "13px 20px", fontSize: 13, borderBottom: `1px solid ${T.borderS}`, color: T.txtS, verticalAlign: "middle" };
const G2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 };
const G3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 };
const INPUT_ST = { border: `1.5px solid ${T.border}`, borderRadius: T.radS, padding: "10px 13px", fontSize: 13, outline: "none", width: "100%", fontFamily: "'Inter',system-ui,sans-serif", color: T.txt, transition: "border-color .15s" };
const LABEL_ST = { fontSize: 12, fontWeight: 500, color: T.txtS, marginBottom: 4, display: "block" };
// ── SKELETON COMPONENTS ────────────────────────────────────
function SkeletonLine({ w = "100%", h = 12, mb = 0 }) {
    return <div className="skeleton" style={{ width: w, height: h, borderRadius: 6, marginBottom: mb }}/>;
}
function SkeletonCard() {
    return (<div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8edf3", padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <SkeletonLine w={90} h={22}/>
        <div style={{ flex: 1, height: 1, background: "#e8edf3", alignSelf: "center" }}/>
      </div>
      <SkeletonLine w="60%" h={18} mb={6}/>
      <SkeletonLine w="40%" h={13} mb={14}/>
      <SkeletonLine w="70%" h={12} mb={6}/>
      <SkeletonLine w="50%" h={12} mb={16}/>
      <div style={{ height: 1, background: "#f1f5f9", marginBottom: 14 }}/>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <SkeletonLine w={80} h={22}/>
        <SkeletonLine w={70} h={20}/>
      </div>
    </div>);
}
function SkeletonRow() {
    return (<tr>
      {[180, 120, 100, 90, 90, 80, 80, 80, 50].map((w, i) => (<td key={i} style={{ padding: "13px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <div className="skeleton" style={{ height: 13, width: w, borderRadius: 6 }}/>
        </td>))}
    </tr>);
}
// ── UI ATOMS ───────────────────────────────────────────────
function Badge({ s }) {
    const { bg, dot } = ss(s);
    return (<span style={{ background: bg, color: "#4b5563", padding: "4px 11px", borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 5, boxShadow: "0 1px 4px rgba(0,0,0,.07)" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, flexShrink: 0 }}/>
      {s}
    </span>);
}
function Btn({ children, onClick, ghost = false, danger = false, sm = false }) {
    const bg = danger ? "#ef4444" : ghost ? T.surface : T.pri;
    const cl = ghost && !danger ? T.txtS : "#fff";
    const br = ghost && !danger ? `1.5px solid ${T.border}` : "none";
    return (<button onClick={onClick} style={{ background: bg, color: cl, border: br, borderRadius: T.radS, padding: sm ? "6px 12px" : "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, boxShadow: ghost ? "none" : "0 1px 3px rgba(71,85,105,.2)", transition: "all .15s", fontFamily: "'Inter',system-ui,sans-serif" }} onMouseEnter={e => e.currentTarget.style.opacity = ".85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
      {children}
    </button>);
}
function Pill({ label, active, onClick }) {
    return (<button onClick={onClick} style={{ background: active ? T.pri : "transparent", color: active ? "#fff" : T.txtM, border: "none", padding: "6px 14px", borderRadius: T.radS, fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s" }}>
      {label}
    </button>);
}
function FI({ label, value, onChange, type = "text", ph = "", max, ro = false, ml = false }) {
    const st = { ...INPUT_ST, background: ro ? "#f8fafc" : "#fff", color: ro ? T.txtX : T.txt };
    return (<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={LABEL_ST}>{label}</label>}
      {ml
            ? <textarea value={value} onChange={onChange} placeholder={ph} rows={3} style={{ ...st, resize: "vertical" }}/>
            : <input value={value} onChange={onChange} type={type} placeholder={ph} maxLength={max} readOnly={ro} style={st} onFocus={e => { if (!ro)
                e.target.style.borderColor = T.pri; }} onBlur={e => { e.target.style.borderColor = T.border; }}/>}
    </div>);
}
function FS({ label, value, onChange, opts }) {
    return (<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={LABEL_ST}>{label}</label>}
      <select value={value} onChange={onChange} style={{ ...INPUT_ST, background: "#fff" }} onFocus={e => e.target.style.borderColor = T.pri} onBlur={e => e.target.style.borderColor = T.border}>
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>);
}
function ClInput({ value, onChange, contacts }) {
    return (<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={LABEL_ST}>Cliente</label>
      <input list="cl-dl" value={value} onChange={onChange} placeholder="Digite o nome do cliente..." style={{ ...INPUT_ST, background: "#fff" }} onFocus={e => e.target.style.borderColor = T.pri} onBlur={e => e.target.style.borderColor = T.border}/>
      <datalist id="cl-dl">
        {contacts.map(c => <option key={c.id} value={c.name}/>)}
      </datalist>
    </div>);
}
function TimeSel({ label, value, onChange }) {
    const hours = Array.from({ length: 10 }, (_, i) => String(i + 9).padStart(2, "0"));
    const mins = ["00", "15", "30"];
    const [h, m] = value ? value.split(":") : ["", ""];
    const selSt = { ...INPUT_ST, background: "#fff", padding: "7px 9px", fontSize: 12 };
    return (<div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={LABEL_ST}>{label}</label>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <select value={h || ""} onChange={e => onChange(`${e.target.value}:${m || "00"}`)} style={selSt} onFocus={e => e.target.style.borderColor = T.pri} onBlur={e => e.target.style.borderColor = T.border}>
          <option value="">H</option>
          {hours.map(hh => <option key={hh} value={hh}>{hh}h</option>)}
        </select>
        <select value={m || ""} onChange={e => onChange(`${h || "09"}:${e.target.value}`)} style={selSt} onFocus={e => e.target.style.borderColor = T.pri} onBlur={e => e.target.style.borderColor = T.border}>
          <option value="">Min</option>
          {mins.map(mm => <option key={mm} value={mm}>{mm}</option>)}
        </select>
      </div>
    </div>);
}
function OLay({ show, onClose, wide, children }) {
    useEffect(() => {
        if (!show)
            return;
        const handler = (e) => { if (e.key === "Escape")
            onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [show, onClose]);
    if (!show)
        return null;
    return (<div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20, backdropFilter: "blur(2px)" }} onClick={onClose}>
      <div style={{ ...CARD, padding: 28, width: "100%", maxWidth: wide ? 600 : 480, maxHeight: "92vh", overflowY: "auto", boxShadow: T.shadowL, borderRadius: T.radL }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>);
}
function MH({ title, onClose }) {
    return (<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, paddingBottom: 16, borderBottom: `1px solid ${T.borderS}` }}>
      <span style={{ fontWeight: 700, fontSize: 16, color: T.txt, fontFamily: "'Poppins',sans-serif" }}>{title}</span>
      <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", cursor: "pointer", color: T.txtM, width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <X size={14}/>
      </button>
    </div>);
}
function Av({ category, size = 36 }) {
    const letters = { Público: "PU", Privado: "PR", Outros: "OU" };
    const lbl = letters[category] || "?";
    return (<div style={{ width: size, height: size, borderRadius: size * 0.3, background: CAT_CLR[category] || T.pri, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "#fff", fontWeight: 800, fontSize: size * 0.4, letterSpacing: "-.02em", fontFamily: "'Inter',system-ui,sans-serif", lineHeight: 1 }}>{lbl}</span>
    </div>);
}
function SectionHeader({ title, actions }) {
    return (<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.txt, fontFamily: "'Inter',system-ui,sans-serif", letterSpacing: "-.02em" }}>{title}</h1>
      {actions && <div style={{ display: "flex", gap: 9 }}>{actions}</div>}
    </div>);
}
function MetricCard({ label, value, sub, cardBg, iconBg, iconColor, Icon }) {
    return (<div style={{ background: cardBg || T.surface, borderRadius: T.rad, border: `1px solid ${T.border}`, boxShadow: T.shadow, padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: T.txtM, textTransform: "uppercase", letterSpacing: ".08em", lineHeight: 1.4, paddingRight: 6 }}>{label}</span>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: iconBg || "rgba(255,255,255,.7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={13} style={{ color: iconColor || T.txtM }}/>
        </div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: T.txt, letterSpacing: "-.02em", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: T.txtM }}>{sub}</div>}
    </div>);
}
// ── ACTIVITY CARD ──────────────────────────────────────────
function ActivityCard({ a, onOpen, onExpenses }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { bg, dot } = ss(a.status);
    const expTotal = (a.expenses || []).reduce((s, e) => s + (parseFloat(e.valor) || 0), 0);
    useEffect(() => {
        if (!menuOpen)
            return;
        const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target))
            setMenuOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);
    const sameDay = a.startDate === a.endDate || !a.endDate;
    let dateStr = fmtDateLong(a.startDate);
    if (!sameDay && a.endDate)
        dateStr = `${fmtDateLong(a.startDate)} - ${fmtDateLong(a.endDate)}`;
    const loc = [a.city, a.state].filter(Boolean).join(" - ");
    const FMT_PASTEL = {
        "Presencial": { background: "#f0fdf4", color: T.txtS },
        "Online": { background: "#dbeafe", color: T.txtS },
        "EAD": { background: "#ede9fe", color: T.txtS },
        "Híbrido": { background: "#fef3c7", color: T.txtS },
    };
    const fmtStyle = FMT_PASTEL[a.format] || { background: "#f1f5f9", color: T.txtS };
    return (<div style={{ background: T.surface, borderRadius: T.radL, border: `1px solid ${T.border}`, boxShadow: T.shadow, padding: "18px 20px", cursor: "pointer", transition: "box-shadow .15s, transform .1s", position: "relative" }} onMouseEnter={e => { e.currentTarget.style.boxShadow = T.shadowM; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.boxShadow = T.shadow; e.currentTarget.style.transform = "translateY(0)"; }} onClick={() => onOpen(a)}>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ background: bg, color: "#4b5563", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: dot, flexShrink: 0 }}/>{shortSt(a.status)}
        </span>
        <div style={{ flex: 1, height: 1, background: T.border }}/>
        <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }} style={{ background: "none", border: "none", cursor: "pointer", color: T.txtX, padding: 4, borderRadius: 6, display: "flex", alignItems: "center" }}>
            <MoreVertical size={15}/>
          </button>
          {menuOpen && (<div style={{ position: "absolute", top: "100%", right: 0, zIndex: 50, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radS, boxShadow: T.shadowM, minWidth: 160, padding: 4 }} onClick={e => e.stopPropagation()}>
              <button onClick={e => { e.stopPropagation(); setMenuOpen(false); onOpen(a); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: T.txt, borderRadius: 6 }} onMouseEnter={e => e.currentTarget.style.background = T.bg} onMouseLeave={e => e.currentTarget.style.background = "none"}>✏️ Editar</button>
              <button onClick={e => { e.stopPropagation(); setMenuOpen(false); onExpenses(a); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: T.txt, borderRadius: 6 }} onMouseEnter={e => e.currentTarget.style.background = T.bg} onMouseLeave={e => e.currentTarget.style.background = "none"}>💰 Despesas</button>
            </div>)}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
        <div style={{ fontSize: 19, fontWeight: 700, color: "#0f172a", letterSpacing: "-.01em", lineHeight: 1.2 }}>{a.client || "—"}</div>
        {a.clientCategory && <Av category={a.clientCategory} size={26}/>}
      </div>
      <div style={{ fontSize: 16, fontWeight: 500, color: "#374151", marginBottom: 6 }}>{actLabel(a)}</div>
      {(a.departmentContact || a.department) ? (<div style={{ marginBottom: 10 }}>
          {a.departmentContact && (<div style={{ fontSize: 16, fontWeight: 500, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {a.departmentContact}
            </div>)}
          {a.department && (<div style={{ fontSize: 16, fontWeight: 500, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: a.departmentContact ? 2 : 0 }}>
              {a.department}
            </div>)}
        </div>) : <div style={{ marginBottom: 10 }}/>}

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Calendar size={12} style={{ color: T.txtX, flexShrink: 0 }}/>
        <span style={{ fontSize: 12, color: T.txtS }}>{dateStr}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Clock size={12} style={{ color: T.txtX, flexShrink: 0 }}/>
          <span style={{ fontSize: 12, color: T.txtS }}>{a.startTime} - {a.endTime}</span>
        </div>
        {loc && (<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <MapPin size={12} style={{ color: T.txtX, flexShrink: 0 }}/>
            <span style={{ fontSize: 12, color: T.txtS }}>{loc}</span>
          </div>)}
      </div>

      <div style={{ height: 1, background: T.borderS, marginBottom: 14 }}/>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ ...fmtStyle, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 5 }}>
            <MapPin size={9}/>{a.format}
          </span>
          {expTotal > 0 && (<span onClick={e => { e.stopPropagation(); onExpenses(a); }} style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Wallet size={9}/>{money(expTotal)}
            </span>)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
          <span style={{ fontSize: 10, fontWeight: 500, color: T.txtX, textTransform: "uppercase", letterSpacing: ".06em" }}>Valor</span>
          <span style={{ fontSize: 14, fontWeight: 400, color: "#16a34a", whiteSpace: "nowrap" }}>{money(a.value)}</span>
        </div>
      </div>

      {a.notes && <div style={{ marginTop: 12, fontSize: 12, color: T.txtM, borderTop: `1px solid ${T.borderS}`, paddingTop: 10 }}>{a.notes}</div>}
    </div>);
}
// ── IMPORT MODAL ───────────────────────────────────────────
function ImportModal({ show, onClose, onImport }) {
    const ref = useRef(null);
    const [rows, setRows] = useState([]);
    const [err, setErr] = useState("");
    const [done, setDone] = useState(false);
    const [colMap, setColMap] = useState({});
    const [rawHeaders, setRawHeaders] = useState([]);
    const reset = () => { setRows([]); setErr(""); setDone(false); setColMap({}); setRawHeaders([]); if (ref.current)
        ref.current.value = ""; };
    // Campos alvo do app
    const APP_FIELDS = [
        { key: "name", label: "Organização / Nome", aliases: ["nome", "name", "organização", "organizacao", "empresa", "company", "razao social", "razão social", "cliente"] },
        { key: "contactName", label: "Responsável", aliases: ["responsavel", "responsável", "contato", "contact", "nome do contato", "pessoa"] },
        { key: "category", label: "Setor / Categoria", aliases: ["categoria", "setor", "category", "tipo", "segmento", "tipo de cliente"] },
        { key: "email", label: "E-mail", aliases: ["email", "e-mail", "mail", "email principal"] },
        { key: "phone", label: "Telefone", aliases: ["telefone", "fone", "phone", "tel", "celular"] },
        { key: "whatsapp", label: "WhatsApp", aliases: ["whatsapp", "zap", "wpp", "whats"] },
        { key: "city", label: "Cidade", aliases: ["cidade", "city", "municipio", "município"] },
        { key: "state", label: "UF / Estado", aliases: ["uf", "estado", "state", "sigla", "estado/uf"] },
        { key: "address", label: "Endereço", aliases: ["endereco", "endereço", "address", "logradouro", "rua"] },
        { key: "notes", label: "Observações", aliases: ["observacoes", "observações", "obs", "notas", "notes", "comentarios", "comentários", "anotacoes", "anotações"] },
    ];
    const normalize = (s) => s?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() || "";
    // Tenta mapear automaticamente colunas da planilha para campos do app
    const autoMap = (headers) => {
        const m = {};
        for (const field of APP_FIELDS) {
            for (const h of headers) {
                const hn = normalize(h);
                if (field.aliases.some(a => normalize(a) === hn || hn.includes(normalize(a)) || normalize(a).includes(hn))) {
                    if (!m[field.key])
                        m[field.key] = h;
                    break;
                }
            }
        }
        return m;
    };
    const buildRows = (data, map) => {
        return data.map(obj => {
            const g = (key) => {
                const col = map[key];
                return col ? String(obj[col] ?? "").trim() : "";
            };
            const cat = g("category");
            const validCats = ["Público", "Privado", "Outros"];
            const resolvedCat = validCats.find(c => normalize(c) === normalize(cat)) || (cat ? "Privado" : "Privado");
            return {
                name: g("name"), contactName: g("contactName"), category: resolvedCat,
                email: g("email"), phone: g("phone"), whatsapp: g("whatsapp"),
                city: g("city"), state: g("state").substring(0, 2).toUpperCase(), address: g("address"), notes: g("notes"),
                departments: [], pagRazaoSocial: "", pagName: "", pagEmail: "", pagWhatsapp: "", pagPhone: "", pagEndereco: "", pagCNPJ: "", pagInscMunicipal: "", pagInscEstadual: ""
            };
        }).filter(r => r.name);
    };
    const parseData = (data, rawHdrs) => {
        const map = autoMap(rawHdrs);
        setRawHeaders(rawHdrs);
        setColMap(map);
        setRows(buildRows(data, map));
    };
    const parse = (e) => {
        const file = e.target.files[0];
        if (!file)
            return;
        setErr("");
        setRows([]);
        const n = file.name.toLowerCase();
        if (n.endsWith(".csv")) {
            const r = new FileReader();
            r.onload = (ev) => {
                try {
                    const lines = ev.target.result.split(/\r?\n/).filter((l) => l.trim());
                    if (lines.length < 2) {
                        setErr("O arquivo precisa ter cabeçalho e ao menos uma linha de dados.");
                        return;
                    }
                    const sep = lines[0].includes(";") ? ";" : ",";
                    const hdrs = lines[0].split(sep).map((h) => h.trim().replace(/^["']|["']$/g, ""));
                    const data = lines.slice(1).map((l) => {
                        const vals = l.split(sep).map((v) => v.trim().replace(/^["']|["']$/g, ""));
                        const obj = {};
                        hdrs.forEach((h, i) => { obj[h] = vals[i] || ""; });
                        return obj;
                    });
                    parseData(data, hdrs);
                }
                catch (e2) {
                    setErr("Erro ao ler CSV: " + e2.message);
                }
            };
            r.readAsText(file, "UTF-8");
        }
        else if (n.endsWith(".xlsx") || n.endsWith(".xls") || n.endsWith(".ods")) {
            const r = new FileReader();
            r.onload = (ev) => {
                try {
                    const wb = XLSX.read(new Uint8Array(ev.target.result), { type: "array" });
                    const sheet = wb.Sheets[wb.SheetNames[0]];
                    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });
                    const hdrs = data.length > 0 ? Object.keys(data[0]) : [];
                    parseData(data, hdrs);
                }
                catch (e2) {
                    setErr("Erro ao ler planilha: " + e2.message);
                }
            };
            r.readAsArrayBuffer(file);
        }
        else {
            setErr("Formatos aceitos: .csv · .xlsx · .xls · .ods");
        }
    };
    const doImport = () => { onImport(rows.map((r, i) => ({ ...r, id: Date.now() + i }))); setDone(true); };
    const mappedCount = Object.keys(colMap).filter(k => colMap[k]).length;
    return (<OLay show={show} onClose={() => { onClose(); reset(); }} wide>
      <MH title="Importar Contatos" onClose={() => { onClose(); reset(); }}/>
      {!done ? (<>
          <div style={{ background: T.priL, border: `1px solid ${T.priB}`, borderRadius: T.radS, padding: "10px 14px", fontSize: 12, color: T.pri, marginBottom: 14 }}>
            Aceita qualquer planilha (.csv, .xlsx, .xls, .ods). O app identifica automaticamente as colunas compatíveis.
          </div>
          <div onClick={() => ref.current?.click()} style={{ border: `2px dashed ${T.border}`, borderRadius: T.rad, padding: "28px", textAlign: "center", cursor: "pointer", background: "#f8fafc", marginBottom: 12 }} onMouseEnter={e => e.currentTarget.style.borderColor = T.pri} onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
            <Upload size={24} style={{ color: T.txtX, marginBottom: 8 }}/>
            <div style={{ fontWeight: 600, color: T.txtS, fontSize: 13 }}>Clique para selecionar arquivo</div>
            <div style={{ fontSize: 11, color: T.txtX, marginTop: 4 }}>.csv · .xlsx · .xls · .ods</div>
            <input ref={ref} type="file" accept=".csv,.xlsx,.xls,.ods" onChange={parse} style={{ display: "none" }}/>
          </div>
          {err && (<div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: T.radS, padding: "8px 12px", fontSize: 12, color: "#dc2626", display: "flex", gap: 6, alignItems: "center", marginBottom: 12 }}>
              <AlertCircle size={14}/>{err}
            </div>)}
          {rawHeaders.length > 0 && rows.length === 0 && (<div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: T.radS, padding: "8px 12px", fontSize: 12, color: "#92400e", marginBottom: 12 }}>
              ⚠️ Nenhum contato encontrado. Verifique se a planilha tem uma coluna com o nome da organização.
            </div>)}
          {rows.length > 0 && (<>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.pri, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                <CheckCircle2 size={14}/>{rows.length} contatos encontrados · {mappedCount} campos mapeados automaticamente
              </div>
              <div style={{ maxHeight: 150, overflowY: "auto", border: `1px solid ${T.border}`, borderRadius: T.radS, marginBottom: 14 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["Organização", "Responsável", "Setor", "E-mail", "Cidade"].map(h => (<th key={h} style={{ padding: "6px 12px", textAlign: "left", fontWeight: 600, color: T.txtX, borderBottom: `1px solid ${T.borderS}`, whiteSpace: "nowrap" }}>{h}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 8).map((r, i) => (<tr key={i}>
                        {[r.name, r.contactName, r.category, r.email, r.city].map((v, j) => (<td key={j} style={{ padding: "5px 12px", borderBottom: `1px solid ${T.borderS}`, color: T.txtS, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v || "—"}</td>))}
                      </tr>))}
                    {rows.length > 8 && (<tr><td colSpan={5} style={{ padding: "5px 12px", color: T.txtX, fontSize: 10, fontStyle: "italic" }}>... e mais {rows.length - 8} contatos</td></tr>)}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn ghost onClick={reset}>Cancelar</Btn>
                <Btn onClick={doImport}><Upload size={13}/>Importar {rows.length} contatos</Btn>
              </div>
            </>)}
        </>) : (<div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <CheckCircle2 size={28} style={{ color: "#16a34a" }}/>
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: T.txt, marginBottom: 6 }}>Importação concluída!</div>
          <div style={{ fontSize: 13, color: T.txtM, marginBottom: 20 }}>{rows.length} contatos adicionados com sucesso.</div>
          <Btn onClick={() => { onClose(); reset(); }}>Fechar</Btn>
        </div>)}
    </OLay>);
}
// ── EXPENSES MODAL ─────────────────────────────────────────
const EXP_TIPOS = ["Passagem Aérea", "Passagem Rodoviária", "Hospedagem", "Alimentação", "Translado", "Outro"];
const EXP_F = { tipo: "Passagem Aérea", descricao: "", valor: "" };
const TIPO_CLR = { "Passagem Aérea": "#2563eb", "Passagem Rodoviária": "#7c3aed", "Hospedagem": "#0891b2", "Alimentação": "#16a34a", "Translado": "#d97706", "Outro": "#64748b" };
const TIPO_BG = { "Passagem Aérea": "#dbeafe", "Passagem Rodoviária": "#ede9fe", "Hospedagem": "#cffafe", "Alimentação": "#dcfce7", "Translado": "#fef3c7", "Outro": "#f1f5f9" };
function ExpModal({ show, activity, onClose, onSave }) {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({ ...EXP_F });
    useEffect(() => {
        if (show && activity)
            setItems(activity.expenses || []);
    }, [show, activity]);
    const addItem = () => {
        if (!form.descricao || !form.valor)
            return;
        setItems(p => [...p, { ...form, id: Date.now(), valor: parseFloat(form.valor) }]);
        setForm({ ...EXP_F });
    };
    const removeItem = (id) => setItems(p => p.filter(it => it.id !== id));
    const total = items.reduce((s, e) => s + (parseFloat(e.valor) || 0), 0);
    return (<OLay show={show} onClose={onClose} wide>
      {activity && <>
        <MH title={`Despesas — ${actLabel(activity)}`} onClose={onClose}/>
        <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.rad, padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.txtS, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>Adicionar Despesa</div>
          <div style={{ ...G3, marginBottom: 10 }}>
            <FS label="Tipo" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} opts={EXP_TIPOS}/>
            <FI label="Descrição" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} ph="Ex: Hotel 1 noite"/>
            <FI label="Valor (R$)" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} type="number" ph="0,00"/>
          </div>
          <Btn onClick={addItem}><Plus size={13}/>Adicionar</Btn>
        </div>
        {items.length === 0
                ? <div style={{ textAlign: "center", padding: "24px", color: T.txtX, fontSize: 13, background: T.bg, borderRadius: T.rad, border: `1px dashed ${T.border}`, marginBottom: 14 }}>Nenhuma despesa cadastrada.</div>
                : <div style={{ ...CARD, overflow: "hidden", marginBottom: 14 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ ...TH, paddingLeft: 20 }}>Tipo</th>
                    <th style={TH}>Descrição</th>
                    <th style={{ ...TH, textAlign: "right" }}>Valor</th>
                    <th style={{ ...TH, width: 40 }}/>
                  </tr>
                </thead>
                <tbody>
                  {items.map(it => (<tr key={it.id}>
                      <td style={{ ...TD, paddingLeft: 20 }}>
                        <span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: TIPO_BG[it.tipo] || "#f1f5f9", color: TIPO_CLR[it.tipo] || T.txtS, whiteSpace: "nowrap" }}>{it.tipo}</span>
                      </td>
                      <td style={{ ...TD, fontWeight: 500, color: T.txt }}>{it.descricao}</td>
                      <td style={{ ...TD, textAlign: "right", fontWeight: 700, color: "#dc2626", whiteSpace: "nowrap" }}>{money(it.valor)}</td>
                      <td style={{ ...TD, textAlign: "center", paddingRight: 12 }}>
                        <button onClick={() => removeItem(it.id)} style={{ background: "none", border: "none", cursor: "pointer", color: T.txtX, display: "flex", alignItems: "center" }}>
                          <X size={13}/>
                        </button>
                      </td>
                    </tr>))}
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 20px", borderTop: `1px solid ${T.borderS}`, background: "#fafafa", borderRadius: `0 0 ${T.rad} ${T.rad}` }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: T.txt }}>Total: <span style={{ color: "#dc2626", marginLeft: 6 }}>{money(total)}</span></span>
              </div>
            </div>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn ghost onClick={onClose}>Cancelar</Btn>
          <Btn onClick={() => { onSave(activity.id, items); onClose(); }}><CheckCircle2 size={13}/>Salvar Despesas</Btn>
        </div>
      </>}
    </OLay>);
}
// ── FINANCE INFO MODAL ─────────────────────────────────────
function FinanceModal({ show, contact, onClose, onEdit }) {
    if (!show || !contact)
        return null;
    const ct = contact;
    const hasPayData = ct.pagRazaoSocial || ct.pagCNPJ || ct.pagName || ct.pagEmail || ct.pagWhatsapp || ct.pagPhone || ct.pagEndereco || ct.pagInscMunicipal || ct.pagInscEstadual;
    const hasDepts = (ct.departments || []).length > 0;
    const Row = ({ icon, label, value }) => value ? (<div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderBottom: `1px solid ${T.borderS}` }}>
      <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: T.txtX, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 13, color: T.txt, wordBreak: "break-word" }}>{value}</div>
      </div>
    </div>) : null;
    return (<OLay show={show} onClose={onClose} wide>
      <MH title={`Dados Financeiros — ${ct.name}`} onClose={onClose}/>
      {hasDepts && (<div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.txtS, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>👥 Contratantes por Departamento</div>
          {(ct.departments || []).map((d, i) => (<div key={d.id || i} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radS, padding: "10px 14px", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ background: T.priL, color: T.pri, padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{d.name || "Departamento"}</span>
                {d.contactName && <span style={{ fontSize: 13, fontWeight: 600, color: T.txt }}>{d.contactName}</span>}
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {d.email && <span style={{ fontSize: 12, color: T.txtM, display: "flex", gap: 5, alignItems: "center" }}><Mail size={11}/>{d.email}</span>}
                {d.whatsapp && <span style={{ fontSize: 12, color: "#16a34a", display: "flex", gap: 5, alignItems: "center" }}><MessageCircle size={11}/>{d.whatsapp}</span>}
              </div>
            </div>))}
        </div>)}
      {!hasDepts && (<div style={{ background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: T.radS, padding: "8px 12px", fontSize: 12, color: "#92400e", marginBottom: 14 }}>
          ⚠️ Nenhum departamento/contratante cadastrado ainda.
        </div>)}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.txtS, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 10 }}>💳 Dados para Pagamento</div>
        {hasPayData ? (<div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.rad, padding: 14 }}>
            <Row icon="🏢" label="Razão Social" value={ct.pagRazaoSocial}/>
            <Row icon="📄" label="CNPJ" value={ct.pagCNPJ}/>
            <Row icon="🏙️" label="Inscrição Municipal" value={ct.pagInscMunicipal}/>
            <Row icon="🗺️" label="Inscrição Estadual" value={ct.pagInscEstadual}/>
            <Row icon="📍" label="Endereço" value={ct.pagEndereco}/>
            <div style={{ height: 8 }}/>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.txtX, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Responsável pelo pagamento</div>
            <Row icon="👤" label="Nome" value={ct.pagName}/>
            <Row icon="✉️" label="E-mail" value={ct.pagEmail}/>
            <Row icon="💬" label="WhatsApp" value={ct.pagWhatsapp}/>
            <Row icon="📞" label="Telefone" value={ct.pagPhone}/>
          </div>) : (<div style={{ textAlign: "center", padding: "24px", color: T.txtX, fontSize: 13, background: T.bg, borderRadius: T.rad, border: `1px dashed ${T.border}` }}>
            Nenhum dado financeiro cadastrado.<br />
            <span style={{ fontSize: 11, color: T.txtX }}>Clique em "Editar" para adicionar.</span>
          </div>)}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end", paddingTop: 14, borderTop: `1px solid ${T.borderS}` }}>
        <Btn ghost onClick={onClose}>Fechar</Btn>
        <Btn onClick={() => { onClose(); onEdit(ct); }}>✏️ Editar Contato</Btn>
      </div>
    </OLay>);
}
// ── CONTACT MODAL ──────────────────────────────────────────
function ContactModal({ show, contact, onClose, onChange, onSave, onDelete }) {
    const [ctTab, setCtTab] = useState("geral");
    if (!show || !contact)
        return null;
    const ct = contact;
    const set = (f) => onChange({ ...ct, ...f });
    const depts = ct.departments || [];
    const addDept = () => onChange({ ...ct, departments: [...depts, { id: Date.now(), name: "", contactName: "", email: "", phone: "", whatsapp: "" }] });
    const updDept = (id, f) => onChange({ ...ct, departments: depts.map((d) => d.id === id ? { ...d, ...f } : d) });
    const remDept = (id) => onChange({ ...ct, departments: depts.filter((d) => d.id !== id) });
    const tabSt = { fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "7px 14px", borderRadius: T.radS, border: "none", transition: "all .15s" };
    return (<OLay show={show} onClose={onClose} wide>
      <MH title={ct.id ? "Editar Contato" : "Novo Contato"} onClose={onClose}/>
      <div style={{ display: "flex", gap: 4, marginBottom: 18, background: T.bg, padding: 4, borderRadius: T.radS }}>
        {[["geral", "Geral"], ["depts", "Departamentos"], ["pag", "Resp. Pagamento"]].map(([v, l]) => (<button key={v} onClick={() => setCtTab(v)} style={{ ...tabSt, background: ctTab === v ? T.surface : "transparent", color: ctTab === v ? T.txt : T.txtM, boxShadow: ctTab === v ? T.shadow : "none" }}>{l}</button>))}
      </div>

      {ctTab === "geral" && (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <FI label="Nome da Organização *" value={ct.name} onChange={e => set({ name: e.target.value })} ph="Nome da empresa, órgão ou organização"/>
          <div style={G2}>
            <FI label="Nome do Responsável" value={ct.contactName} onChange={e => set({ contactName: e.target.value })} ph="Nome do contato principal"/>
            <FS label="Setor" value={ct.category} onChange={e => set({ category: e.target.value })} opts={["Público", "Privado", "Outros"]}/>
          </div>
          <FI label="Departamento" value={ct.mainDepartment || ""} onChange={e => set({ mainDepartment: e.target.value })} ph="Ex: RH, Treinamentos, Jurídico..."/>
          <FI label="E-mail" value={ct.email} onChange={e => set({ email: e.target.value })} type="email" ph="email@empresa.com.br"/>
          <div style={G2}>
            <FI label="Telefone" value={ct.phone} onChange={e => set({ phone: e.target.value })} ph="(00) 00000-0000"/>
            <FI label="WhatsApp" value={ct.whatsapp} onChange={e => set({ whatsapp: e.target.value })} ph="(00) 00000-0000"/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
            <FI label="Cidade" value={ct.city} onChange={e => set({ city: e.target.value })} ph="Cidade"/>
            <FI label="UF" value={ct.state} onChange={e => set({ state: e.target.value })} ph="UF" max={2}/>
          </div>
          <FI label="Endereço" value={ct.address || ""} onChange={e => set({ address: e.target.value })} ph="Rua, número, bairro, CEP"/>
          <div style={{ display: "flex", gap: 20 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
              <input type="checkbox" checked={!!ct.alreadyBought} onChange={e => set({ alreadyBought: e.target.checked })} style={{ width: 15, height: 15, accentColor: T.pri, cursor: "pointer" }}/>
              <span style={{ fontSize: 13, color: T.txt, fontWeight: 500 }}>Já comprou</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
              <input type="checkbox" checked={!!ct.quotedNotBought} onChange={e => set({ quotedNotBought: e.target.checked })} style={{ width: 15, height: 15, accentColor: T.pri, cursor: "pointer" }}/>
              <span style={{ fontSize: 13, color: T.txt, fontWeight: 500 }}>Orçou e não comprou</span>
            </label>
          </div>
          <FI label="Observações" value={ct.notes} onChange={e => set({ notes: e.target.value })} ph="Ex: Interesse em cursos e palestras..." ml/>
        </div>)}

      {ctTab === "depts" && (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 12, color: T.txtM, background: T.priL, padding: "8px 12px", borderRadius: T.radS }}>
            Adicione um contato por departamento.
          </div>
          {depts.map((d, i) => (<div key={d.id} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.rad, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: T.txt }}>Contratante {i + 1}</span>
                <button onClick={() => remDept(d.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                  <X size={13}/> Remover
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={G2}>
                  <FI label="Departamento" value={d.name} onChange={e => updDept(d.id, { name: e.target.value })} ph="Ex: RH, Treinamento, TI"/>
                  <FI label="Nome do Contratante" value={d.contactName} onChange={e => updDept(d.id, { contactName: e.target.value })} ph="Nome de quem compra"/>
                </div>
                <div style={G2}>
                  <FI label="E-mail" value={d.email} onChange={e => updDept(d.id, { email: e.target.value })} ph="email@empresa.com.br"/>
                  <FI label="WhatsApp" value={d.whatsapp || ""} onChange={e => updDept(d.id, { whatsapp: e.target.value })} ph="(00) 00000-0000"/>
                </div>
              </div>
            </div>))}
          <Btn ghost onClick={addDept}><Plus size={13}/>Adicionar Contratante/Departamento</Btn>
        </div>)}

      {ctTab === "pag" && (<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 12, color: T.txtM, background: T.priL, padding: "8px 12px", borderRadius: T.radS }}>
            Dados de quem cuida do pagamento — pode ser diferente do contratante do curso.
          </div>
          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.rad, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.txtS, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>🏢 Dados da Empresa</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <FI label="Razão Social" value={ct.pagRazaoSocial || ""} onChange={e => set({ pagRazaoSocial: e.target.value })} ph="Razão Social completa"/>
              <div style={G2}>
                <FI label="CNPJ" value={ct.pagCNPJ || ""} onChange={e => set({ pagCNPJ: e.target.value })} ph="00.000.000/0001-00"/>
                <div style={G2}>
                  <FI label="Insc. Municipal" value={ct.pagInscMunicipal || ""} onChange={e => set({ pagInscMunicipal: e.target.value })} ph="Nº"/>
                  <FI label="Insc. Estadual" value={ct.pagInscEstadual || ""} onChange={e => set({ pagInscEstadual: e.target.value })} ph="Nº"/>
                </div>
              </div>
              <FI label="Endereço completo" value={ct.pagEndereco || ""} onChange={e => set({ pagEndereco: e.target.value })} ph="Rua, número, bairro, cidade, UF, CEP" ml/>
            </div>
          </div>
          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.rad, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.txtS, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>👤 Responsável pelo Pagamento</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <FI label="Nome do Responsável" value={ct.pagName || ""} onChange={e => set({ pagName: e.target.value })} ph="Nome completo"/>
              <FI label="E-mail" value={ct.pagEmail || ""} onChange={e => set({ pagEmail: e.target.value })} type="email" ph="email@empresa.com.br"/>
              <div style={G2}>
                <FI label="WhatsApp" value={ct.pagWhatsapp || ""} onChange={e => set({ pagWhatsapp: e.target.value })} ph="(00) 00000-0000"/>
                <FI label="Telefone" value={ct.pagPhone || ""} onChange={e => set({ pagPhone: e.target.value })} ph="(00) 00000-0000"/>
              </div>
            </div>
          </div>
        </div>)}

      <div style={{ display: "flex", gap: 8, marginTop: 22, justifyContent: "space-between", paddingTop: 16, borderTop: `1px solid ${T.borderS}` }}>
        <div>{ct.id && <Btn danger onClick={() => onDelete(ct.id)}>Excluir</Btn>}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn ghost onClick={onClose}>Cancelar</Btn>
          <Btn onClick={onSave}>{ct.id ? "Salvar Alterações" : "Salvar Contato"}</Btn>
        </div>
      </div>
    </OLay>);
}
// ── BLANK OBJECTS ──────────────────────────────────────────
const BLANK_C = { id: null, name: "", contactName: "", category: "Privado", email: "", phone: "", whatsapp: "", city: "", state: "", address: "", notes: "", alreadyBought: false, quotedNotBought: false, mainDepartment: "", departments: [], pagRazaoSocial: "", pagName: "", pagEmail: "", pagWhatsapp: "", pagPhone: "", pagEndereco: "", pagCNPJ: "", pagInscMunicipal: "", pagInscEstadual: "" };
const CANAL_OPTS = ["Contato", "Atendimento", "LinkedIn", "Instagram", "Indicação", "Outro"];
const LEAD_ST = ["Aguardando Proposta", "Proposta Enviada", "Em contratação", "Encerrada"];
const BLANK_LEAD = { id: null, contactName: "", organization: "", canal: "Contato", status: "Aguardando Proposta", startDate: "", notes: "", followUp: "", department: "", statusHistory: [] };
const BLANK_A = { id: null, types: [], type: "", format: "Presencial", client: "", clientCategory: "", department: "", departmentContact: "", paymentName: "", paymentEmail: "", paymentWhatsapp: "", paymentPhone: "", startDate: "", endDate: "", startTime: "", endTime: "", typeSchedules: {}, city: "", state: "", status: "Proposta Enviada", value: "", tax: "10", expenses: [], notes: "" };
const actLabel = (a) => (a.types && a.types.length > 0 ? a.types.join(", ") : a.type || "");
// ── PRÓXIMAS ATIVIDADES ────────────────────────────────────
const NEXT_BTN_CLR = {
    "Confirmado": { bg: "#f0fdf4", border: "#bbf7d0" },
    "Aguarda nota de empenho": { bg: "#fffbeb", border: "#fde68a" },
    "Aguardando pagamento": { bg: "#ffe4e6", border: "#fda4af" },
};
const NEXT_ST = { "Proposta Enviada": "Aguarda nota de empenho", "Aguarda nota de empenho": "Confirmado", "Confirmado": "Aguardando pagamento", "Aguardando pagamento": "Realizado" };
const PREV_ST = Object.fromEntries(Object.entries(NEXT_ST).map(([k, v]) => [v, k]));
const DASH_GROUPS = [
    ["Confirmado", "Confirmadas"],
    ["Proposta Enviada", "Proposta Enviada"],
    ["Aguarda nota de empenho", "Aguarda Nota Empenho"],
    ["Aguardando pagamento", "Aguarda Pagamento"],
];
function ProximasAtividades({ activities, onOpen, onStatusChange, onVerTodas }) {
    const [dView, setDView] = useState("kanban");
    const pending = sortByDate(activities.filter(a => a.status !== "Realizado"));
    const handleAdvance = (id, st) => {
        if (st === "Realizado" && !window.confirm("Marcar como Realizado? A atividade sairá da lista de pendentes."))
            return;
        onStatusChange(id, st);
    };
    const NEXT_LABEL = { "Confirmado": "Confirmado", "Aguarda nota de empenho": "Empenho", "Aguardando pagamento": "Pagamento", "Realizado": "Realizado" };
    return (<div style={{ ...CARD, padding: 24, marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: T.txt }}>Próximas Atividades</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 2, background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radS, padding: 3 }}>
            {[["list", <List size={12}/>], ["kanban", <Columns size={12}/>]].map(([v, ic]) => (<button key={v} onClick={() => setDView(v)} style={{ padding: "5px 7px", borderRadius: 6, border: "none", background: dView === v ? T.pri : "transparent", color: dView === v ? "#fff" : T.txtX, cursor: "pointer", display: "flex", alignItems: "center" }}>{ic}</button>))}
          </div>
          <button onClick={onVerTodas} style={{ fontSize: 12, color: T.pri, background: T.priL, border: "none", padding: "5px 12px", borderRadius: T.radS, cursor: "pointer", fontWeight: 500 }}>Ver todas →</button>
        </div>
      </div>

      {dView === "list" && (<div>
          {DASH_GROUPS.map(([st, label]) => {
                const gActs = sortByDate(pending.filter(a => a.status === st));
                if (!gActs.length)
                    return null;
                const { dot } = ss(st);
                return (<div key={st} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot, flexShrink: 0 }}/>
                  <span style={{ fontWeight: 700, fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: ".07em" }}>{label}</span>
                  <span style={{ fontSize: 11, background: "rgba(255,255,255,.8)", color: "#4b5563", padding: "1px 8px", borderRadius: 20, fontWeight: 700 }}>{gActs.length}</span>
                </div>
                {gActs.map((a, idx) => {
                        const parts = a.startDate.split("/");
                        const isLast = idx === gActs.length - 1;
                        return (<div key={a.id} style={{ display: "grid", gridTemplateColumns: "52px 1px 1fr auto", gap: "0 14px", alignItems: "center", padding: "12px 10px 12px 14px", borderBottom: isLast ? "none" : `1px solid ${T.borderS}`, borderRadius: T.radS, transition: "background .15s", borderLeft: "4px solid #e2e8f0", marginBottom: 2 }} onMouseEnter={e => { e.currentTarget.style.background = T.bg; e.currentTarget.style.borderLeftColor = "#94a3b8"; }} onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.borderLeftColor = "#e2e8f0"; }}>
                      <div style={{ textAlign: "center", flexShrink: 0, cursor: "pointer" }} onClick={() => onOpen(a)}>
                        <div style={{ fontSize: 9, fontWeight: 800, color: T.txtX, textTransform: "uppercase", letterSpacing: ".1em", lineHeight: 1 }}>{MON_ABR[parseInt(parts[1]) - 1] || ""}</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: T.txt, lineHeight: 1.1, marginTop: 2, fontFamily: "'Poppins',sans-serif" }}>{parts[0]}</div>
                      </div>
                      <div style={{ width: 1, height: 36, background: T.border, flexShrink: 0 }}/>
                      <div style={{ minWidth: 0, cursor: "pointer" }} onClick={() => onOpen(a)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.client || "—"}</div>
                          {a.clientCategory && <Av category={a.clientCategory} size={21}/>}
                        </div>
                        <div style={{ fontSize: 12, color: T.txtM, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{actLabel(a)}{a.city ? " · " + a.city : ""}</div>
                        {a.departmentContact && <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.departmentContact}</div>}
                        {a.department && <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.department}</div>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 9, fontWeight: 600, color: T.txtX, textTransform: "uppercase", letterSpacing: ".06em" }}>Valor</div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>{money(a.value)}</span>
                        </div>
                        <div style={{ display: "flex", gap: 3 }}>
                          {PREV_ST[a.status] && (<button onClick={() => onStatusChange(a.id, PREV_ST[a.status])} title={"← " + PREV_ST[a.status]} style={{ background: "#f1f5f9", border: "none", borderRadius: 6, width: 24, height: 24, cursor: "pointer", fontSize: 13, color: T.txtM, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>‹</button>)}
                          {NEXT_ST[a.status] && (<button onClick={() => handleAdvance(a.id, NEXT_ST[a.status])} title={NEXT_ST[a.status]} style={{ background: (NEXT_BTN_CLR[a.status] || { bg: T.priL }).bg, border: `1px solid ${(NEXT_BTN_CLR[a.status] || { border: T.priB }).border}`, borderRadius: 6, padding: "3px 8px", height: 24, cursor: "pointer", fontSize: 10, color: "#4b5563", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, whiteSpace: "nowrap", gap: 3 }}>
                              {NEXT_LABEL[NEXT_ST[a.status]] || NEXT_ST[a.status]} ›
                            </button>)}
                        </div>
                      </div>
                    </div>);
                    })}
              </div>);
            })}
          {!pending.length && <div style={{ textAlign: "center", padding: "32px", color: T.txtX, fontSize: 13 }}>Nenhuma atividade pendente.</div>}
        </div>)}

      {dView === "kanban" && (<div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 4 }}>
          {DASH_GROUPS.map(([st, label]) => {
                const gActs = sortByDate(pending.filter(a => a.status === st));
                const { bg, dot } = ss(st);
                return (<div key={st} style={{ width: 270, flexShrink: 0 }}>
                <div style={{ padding: "8px 12px", borderRadius: T.radS, background: bg, marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: dot, flexShrink: 0 }}/>
                  <span style={{ fontWeight: 700, fontSize: 12, color: "#4b5563", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</span>
                  <span style={{ fontSize: 11, background: "rgba(255,255,255,.8)", color: "#4b5563", padding: "1px 8px", borderRadius: 20, fontWeight: 700, flexShrink: 0 }}>{gActs.length}</span>
                </div>
                {gActs.map(a => (<div key={a.id} onClick={() => onOpen(a)} style={{ ...CARD, padding: "12px 14px", marginBottom: 8, cursor: "pointer", transition: "box-shadow .15s, border-left-color .15s", borderLeft: "4px solid #e2e8f0" }} onMouseEnter={e => { e.currentTarget.style.boxShadow = T.shadowM; e.currentTarget.style.borderLeftColor = "#94a3b8"; }} onMouseLeave={e => { e.currentTarget.style.boxShadow = T.shadow; e.currentTarget.style.borderLeftColor = "#e2e8f0"; }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.client || "—"}</div>
                      {a.clientCategory && <Av category={a.clientCategory} size={23}/>}
                    </div>
                    <div style={{ fontSize: 11, color: T.txtM, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{actLabel(a)}{a.city ? " · " + a.city : ""}</div>
                    {a.departmentContact && <div style={{ fontSize: 12, fontWeight: 500, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 1 }}>{a.departmentContact}</div>}
                    {a.department && <div style={{ fontSize: 12, fontWeight: 500, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 6 }}>{a.department}</div>}
                    {!a.department && !a.departmentContact && <div style={{ marginBottom: 6 }}/>}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: T.txtX }}>{a.startDate}</span>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 9, fontWeight: 600, color: T.txtX, textTransform: "uppercase", letterSpacing: ".06em" }}>Valor</div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{money(a.value)}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                      {PREV_ST[a.status] && (<button onClick={e => { e.stopPropagation(); onStatusChange(a.id, PREV_ST[a.status]); }} style={{ background: "#f1f5f9", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 11, color: T.txtM }}>‹ Voltar</button>)}
                      {NEXT_ST[a.status] && (<button onClick={e => { e.stopPropagation(); handleAdvance(a.id, NEXT_ST[a.status]); }} style={{ background: (NEXT_BTN_CLR[a.status] || { bg: T.priL }).bg, border: `1px solid ${(NEXT_BTN_CLR[a.status] || { border: T.priB }).border}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 11, color: "#4b5563", fontWeight: 600 }}>
                          {NEXT_LABEL[NEXT_ST[a.status]] || NEXT_ST[a.status]} ›
                        </button>)}
                    </div>
                  </div>))}
                {!gActs.length && <div style={{ padding: "18px 10px", textAlign: "center", fontSize: 12, color: T.txtX, background: T.bg, borderRadius: T.radS, border: `1px dashed ${T.border}` }}>Nenhuma</div>}
              </div>);
            })}
        </div>)}
    </div>);
}
// ── MAIN APP ───────────────────────────────────────────────
const LOGO_SRC = "data:image/png;base64,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";
export default function GestaoFacil() {
    const [page, setPage] = useState("login");
    const [sidebar, setSide] = useState(true);
    const [cCatFil, setCCatFil] = useState("all");
    const [cView, setCView] = useState("kanban");
    const [aView, setAView] = useState("kanban");
    const [calV, setCalV] = useState("weekly");
    const [aFil, setAFil] = useState("all");
    const [contacts, setC] = useState(() => C0);
    const [activities, setA] = useState(() => A0);
    const [wk, setWk] = useState(0);
    const [mo, setMo] = useState(new Date().getFullYear() >= 2026 ? new Date().getMonth() : 0);
    const [yr, setYr] = useState(Math.max(new Date().getFullYear(), 2026));
    const [cModal, setCModal] = useState(null);
    const [aModal, setAModal] = useState(null);
    const [mImp, setMImp] = useState(false);
    const [mExp, setMExp] = useState(null);
    const [mFin, setMFin] = useState(null);
    const [leads, setLeads] = useState(() => []);
    const [dataLoaded, setDataLoaded] = useState(false);
    useEffect(() => {
        (async () => {
            try {
                const [cRes, aRes, lRes] = await Promise.all([
                    window.storage.get("gf-contacts").catch(() => null),
                    window.storage.get("gf-activities").catch(() => null),
                    window.storage.get("gf-leads").catch(() => null),
                ]);
                if (cRes?.value) setC(JSON.parse(cRes.value));
                if (aRes?.value) setA(JSON.parse(aRes.value));
                if (lRes?.value) setLeads(JSON.parse(lRes.value));
            } catch (e) { } finally { setDataLoaded(true); }
        })();
    }, []);
    const [lModal, setLModal] = useState(null);
    const [lView, setLView] = useState("kanban");
    const [loading, setLoading] = useState(false);
    useEffect(() => { if (dataLoaded) window.storage.set("gf-contacts", JSON.stringify(contacts)).catch(() => {}); }, [contacts, dataLoaded]);
    useEffect(() => { if (dataLoaded) window.storage.set("gf-activities", JSON.stringify(activities)).catch(() => {}); }, [activities, dataLoaded]);
    useEffect(() => { if (dataLoaded) window.storage.set("gf-leads", JSON.stringify(leads)).catch(() => {}); }, [leads, dataLoaded]);
    useEffect(() => {
        if (page === "login")
            return;
        setLoading(true);
        const t = setTimeout(() => setLoading(false), 520);
        return () => clearTimeout(t);
    }, [page]);
    const [lastBackupTs, setLastBackupTs] = useState(null);
    useEffect(() => { window.storage.get("gf-lastBackup").then(r => { if (r?.value) setLastBackupTs(r.value); }).catch(() => {}); }, []);
    const backupDue = useMemo(() => {
        return !lastBackupTs || ((Date.now() - new Date(lastBackupTs).getTime()) > 7 * 24 * 60 * 60 * 1000);
    }, [lastBackupTs]);
    // ── BACKUP AUTOMÁTICO SEMANAL ──────────────────────────────
    // Dispara automaticamente ao abrir o app se já faz 7 dias desde o último backup
    useEffect(() => {
        if (page === "login")
            return;
        if (!backupDue)
            return;
        // Pequeno delay para garantir que o app carregou completamente
        const t = setTimeout(() => {
            doBackup();
        }, 1500);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);
    const fin = useMemo(() => {
        const totBruto = activities.reduce((s, a) => s + (a.value || 0), 0);
        const totTax = activities.reduce((s, a) => s + (a.value || 0) * Math.max(a.tax || 0, 10) / 100, 0);
        const totExp = activities.reduce((s, a) => s + (a.expenses || []).reduce((ss, e) => ss + (parseFloat(e.valor) || 0), 0), 0);
        return {
            totBruto, totTax, totExp, totNet: totBruto - totTax - totExp,
            aRec: activities.filter(a => a.status !== "Realizado").reduce((s, a) => s + (a.value || 0), 0),
        };
    }, [activities]);
    const saveC = useCallback(() => {
        if (!cModal?.name)
            return;
        const item = { ...cModal };
        if (!item.id)
            item.id = Date.now();
        if (cModal.id)
            setC(p => p.map(c => c.id === cModal.id ? item : c));
        else
            setC(p => [...p, item]);
        setCModal(null);
    }, [cModal]);
    const delC = useCallback((id) => { setC(p => p.filter(c => c.id !== id)); setCModal(null); }, []);
    const saveA = useCallback(() => {
        const types = aModal?.types || [];
        if (!types.length)
            return;
        // Derive startDate/endDate/startTime/endTime/format from typeSchedules
        const scheds = aModal.typeSchedules || {};
        let derivedStart = "", derivedEnd = "", derivedStartTime = "", derivedEndTime = "", derivedFormat = "";
        for (const t of types) {
            const s = scheds[t] || {};
            if (!derivedFormat && s.format)
                derivedFormat = s.format;
            if (t === "Curso Avançado Online 10h" && s.format === "Presencial") {
                const ds = (s.dates || []).filter((d) => d.date);
                if (ds.length) {
                    if (!derivedStart) {
                        derivedStart = iso2br(ds[0].date);
                        derivedStartTime = ds[0].startTime || "";
                    }
                    derivedEnd = iso2br(ds[ds.length - 1].date);
                    derivedEndTime = ds[ds.length - 1].endTime || "";
                }
            }
            else {
                if (s.startDate && !derivedStart) {
                    derivedStart = iso2br(s.startDate);
                    derivedStartTime = s.startTime || "";
                }
                if (s.startDate) {
                    derivedEnd = iso2br(s.endDate || s.startDate);
                    derivedEndTime = s.endTime || "";
                }
            }
        }
        // Sum values and use first tax from typeSchedules
        const scheds2 = aModal.typeSchedules || {};
        const totalValue = types.reduce((s, t) => s + (parseFloat(scheds2[t]?.value) || 0), 0);
        const firstTax = parseFloat(scheds2[types[0]]?.tax) || parseFloat(aModal.tax) || 10;
        const item = {
            ...aModal,
            types,
            type: types[0],
            value: totalValue || parseFloat(aModal.value) || 0,
            tax: firstTax,
            startDate: derivedStart || fmtD(aModal.startDate),
            endDate: derivedEnd || derivedStart || fmtD(aModal.startDate),
            startTime: derivedStartTime || aModal.startTime,
            endTime: derivedEndTime || aModal.endTime,
            format: derivedFormat || aModal.format,
        };
        if (!item.id)
            item.id = Date.now();
        if (aModal.id)
            setA((p) => p.map(a => a.id === aModal.id ? { ...item, expenses: a.expenses } : a));
        else
            setA((p) => [...p, { ...item, expenses: [] }]);
        // Auto-adicionar empresa em Contatos se ainda não existir
        if (item.client && item.client.trim()) {
            setC((prev) => {
                const exists = prev.some((c) => c.name.trim().toLowerCase() === item.client.trim().toLowerCase());
                if (exists)
                    return prev;
                const novoContato = {
                    id: Date.now() + 1,
                    name: item.client.trim(),
                    contactName: "",
                    category: item.clientCategory || "Privado",
                    email: "",
                    phone: "",
                    whatsapp: "",
                    city: item.city || "",
                    state: item.state || "",
                    notes: "",
                    departments: [],
                    pagRazaoSocial: "", pagName: "", pagEmail: "", pagWhatsapp: "",
                    pagPhone: "", pagEndereco: "", pagCNPJ: "", pagInscMunicipal: "", pagInscEstadual: ""
                };
                return [...prev, novoContato];
            });
        }
        setAModal(null);
    }, [aModal]);
    const delA = useCallback((id) => { setA(p => p.filter(a => a.id !== id)); setAModal(null); }, []);
    const openA = useCallback((a) => setAModal({
        ...a,
        types: a.types && a.types.length > 0 ? a.types : (a.type ? [a.type] : []),
        value: String(a.value),
        tax: String(a.tax),
        startDate: br2iso(a.startDate),
        endDate: br2iso(a.endDate),
    }), []);
    const saveExp = useCallback((actId, items) => {
        setA(p => p.map(a => a.id === actId ? { ...a, expenses: items } : a));
    }, []);
    // ── CONVERTER LEAD EM ATIVIDADE ────────────────────────
    // Quando lead status muda para "Proposta Enviada", cria atividade e vai para Atividades
    const convertLeadToActivity = useCallback((lead) => {
        const newActivity = {
            id: Date.now(),
            types: [],
            type: "",
            format: "Presencial",
            client: lead.organization || "",
            clientCategory: "",
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            city: "",
            state: "",
            status: "Proposta Enviada",
            value: 0,
            tax: 10,
            expenses: [],
            notes: lead.notes || "",
        };
        setA(p => [...p, newActivity]);
        // Atualiza o lead para marcar como convertido
        setLeads(p => p.map(l => l.id === lead.id ? { ...l, status: "Proposta Enviada" } : l));
        setLModal(null);
        // Abre direto o modal de edição da nova atividade para completar os dados
        setAModal({
            ...newActivity,
            value: "",
            tax: "10",
            startDate: "",
            endDate: "",
        });
        setPage("activities");
    }, []);
    // ── LEADS (Em Conversa) ──────────────────────────────────
    const todayBR = useCallback(() => { const d = new Date(); return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear(); }, []);
    const saveLead = useCallback(() => {
        if (!lModal?.organization)
            return;
        const existing = leads.find((l) => l.id === lModal.id);
        const history = lModal.statusHistory || [];
        let newHistory = [...history];
        if (!lModal.id) {
            // New lead: record initial status
            newHistory = [{ status: lModal.status, date: todayBR() }];
        }
        else if (existing && existing.status !== lModal.status) {
            // Status changed: append new entry
            newHistory = [...newHistory, { status: lModal.status, date: todayBR() }];
        }
        const item = { ...lModal, id: lModal.id || Date.now(), statusHistory: newHistory };
        if (lModal.id) {
            setLeads((prev) => prev.map((l) => l.id === item.id ? item : l));
        }
        else {
            setLeads((prev) => [...prev, item]);
        }
        setLModal(null);
    }, [lModal, leads, todayBR]);
    const saveLeadAndConvert = useCallback(() => {
        if (!lModal?.organization)
            return;
        const existing = leads.find((l) => l.id === lModal.id);
        const history = lModal.statusHistory || [];
        let newHistory = [...history];
        if (!lModal.id) {
            newHistory = [{ status: "Aguardando Proposta", date: todayBR() }, { status: "Proposta Enviada", date: todayBR() }];
        }
        else if (existing && existing.status !== "Proposta Enviada") {
            newHistory = [...newHistory, { status: "Proposta Enviada", date: todayBR() }];
        }
        const item = { ...lModal, status: "Proposta Enviada", id: lModal.id || Date.now(), statusHistory: newHistory };
        if (lModal.id) {
            setLeads((prev) => prev.map((l) => l.id === item.id ? item : l));
        }
        else {
            setLeads((prev) => [...prev, item]);
        }
        setLModal(null);
        convertLeadToActivity(item);
    }, [lModal, leads, todayBR, convertLeadToActivity]);
    const delLead = useCallback((id) => { setLeads((p) => p.filter((l) => l.id !== id)); setLModal(null); }, []);
    // ── BACKUP ──
    const doBackup = useCallback(() => {
        const ws1 = XLSX.utils.json_to_sheet(contacts.map(ct => ({
            "Organização": ct.name, "Responsável": ct.contactName, "Categoria": ct.category,
            "E-mail": ct.email, "Telefone": ct.phone, "WhatsApp": ct.whatsapp,
            "Cidade": ct.city, "UF": ct.state, "Observações": ct.notes,
            "Razão Social": ct.pagRazaoSocial || "", "Pag. Nome": ct.pagName || "", "Pag. E-mail": ct.pagEmail || "",
            "Pag. WhatsApp": ct.pagWhatsapp || "", "CNPJ": ct.pagCNPJ || "",
            "Insc. Municipal": ct.pagInscMunicipal || "", "Insc. Estadual": ct.pagInscEstadual || "",
            "Endereço": ct.pagEndereco || ""
        })));
        const ws2 = XLSX.utils.json_to_sheet(sortByDate(activities).map(a => ({
            "Modalidade": a.type, "Formato": a.format, "Cliente": a.client,
            "Data Início": a.startDate, "Data Fim": a.endDate, "Horário": a.startTime + "-" + a.endTime,
            "Cidade": a.city, "UF": a.state, "Status": a.status,
            "Valor": a.value,
            "Despesas": ((a.expenses || []).reduce((s, e) => s + (parseFloat(e.valor) || 0), 0)),
            "Observações": a.notes
        })));
        const ws3 = XLSX.utils.json_to_sheet(leads.map(l => ({
            "Organização": l.organization, "Contato": l.contactName, "Canal": l.canal,
            "Status": l.status, "Data Início": l.startDate, "Follow-up": l.followUp, "Anotações": l.notes
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws1, "Contatos");
        XLSX.utils.book_append_sheet(wb, ws2, "Atividades");
        XLSX.utils.book_append_sheet(wb, ws3, "Em Conversa");
        const d = new Date();
        XLSX.writeFile(wb, `backup-gestao-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}.xlsx`);
        const iso = d.toISOString();
        window.storage.set("gf-lastBackup", iso).catch(() => {});
        setLastBackupTs(iso);
    }, [contacts, activities, leads]);
    const todayReal = useMemo(() => new Date(), []);
    const base = useMemo(() => {
        const d = new Date(todayReal);
        d.setDate(d.getDate() - d.getDay());
        return d;
    }, [todayReal]);
    const wDays = useMemo(() => Array.from({ length: 7 }, (_, i) => {
        const d = new Date(base);
        d.setDate(d.getDate() + i + wk * 7);
        return d;
    }), [base, wk]);
    const nav = [
        { id: "dashboard", label: "Visão Geral", ic: LayoutDashboard },
        { id: "activities", label: "Atividades", ic: BookOpen },
        { id: "leads", label: "Em Conversa", ic: MessageCircle },
        { id: "calendar", label: "Calendário", ic: Calendar },
        { id: "contacts", label: "Contatos", ic: Users },
    ];
    const fActs = sortByDate(activities.filter(a => aFil === "all" || a.status === aFil));
    // ── LOGIN ──
    if (page === "login")
        return (<><style>{FONT_STYLE}</style>
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f0f0" }}>
      <div style={{ background: "#ffffff", borderRadius: T.radL, padding: "80px 96px", width: "100%", maxWidth: 640, boxShadow: T.shadowL, display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
        <img src={LOGO_SRC} alt="Comunica Simples" style={{ width: 340, display: "block" }}/>
        <button onClick={() => setPage("dashboard")} style={{ background: T.pri, color: "#ffffff", border: "none", borderRadius: T.radS, padding: "12px 40px", fontSize: 15, fontWeight: 500, cursor: "pointer", letterSpacing: ".03em", transition: "background .15s" }} onMouseEnter={e => { e.currentTarget.style.background = T.priHov; }} onMouseLeave={e => { e.currentTarget.style.background = T.pri; }}>
          Entrar
        </button>
      </div>
    </div></>);
    return (<><style>{FONT_STYLE}</style>
    <div style={{ display: "flex", height: "100vh", background: T.bg, fontFamily: "'Inter',system-ui,sans-serif", overflow: "hidden" }}>

      {/* SIDEBAR */}
      <aside style={{ width: sidebar ? 210 : 58, background: "#f2f3f5", borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0, transition: "width .2s ease", overflow: "hidden" }}>
        <div style={{ padding: "0 14px", height: 60, display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
          {sidebar
            ? <div style={{ display: "flex", alignItems: "center" }}><img src={LOGO_SRC} alt="Comunica Simples" style={{ height: 44, objectFit: "contain" }}/></div>
            : <div style={{ width: 32, height: 32, borderRadius: 8, background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontWeight: 800, fontSize: 10, color: "#1e3a8a" }}>CS</span></div>}
        </div>
        <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map(({ id, label, ic: Ic }) => {
            const on = page === id;
            return (<button key={id} onClick={() => setPage(id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: T.radS, border: "none", background: on ? T.priL : "transparent", color: on ? T.pri : T.txtM, cursor: "pointer", fontSize: 13, fontWeight: on ? 600 : 400, width: "100%", transition: "all .15s", textAlign: "left" }}>
                <Ic size={16} style={{ flexShrink: 0, color: on ? T.pri : T.txtX }}/>{sidebar && <span style={{ whiteSpace: "nowrap" }}>{label}</span>}
                {on && sidebar && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: T.pri }}/>}
              </button>);
        })}
        </nav>
        <div style={{ padding: "8px 8px", borderTop: `1px solid ${T.border}` }}>
          <button onClick={() => setSide(!sidebar)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: T.radS, border: "none", background: "transparent", color: T.txtX, cursor: "pointer", fontSize: 12, width: "100%" }}>
            <ChevronRight size={13} style={{ transform: sidebar ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }}/>{sidebar && "Recolher"}
          </button>
          <button onClick={() => setPage("login")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: T.radS, border: "none", background: "transparent", color: "#ef4444", cursor: "pointer", fontSize: 12, width: "100%" }}>
            <LogOut size={13} style={{ flexShrink: 0 }}/>{sidebar && "Sair"}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: 28, minWidth: 0 }}>

        {/* DASHBOARD */}
        {page === "dashboard" && (<div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <SectionHeader title="Visão Geral" actions={[
                <div key="bk" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {backupDue && (<span style={{ fontSize: 12, fontWeight: 600, color: '#475569', background: '#ffffff', padding: '7px 14px', borderRadius: 8, border: '1.5px solid #e8edf3', boxShadow: '0 2px 8px rgba(0,0,0,.05)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fcd34d', flexShrink: 0 }}/>Backup Pendente
                  </span>)}
                <Btn ghost onClick={doBackup}><Download size={13}/>Backup Completo</Btn>
              </div>
            ]}/>
            {loading ? (<div style={{ ...CARD, padding: 24, marginBottom: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                  <SkeletonLine w={180} h={18}/>
                  <SkeletonLine w={100} h={28}/>
                </div>
                {Array(4).fill(0).map((_, i) => (<div key={i} style={{ display: "grid", gridTemplateColumns: "52px 1px 1fr auto", gap: "0 14px", alignItems: "center", padding: "12px 6px", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ textAlign: "center" }}><SkeletonLine w={40} h={40}/></div>
                    <div style={{ width: 1, height: 36, background: "#e8edf3" }}/>
                    <div><SkeletonLine w="70%" h={14} mb={6}/><SkeletonLine w="45%" h={11}/></div>
                    <SkeletonLine w={80} h={28}/>
                  </div>))}
              </div>) : (<>
                <ProximasAtividades activities={activities} onOpen={openA} onStatusChange={(id, st) => { setA(p => p.map(a => a.id === id ? { ...a, status: st } : a)); setAFil("all"); }} onVerTodas={() => setPage("activities")}/>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 22 }}>
                  <MetricCard label="Atividades" value={String(activities.length)} sub={activities.filter(a => a.status === "Confirmado").length + " confirmadas"} cardBg="#eff6ff" iconBg="rgba(255,255,255,.8)" iconColor={T.pri} Icon={BookOpen}/>
                  <MetricCard label="A Receber" value={money(fin.aRec)} sub="Atividades pendentes" cardBg="#fffbeb" iconBg="rgba(255,255,255,.8)" iconColor="#d97706" Icon={DollarSign}/>
                </div>
              </>)}
          </div>)}

        {/* CONTATOS */}
        {page === "contacts" && (() => {
            const exportContacts = () => {
                const filt = contacts.filter(ct => cCatFil === "all" || ct.category === cCatFil);
                const ws1 = XLSX.utils.json_to_sheet(filt.map(ct => ({
                    "Organização": ct.name, "Responsável": ct.contactName, "Categoria": ct.category,
                    "E-mail": ct.email, "Telefone": ct.phone, "WhatsApp": ct.whatsapp,
                    "Cidade": ct.city, "UF": ct.state, "Observações": ct.notes,
                    "Razão Social": ct.pagRazaoSocial || "", "Pag. Nome": ct.pagName || "", "Pag. E-mail": ct.pagEmail || "",
                    "Pag. WhatsApp": ct.pagWhatsapp || "", "Pag. Telefone": ct.pagPhone || "",
                    "CNPJ": ct.pagCNPJ || "", "Insc. Municipal": ct.pagInscMunicipal || "",
                    "Insc. Estadual": ct.pagInscEstadual || "", "Endereço": ct.pagEndereco || ""
                })));
                const deptRows = filt.flatMap((ct) => (ct.departments || []).map((d) => ({
                    "Organização": ct.name, "Departamento": d.name, "Contratante": d.contactName,
                    "E-mail": d.email, "WhatsApp": d.whatsapp || ""
                })));
                const ws2 = XLSX.utils.json_to_sheet(deptRows.length ? deptRows : [{ "Organização": "(nenhum departamento cadastrado)" }]);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws1, "Contatos");
                XLSX.utils.book_append_sheet(wb, ws2, "Departamentos");
                XLSX.writeFile(wb, `contatos${cCatFil !== "all" ? "-" + cCatFil : ""}.xlsx`);
            };
            const fContacts = contacts.filter(ct => cCatFil === "all" || ct.category === cCatFil);
            return (<div>
              <SectionHeader title="Contatos" actions={[
                    <Btn key="exp" ghost onClick={exportContacts}><Download size={14}/>Exportar</Btn>,
                    <Btn key="imp" ghost onClick={() => setMImp(true)}><Upload size={14}/>Importar</Btn>,
                    <Btn key="new" onClick={() => setCModal({ ...BLANK_C })}><Plus size={14}/>Novo Contato</Btn>
                ]}/>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", overflowX: "auto", paddingBottom: 2 }}>
                <div style={{ display: "flex", gap: 2, background: T.surface, boxShadow: T.shadow, borderRadius: T.radS, padding: 3, flexShrink: 0 }}>
                {[["all", "Todos"], ["Público", "Público"], ["Privado", "Privado"], ["Outros", "Outros"]].map(([v, l]) => (<button key={v} onClick={() => setCCatFil(v)} style={{ background: cCatFil === v ? T.pri : "transparent", color: cCatFil === v ? "#fff" : T.txtM, border: "none", padding: "6px 10px", borderRadius: T.radS, fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s" }}>
                    {l} {v !== "all" ? `(${contacts.filter(c => c.category === v).length})` : ``}
                  </button>))}
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 2, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radS, padding: 3, flexShrink: 0 }}>
                  {[["list", <List size={13}/>], ["kanban", <Columns size={13}/>]].map(([v, ic]) => (<button key={v} onClick={() => setCView(v)} style={{ padding: "6px 8px", borderRadius: 6, border: "none", background: cView === v ? T.pri : "transparent", color: cView === v ? "#fff" : T.txtX, cursor: "pointer", display: "flex", alignItems: "center" }}>{ic}</button>))}
                </div>
              </div>
              {!loading && cView === "list" && (<div style={{ ...CARD, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>{["Organização", "Responsável", "E-mail", "Telefone", "Local", "Dados Fin."].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {fContacts.length === 0
                        ? <tr><td colSpan={6} style={{ ...TD, textAlign: "center", padding: "48px", color: T.txtX }}>Nenhum contato.</td></tr>
                        : fContacts.map(ct => (<tr key={ct.id} onClick={() => setCModal({ ...ct })} style={{ cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = T.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>
                            <td style={{ ...TD, paddingLeft: 16 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <Av category={ct.category} size={32}/>
                                <div>
                                  <div style={{ fontWeight: 600, color: T.txt, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                                    {ct.name}
                                    {(ct.mainDepartment || (ct.departments && ct.departments.length > 0)) && (<span style={{ fontSize: 10, fontWeight: 500, color: T.txtM, background: T.bg, borderRadius: 4, padding: "1px 6px", flexShrink: 0 }}>
                                        {ct.mainDepartment || ct.departments[0].name}
                                      </span>)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ ...TD, fontSize: 12 }}>{ct.contactName || "—"}</td>
                            <td style={{ ...TD, fontSize: 12, color: T.txtM }}>{ct.email || "—"}</td>
                            <td style={{ ...TD, fontSize: 12, color: T.txtM }}>{ct.whatsapp || ct.phone || "—"}</td>
                            <td style={{ ...TD, fontSize: 12, color: T.txtM }}>{[ct.city, ct.state].filter(Boolean).join(" - ") || "—"}</td>
                            <td style={{ ...TD, paddingRight: 16 }}>
                              <button onClick={e => { e.stopPropagation(); setMFin(ct); }} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: T.radS, border: `1px solid ${ct.pagCNPJ || ct.pagRazaoSocial ? "#86efac" : T.border}`, background: ct.pagCNPJ || ct.pagRazaoSocial ? "#f0fdf4" : T.bg, color: ct.pagCNPJ || ct.pagRazaoSocial ? "#16a34a" : T.txtM, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                                <Wallet size={10}/>{ct.pagCNPJ || ct.pagRazaoSocial ? "Dados ✓" : "Dados"}
                              </button>
                            </td>
                          </tr>))}
                    </tbody>
                  </table>
                </div>)}
              {!loading && cView === "kanban" && (<div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
                  {[["Público", "Público"], ["Privado", "Privado"], ["Outros", "Outros"]].filter(([v]) => cCatFil === "all" || cCatFil === v).map(([cat, label]) => {
                        const col = fContacts.filter(c => c.category === cat);
                        return (<div key={cat} style={{ width: 280, flexShrink: 0 }}>
                        <div style={{ padding: "8px 12px", borderRadius: T.radS, background: CAT_BG[cat] || T.bg, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: CAT_CLR[cat] || T.pri, flexShrink: 0 }}/>
                          <span style={{ fontWeight: 700, fontSize: 11, color: CAT_TX[cat] || T.txtS, flex: 1, textTransform: "uppercase", letterSpacing: ".07em" }}>{label}</span>
                          <span style={{ fontSize: 10, background: "rgba(255,255,255,.8)", color: CAT_TX[cat] || T.txtS, padding: "1px 7px", borderRadius: 20, fontWeight: 700 }}>{col.length}</span>
                        </div>
                        {col.map(ct => (<div key={ct.id} onClick={() => setCModal({ ...ct })} style={{ ...CARD, padding: "12px 14px", marginBottom: 8, cursor: "pointer", transition: "box-shadow .15s", borderLeft: `3px solid ${CAT_CLR[ct.category] || T.pri}` }} onMouseEnter={e => e.currentTarget.style.boxShadow = T.shadowM} onMouseLeave={e => e.currentTarget.style.boxShadow = T.shadow}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                              <Av category={ct.category} size={28}/>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 14, color: T.txt, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 4 }}>{ct.name}</div>
                                {ct.contactName && <div style={{ fontSize: 13, color: T.txtM }}>{ct.contactName}</div>}
                                {(ct.mainDepartment || (ct.departments && ct.departments.length > 0)) && (<div style={{ fontSize: 12, color: T.txtM, marginTop: 1, display: "flex", alignItems: "center", gap: 4 }}>
                                    {ct.mainDepartment || ct.departments[0].name}
                                  </div>)}
                              </div>
                            </div>
                            {[ct.email, ct.phone || ct.whatsapp, [ct.city, ct.state].filter(Boolean).join(" - ")].map((t, i) => t ? (<div key={i} style={{ display: "flex", gap: 7, fontSize: 12, color: T.txtM, marginBottom: 4, alignItems: "center" }}>
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t}</span>
                              </div>) : null)}
                            <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.borderS}`, display: "flex", justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                              <button onClick={e => { e.stopPropagation(); setMFin(ct); }} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: T.radS, border: `1px solid ${ct.pagCNPJ || ct.pagRazaoSocial ? "#86efac" : T.border}`, background: ct.pagCNPJ || ct.pagRazaoSocial ? "#f0fdf4" : T.bg, color: ct.pagCNPJ || ct.pagRazaoSocial ? "#16a34a" : T.txtM, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                                <Wallet size={10}/>{ct.pagCNPJ || ct.pagRazaoSocial ? "Dados Financeiros ✓" : "Dados Financeiros"}
                              </button>
                            </div>
                          </div>))}
                      </div>);
                    })}
                </div>)}
            </div>);
        })()}

        {/* ATIVIDADES */}
        {page === "activities" && (<div>
            <SectionHeader title="Atividades" actions={[<Btn key="new" onClick={() => setAModal({ ...BLANK_A })}><Plus size={14}/>Nova Atividade</Btn>]}/>
            <div style={{ display: "flex", gap: 8, marginBottom: 18, alignItems: "center", overflowX: "auto", paddingBottom: 2 }}>
              <div style={{ display: "flex", gap: 2, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radS, padding: 3, flexShrink: 0 }}>
                {[["all", "Todos"], ["Proposta Enviada", "Proposta"], ["Aguarda nota de empenho", "Aguarda Empenho"], ["Confirmado", "Confirmado"], ["Aguardando pagamento", "Aguarda Pgto"], ["Realizado", "Realizado"]].map(([v, l]) => (<button key={v} onClick={() => setAFil(v)} style={{ background: aFil === v ? T.pri : "transparent", color: aFil === v ? "#fff" : T.txtM, border: "none", padding: "6px 10px", borderRadius: T.radS, fontSize: 11, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s" }}>{l}</button>))}
              </div>
              <div style={{ display: "flex", gap: 2, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radS, padding: 3, marginLeft: "auto", flexShrink: 0 }}>
                {[["list", <List size={13}/>], ["kanban", <Columns size={13}/>]].map(([v, ic]) => (<button key={v} onClick={() => setAView(v)} style={{ padding: "6px 8px", borderRadius: 6, border: "none", background: aView === v ? T.pri : "transparent", color: aView === v ? "#fff" : T.txtX, cursor: "pointer", display: "flex", alignItems: "center" }}>{ic}</button>))}
              </div>
            </div>

            {loading && aView === "list" && (<div style={{ ...CARD, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
                  <thead><tr>{["Cliente / Modalidade", "Data", "Horário", "Local", "Formato", "Status", "Valor"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>{Array(6).fill(0).map((_, i) => <SkeletonRow key={i}/>)}</tbody>
                </table>
              </div>)}

            {!loading && aView === "list" && (<div style={{ ...CARD, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
                  <thead>
                    <tr>{["Cliente / Modalidade", "Data", "Horário", "Local", "Formato", "Status", "Valor"].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {fActs.length === 0
                    ? <tr><td colSpan={7} style={{ ...TD, textAlign: "center", padding: "48px", color: T.txtX }}>Nenhuma atividade encontrada.</td></tr>
                    : fActs.map(a => {
                        const loc = [a.city, a.state].filter(Boolean).join(" - ") || "—";
                        const FMT_P = { "Presencial": { bg: "#f0fdf4", cl: T.txtS }, "Online": { bg: "#dbeafe", cl: T.txtS }, "EAD": { bg: "#ede9fe", cl: T.txtS }, "Híbrido": { bg: "#fef3c7", cl: T.txtS } };
                        const fmtStyle = FMT_P[a.format] || { bg: "#f1f5f9", cl: T.txtS };
                        const typeColor = tClr(a.type);
                        return (<tr key={a.id} onClick={() => openA(a)} style={{ cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = T.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>
                              <td style={{ ...TD, paddingLeft: 20, maxWidth: 220 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.client || "—"}</div>
                                  {a.clientCategory && <Av category={a.clientCategory} size={21}/>}
                                </div>
                                <div style={{ fontSize: 11, color: T.txtM, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>{actLabel(a)}</div>
                                {a.departmentContact && <div style={{ fontSize: 12, fontWeight: 500, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>{a.departmentContact}</div>}
                                {a.department && <div style={{ fontSize: 12, fontWeight: 500, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>{a.department}</div>}
                              </td>
                              <td style={{ ...TD, whiteSpace: "nowrap", fontSize: 12 }}>{a.startDate}{a.endDate && a.endDate !== a.startDate ? <span style={{ color: T.txtX }}> → {a.endDate}</span> : null}</td>
                              <td style={{ ...TD, whiteSpace: "nowrap", fontSize: 12, color: T.txtM }}>{a.startTime} – {a.endTime}</td>
                              <td style={{ ...TD, fontSize: 12, color: T.txtM, whiteSpace: "nowrap" }}>{loc}</td>
                              <td style={TD}><span style={{ padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: fmtStyle.bg, color: fmtStyle.cl, whiteSpace: "nowrap" }}>{a.format}</span></td>
                              <td style={TD}><Badge s={a.status}/></td>
                              <td style={{ ...TD, whiteSpace: "nowrap" }}>
                                <div style={{ fontSize: 9, fontWeight: 600, color: T.txtX, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 1 }}>Valor</div>
                                <div style={{ fontWeight: 600, fontSize: 12, color: "#0f172a" }}>{money(a.value)}</div>
                              </td>
                            </tr>);
                    })}
                  </tbody>
                </table>
              </div>)}

            {!loading && aView === "kanban" && (<div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
                {ACT_ST.filter(st => aFil === "all" || st === aFil).map(st => {
                    const { bg } = ss(st);
                    const colActs = fActs.filter(a => a.status === st);
                    return (<div key={st} style={{ width: 260, flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 14px", borderRadius: T.radS, background: bg, boxShadow: "0 2px 8px rgba(0,0,0,.07)" }}>
                        <span style={{ fontWeight: 700, fontSize: 10, color: "#4b5563", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "uppercase", letterSpacing: ".07em", flex: 1 }}>{st}</span>
                        <span style={{ marginLeft: "auto", fontSize: 11, background: "rgba(255,255,255,.85)", color: "#4b5563", padding: "2px 8px", borderRadius: 20, fontWeight: 700, flexShrink: 0, minWidth: 20, textAlign: "center" }}>{colActs.length}</span>
                      </div>
                      {colActs.map(a => {
                            const expTotal = (a.expenses || []).reduce((s, e) => s + (parseFloat(e.valor) || 0), 0);
                            return (<div key={a.id} onClick={() => openA(a)} style={{ background: T.surface, borderRadius: T.rad, border: `1px solid ${T.border}`, borderLeft: "4px solid #cbd5e1", boxShadow: "0 2px 8px rgba(0,0,0,.06)", padding: 0, marginBottom: 10, cursor: "pointer", transition: "box-shadow .15s", overflow: "hidden" }} onMouseEnter={e => e.currentTarget.style.boxShadow = T.shadowM} onMouseLeave={e => e.currentTarget.style.boxShadow = T.shadow}>
                            <div style={{ padding: "10px 12px 0 12px", marginBottom: 4 }}>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.client || "—"}</div>
                                  {a.clientCategory && <Av category={a.clientCategory} size={23}/>}
                                </div>
                                {(a.types && a.types.length > 0 ? a.types : [a.type]).filter(Boolean).map((t, ti) => (<div key={ti} style={{ fontSize: 13, fontWeight: 500, color: T.txtM, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1 }}>{t}</div>))}
                                {a.departmentContact && <div style={{ fontSize: 12, fontWeight: 500, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{a.departmentContact}</div>}
                                {a.department && <div style={{ fontSize: 12, fontWeight: 500, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{a.department}</div>}
                              </div>
                            </div>
                            <div style={{ padding: "0 12px 10px 12px" }}>
                              <div style={{ fontSize: 12, color: T.txtS, marginBottom: 4 }}>
                                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                                  <span style={{ display: "flex", gap: 4, alignItems: "center" }}><Calendar size={11} style={{ color: T.txtX }}/>{a.startDate}</span>
                                </div>
                                {a.city && <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 4 }}><MapPin size={11} style={{ color: T.txtX }}/>{a.city}{a.state && " - " + a.state}</div>}
                                <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: { "Presencial": "#f0fdf4", "Online": "#dbeafe", "EAD": "#ede9fe", "Híbrido": "#fef3c7" }[a.format] || "#f1f5f9", color: T.txtS, border: "1px solid #e2e8f0" }}>{a.format}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: 4 }}>
                                <div style={{ textAlign: "right" }}>
                                  <div style={{ fontSize: 9, fontWeight: 600, color: T.txtX, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 1 }}>Valor</div>
                                  <div style={{ fontWeight: 400, fontSize: 12, color: "#0f172a" }}>{money(a.value)}</div>
                                </div>
                              </div>
                            </div>
                          </div>);
                        })}
                    </div>);
                })}
              </div>)}
          </div>)}

        {/* CALENDÁRIO */}
        {page === "calendar" && (<div>
            <SectionHeader title="Calendário" actions={[
                <div key="tabs" style={{ display: "flex", gap: 2, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radS, padding: 3 }}>
                {[["weekly", "Semana"], ["monthly", "Mês"], ["annual", "Ano"]].map(([v, l]) => <Pill key={v} label={l} active={calV === v} onClick={() => setCalV(v)}/>)}
              </div>,
                <Btn key="new" onClick={() => setAModal({ ...BLANK_A })}><Plus size={13}/>Nova</Btn>
            ]}/>
            {!loading && calV === "weekly" && (<div style={{ ...CARD, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: `1px solid ${T.borderS}`, background: "#f8fafc", borderRadius: `${T.rad} ${T.rad} 0 0` }}>
                  <button onClick={() => setWk(w => w - 1)} style={{ padding: "4px 8px", border: `1px solid ${T.border}`, borderRadius: T.radS, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center" }}><ChevronLeft size={13}/></button>
                  <span style={{ fontWeight: 600, fontSize: 13, color: T.txt }}>{wDays[0].getDate()} a {wDays[6].getDate()} de {MONTHS[wDays[0].getMonth()]} {wDays[0].getFullYear()}</span>
                  <button onClick={() => setWk(w => w + 1)} style={{ padding: "4px 8px", border: `1px solid ${T.border}`, borderRadius: T.radS, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center" }}><ChevronRight size={13}/></button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderBottom: `1px solid ${T.borderS}` }}>
                  {wDays.map((d, i) => {
                    const isToday = d.toDateString() === todayReal.toDateString();
                    return (<div key={i} style={{ padding: "10px 0", textAlign: "center", background: isToday ? T.priL : "transparent", borderRight: i < 6 ? `1px solid ${T.borderS}` : "none" }}>
                        <div style={{ fontSize: 10, color: T.txtX, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".06em" }}>{WDAYS[d.getDay()]}</div>
                        <div style={{ width: 30, height: 30, borderRadius: 9, background: isToday ? T.pri : "transparent", color: isToday ? "#fff" : T.txtS, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: 13, fontWeight: isToday ? 700 : 400 }}>{d.getDate()}</div>
                      </div>);
                })}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderTop: `1px solid ${T.borderS}` }}>
                  {wDays.map((d, i) => {
                    const da = activities.filter(a => {
                        const p = a.startDate.split("/");
                        return parseInt(p[0]) === d.getDate() && parseInt(p[1]) === d.getMonth() + 1 && parseInt(p[2]) === d.getFullYear();
                    });
                    return (<div key={i} style={{ minHeight: 170, padding: 6, borderRight: i < 6 ? `1px solid ${T.borderS}` : "none", display: "flex", flexDirection: "column", gap: 5 }}>
                        {da.map(a => {
                            const { bg } = tClr(a.type);
                            return (<div key={a.id} onClick={() => openA(a)} style={{ padding: "6px 8px", borderRadius: 7, background: bg, cursor: "pointer", marginBottom: 4 }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#1e293b", lineHeight: 1.3 }}>{actLabel(a)}</div>
                              <div style={{ fontSize: 9, color: "#374151", lineHeight: 1.3 }}>{a.client}</div>
                              <div style={{ fontSize: 9, color: "#475569", lineHeight: 1.3 }}>{a.startTime}–{a.endTime}</div>
                              {a.city && <div style={{ fontSize: 9, color: "#475569", lineHeight: 1.3 }}>{a.city}</div>}
                            </div>);
                        })}
                      </div>);
                })}
                </div>
              </div>)}
            {!loading && calV === "monthly" && (<div style={CARD}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: `1px solid ${T.borderS}`, background: "#f8fafc", borderRadius: `${T.rad} ${T.rad} 0 0` }}>
                  <button onClick={() => { if (mo === 0) {
                if (yr > 2026) {
                    setMo(11);
                    setYr(y => y - 1);
                }
            }
            else {
                setMo(m => m - 1);
            } }} style={{ padding: "4px 8px", border: `1px solid ${T.border}`, borderRadius: T.radS, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", opacity: (mo === 0 && yr <= 2026) ? 0.3 : 1 }} disabled={mo === 0 && yr <= 2026}><ChevronLeft size={13}/></button>
                  <span style={{ fontWeight: 600, fontSize: 13, color: T.txt }}>{MONTHS[mo]} {yr}</span>
                  <button onClick={() => { if (mo === 11) {
                setMo(0);
                setYr(y => y + 1);
            }
            else {
                setMo(m => m + 1);
            } }} style={{ padding: "4px 8px", border: `1px solid ${T.border}`, borderRadius: T.radS, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center" }}><ChevronRight size={13}/></button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: "#f8fafc", borderBottom: `1px solid ${T.borderS}` }}>
                  {WDAYS.map(d => <div key={d} style={{ padding: "8px", textAlign: "center", fontSize: 10, fontWeight: 600, color: T.txtX, textTransform: "uppercase", letterSpacing: ".06em" }}>{d}</div>)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
                  {Array.from({ length: fd1(mo, yr) }).map((_, i) => (<div key={"e" + i} style={{ minHeight: 110, borderBottom: `1px solid ${T.borderS}`, borderRight: `1px solid ${T.borderS}`, background: "#fafafa" }}/>))}
                  {Array.from({ length: dimM(mo, yr) }, (_, i) => i + 1).map(day => {
                    const da = activities.filter(a => {
                        const p = a.startDate.split("/");
                        return parseInt(p[0]) === day && parseInt(p[1]) === mo + 1 && parseInt(p[2]) === yr;
                    });
                    const isToday = day === todayReal.getDate() && mo === todayReal.getMonth() && yr === todayReal.getFullYear();
                    return (<div key={day} style={{ minHeight: 110, padding: "5px 6px", borderBottom: `1px solid ${T.borderS}`, borderRight: `1px solid ${T.borderS}`, background: isToday ? "#eff6ff" : T.surface, verticalAlign: "top" }} onMouseEnter={e => e.currentTarget.style.background = isToday ? "#dbeafe" : T.bg} onMouseLeave={e => e.currentTarget.style.background = isToday ? T.priL : T.surface}>
                        <div style={{ width: 22, height: 22, borderRadius: 7, background: isToday ? T.pri : "transparent", color: isToday ? "#fff" : T.txtM, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: isToday ? 700 : 400, marginBottom: 3 }}>{day}</div>
                        {da.map(a => {
                            const { bg } = tClr(a.type);
                            return (<div key={a.id} onClick={() => openA(a)} style={{ padding: "4px 5px", borderRadius: 5, background: bg, marginBottom: 3, cursor: "pointer" }}>
                              <div style={{ fontSize: 9, fontWeight: 700, color: "#1e293b", lineHeight: 1.3 }}>{actLabel(a)}</div>
                              <div style={{ fontSize: 8, color: "#374151", lineHeight: 1.2 }}>{a.client.split(" ").slice(0, 2).join(" ")}</div>
                            </div>);
                        })}
                      </div>);
                })}
                </div>
              </div>)}
            {!loading && calV === "annual" && (<div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", marginBottom: 12, background: T.surface, borderRadius: T.rad, border: `1px solid ${T.border}` }}>
                  <button onClick={() => { if (yr > 2026)
                setYr(y => y - 1); }} style={{ padding: "4px 8px", border: `1px solid ${T.border}`, borderRadius: T.radS, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center", opacity: yr <= 2026 ? 0.3 : 1 }} disabled={yr <= 2026}><ChevronLeft size={13}/></button>
                  <span style={{ fontWeight: 600, fontSize: 13, color: T.txt }}>{yr}</span>
                  <button onClick={() => setYr(y => y + 1)} style={{ padding: "4px 8px", border: `1px solid ${T.border}`, borderRadius: T.radS, background: T.surface, cursor: "pointer", display: "flex", alignItems: "center" }}><ChevronRight size={13}/></button>
                </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {MONTHS.map((mn, mi) => {
                    const fd = fd1(mi, yr), dc = dimM(mi, yr);
                    const mA = activities.filter(a => {
                        const p = a.startDate.split("/");
                        return parseInt(p[1]) === mi + 1 && parseInt(p[2]) === yr;
                    });
                    return (<div key={mi} style={{ ...CARD, cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.boxShadow = T.shadowM} onMouseLeave={e => e.currentTarget.style.boxShadow = T.shadow}>
                      <div style={{ padding: "8px 14px", borderBottom: `1px solid ${T.borderS}`, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: `${T.rad} ${T.rad} 0 0` }}>
                        <span style={{ fontWeight: 600, fontSize: 12, color: T.txt }}>{mn}</span>
                        {mA.length > 0 && <span style={{ fontSize: 10, fontWeight: 600, background: T.priL, color: T.pri, padding: "2px 7px", borderRadius: 20 }}>{mA.length} ativ.</span>}
                      </div>
                      <div style={{ padding: 10 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 3 }}>
                          {WDAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 7, color: "#cbd5e1", fontWeight: 600 }}>{d[0]}</div>)}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
                          {Array.from({ length: fd }).map((_, i) => <div key={i}/>)}
                          {Array.from({ length: dc }, (_, i) => i + 1).map(d => {
                            const h = mA.filter(a => parseInt(a.startDate.split("/")[0]) === d);
                            const hasAct = h.length > 0;
                            return (<div key={d} style={{ textAlign: "center", fontSize: 7, padding: "2px 0", borderRadius: 4, background: hasAct ? T.pri : "transparent", color: hasAct ? "#fff" : T.txtX, fontWeight: hasAct ? 700 : 400 }}>{d}</div>);
                        })}
                        </div>
                      </div>
                    </div>);
                })}
              </div>
              </div>)}
          </div>)}

        {/* EM CONVERSA */}
        {page === "leads" && (() => {
            const CANAL_CLR = { "Contato": "#dbeafe", "Atendimento": "#e0e7ff", "LinkedIn": "#dbeafe", "Instagram": "#fce7f3", "Indicação": "#fffbeb", "Outro": "#f1f5f9" };
            const CANAL_DOT = { "Contato": "#60a5fa", "Atendimento": "#818cf8", "LinkedIn": "#3b82f6", "Instagram": "#f472b6", "Indicação": "#fcd34d", "Outro": "#9ca3af" };
            const CANAL_ICO = { "Contato": "📞", "Atendimento": "🎧", "LinkedIn": "💼", "Instagram": "📸", "Indicação": "🤝", "Outro": "💬" };
            const stStyle = (st) => ({ "Aguardando Proposta": { bg: "#fffbeb", dot: "#fcd34d" }, "Proposta Enviada": { bg: "#f0fdf4", dot: "#86efac" }, "Em contratação": { bg: "#eff6ff", dot: "#93c5fd" }, "Encerrada": { bg: "#f1f5f9", dot: "#9ca3af" } })[st] || { bg: "#f1f5f9", dot: "#9ca3af" };
            const exportLeads = () => {
                const ws = XLSX.utils.json_to_sheet(leads.map(l => ({
                    "Organização": l.organization, "Contato": l.contactName, "Canal": l.canal,
                    "Status": l.status, "Data Início": l.startDate, "Follow-up": l.followUp, "Anotações": l.notes
                })));
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Conversas");
                XLSX.writeFile(wb, "conversas.xlsx");
            };
            return (<div>
              <SectionHeader title="Em Conversa" actions={[
                    <div key="views" style={{ display: "flex", gap: 2, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radS, padding: 3 }}>
                  {[["list", <List size={13}/>], ["kanban", <Columns size={13}/>]].map(([v, ic]) => (<button key={v} onClick={() => setLView(v)} style={{ padding: "6px 8px", borderRadius: 6, border: "none", background: lView === v ? T.pri : "transparent", color: lView === v ? "#fff" : T.txtX, cursor: "pointer", display: "flex", alignItems: "center" }}>{ic}</button>))}
                </div>,
                    <Btn key="exp" ghost onClick={exportLeads}><Download size={14}/>Exportar</Btn>,
                    <Btn key="new" onClick={() => setLModal({ ...BLANK_LEAD })}><Plus size={14}/>Nova Conversa</Btn>
                ]}/>
              {leads.length === 0 ? (<div style={{ ...CARD, padding: "60px 20px", textAlign: "center", color: T.txtX }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Nenhuma conversa em curso</div>
                  <div style={{ fontSize: 13 }}>Registre conversas antes de enviar uma proposta</div>
                </div>) : lView === "list" ? (<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {leads.map(l => {
                        const stSt = stStyle(l.status);
                        return (<div key={l.id} onClick={() => setLModal({ ...l, canal: CANAL_OPTS.includes(l.canal) ? l.canal : "Contato" })} style={{ ...CARD, padding: "16px 20px", cursor: "pointer", display: "grid", gridTemplateColumns: "1fr auto auto", gap: 16, alignItems: "start" }} onMouseEnter={e => e.currentTarget.style.boxShadow = T.shadowM} onMouseLeave={e => e.currentTarget.style.boxShadow = T.shadow}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: T.txt }}>{l.organization}</div>
                          {l.contactName && <div style={{ fontSize: 12, color: T.txtM, marginTop: 2 }}>{l.contactName}</div>}
                          {l.notes && <div style={{ fontSize: 12, color: T.txtS, marginTop: 6, padding: "6px 10px", background: T.bg, borderRadius: T.radS, borderLeft: "3px solid #e2e8f0" }}>{l.notes}</div>}
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          {l.startDate && <div style={{ fontSize: 11, color: T.txtX, marginTop: 4 }}>{l.startDate}</div>}
                        </div>
                        <div style={{ flexShrink: 0 }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: stSt.bg, color: "#4b5563", boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: stSt.dot }}/>{l.status}
                          </span>
                          {l.followUp && <div style={{ fontSize: 11, color: T.txtX, marginTop: 4 }}>↩ {l.followUp}</div>}
                        </div>
                      </div>);
                    })}
                </div>) : (<div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
                  {LEAD_ST.map(st => {
                        const stCfg = stStyle(st);
                        const col = leads.filter(l => l.status === st);
                        return (<div key={st} style={{ width: 260, flexShrink: 0 }}>
                        <div style={{ padding: "8px 12px", borderRadius: T.radS, background: stCfg.bg, marginBottom: 10, display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: stCfg.dot, flexShrink: 0 }}/>
                          <span style={{ fontWeight: 700, fontSize: 10, color: "#4b5563", flex: 1, textTransform: "uppercase", letterSpacing: ".06em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{st}</span>
                          <span style={{ fontSize: 10, background: "rgba(255,255,255,.8)", color: "#4b5563", padding: "1px 7px", borderRadius: 20, fontWeight: 700, flexShrink: 0 }}>{col.length}</span>
                        </div>
                        {col.map(l => {
                                return (<div key={l.id} onClick={() => setLModal({ ...l, canal: CANAL_OPTS.includes(l.canal) ? l.canal : "Contato" })} style={{ ...CARD, padding: "10px 12px", marginBottom: 8, cursor: "pointer", transition: "box-shadow .15s" }} onMouseEnter={e => e.currentTarget.style.boxShadow = T.shadowM} onMouseLeave={e => e.currentTarget.style.boxShadow = T.shadow}>
                              <div style={{ fontWeight: 700, fontSize: 13, color: T.txt, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.organization}</div>
                              {l.contactName && <div style={{ fontSize: 11, color: T.txtM, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.contactName}</div>}
                              {l.notes && <div style={{ fontSize: 11, color: T.txtS, padding: "5px 8px", background: T.bg, borderRadius: T.radS, borderLeft: "2px solid #e2e8f0", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.notes}</div>}
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                                {l.startDate && <span style={{ fontSize: 10, color: T.txtX }}>{l.startDate}</span>}
                                {l.followUp && <span style={{ fontSize: 10, color: T.txtM }}>↩ {l.followUp}</span>}
                              </div>
                            </div>);
                            })}
                        {!col.length && <div style={{ padding: "16px 10px", textAlign: "center", fontSize: 11, color: T.txtX, background: T.bg, borderRadius: T.radS, border: `1px dashed ${T.border}` }}>Nenhuma</div>}
                      </div>);
                    })}
                </div>)}

            </div>);
        })()}

      </main>
    </div>

    {/* MODAIS */}
    <ImportModal show={mImp} onClose={() => setMImp(false)} onImport={rows => setC(p => [...p, ...rows])}/>
    <ExpModal show={!!mExp} activity={mExp} onClose={() => setMExp(null)} onSave={saveExp}/>
    <FinanceModal show={!!mFin} contact={mFin} onClose={() => setMFin(null)} onEdit={ct => { setCModal({ ...ct }); }}/>

    <ContactModal show={!!cModal} contact={cModal} onClose={() => setCModal(null)} onChange={setCModal} onSave={saveC} onDelete={delC}/>

    {/* Modal Em Conversa */}
    <OLay show={!!lModal} onClose={() => setLModal(null)} wide>
      {lModal && (<>
          <MH title={lModal.id ? "Editar Conversa" : "Nova Conversa"} onClose={() => setLModal(null)}/>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={G2}>
              <FI label="Organização *" value={lModal.organization} onChange={e => setLModal({ ...lModal, organization: e.target.value })} ph="Nome da empresa"/>
              <FI label="Nome do Contato" value={lModal.contactName} onChange={e => setLModal({ ...lModal, contactName: e.target.value })} ph="Nome da pessoa"/>
            </div>
            <FI label="Departamento" value={lModal.department || ""} onChange={e => setLModal({ ...lModal, department: e.target.value })} ph="Ex: RH, Treinamento, Gestão de Pessoas..."/>
            <FS label="Status" value={lModal.status} onChange={e => setLModal({ ...lModal, status: e.target.value })} opts={LEAD_ST}/>
            <div style={G2}>
              <FI label="Data de Início" value={lModal.startDate} onChange={e => setLModal({ ...lModal, startDate: e.target.value })} type="date"/>
              <FI label="Follow-up previsto" value={lModal.followUp} onChange={e => setLModal({ ...lModal, followUp: e.target.value })} type="date"/>
            </div>
            <FI label="Anotações da conversa" value={lModal.notes} onChange={e => setLModal({ ...lModal, notes: e.target.value })} ph="Resumo da conversa, interesse demonstrado, próximos passos..." ml/>
          </div>

          {/* Histórico de Status */}
          {(() => {
                const HIST_CLR = {
                    "Aguardando Proposta": { bg: "#fffbeb", dot: "#fcd34d", border: "#fde68a" },
                    "Proposta Enviada": { bg: "#f0fdf4", dot: "#86efac", border: "#bbf7d0" },
                    "Em contratação": { bg: "#eff6ff", dot: "#93c5fd", border: "#bfdbfe" },
                    "Encerrada": { bg: "#f1f5f9", dot: "#94a3b8", border: "#e2e8f0" },
                };
                const history = lModal.statusHistory || [];
                const allSt = ["Aguardando Proposta", "Proposta Enviada", "Em contratação", "Encerrada"];
                const currentIdx = allSt.indexOf(lModal.status);
                return (<div style={{ marginTop: 16, background: T.bg, borderRadius: T.radS, padding: "14px 16px", border: `1px solid ${T.borderS}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.txtX, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>📋 Histórico de Status</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {allSt.map((st, idx) => {
                        const clr = HIST_CLR[st] || { bg: "#f1f5f9", dot: "#94a3b8", border: "#e2e8f0" };
                        const entry = history.find(h => h.status === st);
                        const isCurrent = lModal.status === st;
                        const isPast = idx < currentIdx;
                        const isFuture = idx > currentIdx && !entry;
                        return (<div key={st} style={{ display: "flex", alignItems: "stretch", gap: 12 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0 }}>
                          <div style={{ width: 14, height: 14, borderRadius: "50%", background: isFuture ? "#e2e8f0" : clr.dot, border: `2px solid ${isFuture ? "#cbd5e1" : clr.border}`, flexShrink: 0, marginTop: 2, boxShadow: isCurrent ? "0 0 0 3px " + clr.bg : "none" }}/>
                          {idx < allSt.length - 1 && <div style={{ width: 2, flex: 1, background: isFuture || (!entry && !isPast && !isCurrent) ? "#e2e8f0" : clr.dot, minHeight: 18, marginTop: 2, marginBottom: 2, opacity: .5 }}/>}
                        </div>
                        <div style={{ paddingBottom: idx < allSt.length - 1 ? 12 : 0, flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 500, color: isFuture ? T.txtX : T.txt }}>{st}</span>
                            {isCurrent && <span style={{ fontSize: 10, fontWeight: 700, background: clr.bg, color: "#4b5563", padding: "1px 7px", borderRadius: 20, border: `1px solid ${clr.border}` }}>atual</span>}
                          </div>
                          {entry ? (<div style={{ fontSize: 11, color: T.txtM, marginTop: 2 }}>📅 {entry.date}</div>) : isFuture ? (<div style={{ fontSize: 11, color: T.txtX, marginTop: 2 }}>—</div>) : null}
                        </div>
                      </div>);
                    })}
                </div>
              </div>);
            })()}

          {lModal.status === "Proposta Enviada" && (<div style={{ marginTop: 16, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: T.radS, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <CheckCircle2 size={16} style={{ color: "#16a34a", flexShrink: 0, marginTop: 1 }}/>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 2 }}>Proposta Enviada → Iniciar fluxo de contratação</div>
                <div style={{ fontSize: 11, color: "#15803d" }}>Ao confirmar, esta conversa será registrada em <b>Atividades</b> com status "Proposta Enviada" para seguir o fluxo de contratação.</div>
              </div>
            </div>)}

          <div style={{ display: "flex", gap: 8, marginTop: 22, justifyContent: "space-between", paddingTop: 16, borderTop: `1px solid ${T.borderS}` }}>
            <div>{lModal.id && <Btn danger onClick={() => delLead(lModal.id)}>Excluir</Btn>}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn ghost onClick={() => setLModal(null)}>Cancelar</Btn>
              {lModal.status === "Proposta Enviada" ? (<Btn onClick={saveLeadAndConvert}><CheckCircle2 size={13}/>Registrar Proposta em Atividades</Btn>) : (<Btn onClick={saveLead}>{lModal.id ? "Salvar" : "Registrar"}</Btn>)}
            </div>
          </div>
        </>)}
    </OLay>

    {/* Modal Atividade */}
    <OLay show={!!aModal} onClose={() => setAModal(null)} wide>
      {aModal && (<>
          <MH title={aModal.id ? "Editar Atividade" : "Nova Atividade"} onClose={() => setAModal(null)}/>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={LABEL_ST}>Modalidade * <span style={{ fontSize: 10, color: T.txtX, fontWeight: 400 }}>(múltipla seleção)</span></label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, background: "#f8fafc", border: `1.5px solid ${T.border}`, borderRadius: T.radS, padding: "10px 13px" }}>
                {MODALITIES.map(m => {
                const checked = (aModal.types || []).includes(m);
                const sched = (aModal.typeSchedules || {})[m] || { startDate: "", endDate: "", startTime: "", endTime: "", format: "Online", dates: [{ date: "", startTime: "", endTime: "" }, { date: "", startTime: "", endTime: "" }, { date: "", startTime: "", endTime: "" }] };
                const upS = (f) => setAModal({ ...aModal, typeSchedules: { ...(aModal.typeSchedules || {}), [m]: { ...sched, ...f } } });
                const upDate = (i, f) => { const ds = [...(sched.dates || [])]; while (ds.length <= i)
                    ds.push({ date: "", startTime: "", endTime: "" }); ds[i] = { ...ds[i], ...f }; upS({ dates: ds }); };
                const inpSt = { border: `1.5px solid ${T.border}`, borderRadius: 6, padding: "7px 9px", fontSize: 12, color: T.txt, background: "#fff", outline: "none", width: "100%", fontFamily: "'Inter',system-ui,sans-serif" };
                const hasFmt = ["Palestra", "Curso Básico 2h", "Curso Básico 3h", "Curso Avançado Online 10h", "Prática Coletiva Supervisionada", "Diagnóstico Padrão de Clareza", "Simplificação de Documentos"].includes(m);
                const isC20 = m === "Curso Avançado Online 10h";
                const isPCS = m === "Prática Coletiva Supervisionada";
                const isC20Pres = isC20 && sched.format === "Presencial";
                const isPCSOline = isPCS && sched.format === "Online";
                const isSingleDay = ["Palestra", "Curso Básico 2h", "Curso Básico 3h", "Diagnóstico Padrão de Clareza", "Simplificação de Documentos"].includes(m) || (isPCS && !isPCSOline);
                return (<div key={m} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: T.txt, userSelect: "none" }}>
                          <input type="checkbox" checked={checked} onChange={() => {
                        const cur = aModal.types || [];
                        const willCheck = !checked;
                        const curSched = (aModal.typeSchedules || {})[m];
                        const newTypeSchedules = willCheck && !curSched
                            ? { ...(aModal.typeSchedules || {}), [m]: { ...sched } }
                            : (aModal.typeSchedules || {});
                        setAModal({ ...aModal, types: checked ? cur.filter((x) => x !== m) : [...cur, m], typeSchedules: newTypeSchedules });
                    }} style={{ width: 14, height: 14, accentColor: T.pri, cursor: "pointer" }}/>
                          {m}
                        </label>
                        {checked && hasFmt && (<div style={{ display: "flex", gap: 0, background: "#f1f5f9", borderRadius: 6, overflow: "hidden", border: `1px solid ${T.border}` }}>
                            {["Online", "Presencial"].map(f => (<button key={f} onClick={() => upS({ format: f })} style={{ padding: "3px 10px", fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer", background: sched.format === f ? T.pri : "transparent", color: sched.format === f ? "#fff" : T.txtM, transition: "all .15s" }}>
                                {f}
                              </button>))}
                          </div>)}
                      </div>
                      {checked && !isC20Pres && !isPCSOline && (<div style={{ paddingLeft: 22, display: "grid", gridTemplateColumns: isSingleDay ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 8 }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <span style={{ fontSize: 10, fontWeight: 500, color: T.txtS }}>{isC20 ? "Data início" : "Data"}</span>
                            <input type="date" value={sched.startDate} onChange={e => upS({ startDate: e.target.value })} style={inpSt}/>
                          </div>
                          {!isSingleDay && (<div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                              <span style={{ fontSize: 10, fontWeight: 500, color: T.txtS }}>Data fim</span>
                              <input type="date" value={sched.endDate} onChange={e => upS({ endDate: e.target.value })} style={inpSt}/>
                            </div>)}
                          <TimeSel label="Hora início" value={sched.startTime || ""} onChange={v => upS({ startTime: v })}/>
                          <TimeSel label="Hora fim" value={sched.endTime || ""} onChange={v => upS({ endTime: v })}/>
                        </div>)}
                      {checked && (isC20Pres || isPCSOline) && (<div style={{ paddingLeft: 22, display: "flex", flexDirection: "column", gap: 6 }}>
                          {Array.from({ length: isC20Pres ? 3 : 2 }, (_, i) => {
                            const d = (sched.dates || [])[i] || { date: "", startTime: "", endTime: "" };
                            return (<div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, background: "#f8fafc", borderRadius: 6, padding: "8px 10px", border: `1px solid ${T.borderS}` }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                  <span style={{ fontSize: 10, fontWeight: 500, color: T.txtS }}>Data {i + 1}</span>
                                  <input type="date" value={d.date} onChange={e => upDate(i, { date: e.target.value })} style={inpSt}/>
                                </div>
                                <TimeSel label="Hora início" value={d.startTime || ""} onChange={v => upDate(i, { startTime: v })}/>
                                <TimeSel label="Hora fim" value={d.endTime || ""} onChange={v => upDate(i, { endTime: v })}/>
                              </div>);
                        })}
                        </div>)}
                      {checked && (<div style={{ paddingLeft: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 2 }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <span style={{ fontSize: 10, fontWeight: 500, color: T.txtS }}>Valor (R$)</span>
                            <input type="text" value={sched.value || ""} onChange={e => upS({ value: e.target.value.replace(",", ".") })} placeholder="Ex: 8000" style={inpSt}/>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <span style={{ fontSize: 10, fontWeight: 500, color: T.txtS }}>Nº de Participantes</span>
                            <input type="text" value={sched.participants || ""} onChange={e => upS({ participants: e.target.value })} placeholder="Ex: 30" style={inpSt}/>
                          </div>
                        </div>)}
                    </div>);
            })}
              </div>
            </div>
            <div style={G3}>
              <FI label="Cliente" value={aModal.client} onChange={e => setAModal({ ...aModal, client: e.target.value })} ph="Nome do cliente"/>
              <FS label="Setor do Cliente" value={aModal.clientCategory || ""} onChange={e => setAModal({ ...aModal, clientCategory: e.target.value })} opts={["", "Público", "Privado", "Outros"]}/>
              <FS label="Formato" value={aModal.format} onChange={e => setAModal({ ...aModal, format: e.target.value })} opts={FORMATS}/>
            </div>
            {(() => {
                const ct = contacts.find((c) => c.name === aModal.client);
                const depts = ct?.departments || [];
                const selDept = depts.find((d) => d.name === aModal.department);
                const hasDepts = depts.length > 0;
                return (<div style={{ background: "#f0f5ff", border: "1px solid #c7d2fe", borderRadius: T.radS, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#3730a3", marginBottom: 2, letterSpacing: ".04em", textTransform: "uppercase" }}>🏢 Departamento Contratante</div>
                  <div style={G2}>
                    <FI label="Contato" value={aModal.departmentContact || ""} onChange={e => setAModal({ ...aModal, departmentContact: e.target.value })} ph="Nome da pessoa"/>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <label style={LABEL_ST}>Departamento{hasDepts && <span style={{ fontSize: 10, color: T.txtX, fontWeight: 400, marginLeft: 6 }}>(ou selecione da lista)</span>}</label>
                      <input list="dept-dl" value={aModal.department || ""} onChange={e => {
                        const d = depts.find((d) => d.name === e.target.value);
                        setAModal({ ...aModal, department: e.target.value, departmentContact: d?.contactName || aModal.departmentContact || "" });
                    }} placeholder="Ex: RH, Jurídico, Gestão de Pessoas..." style={{ ...INPUT_ST, background: "#fff" }} onFocus={e => e.target.style.borderColor = T.pri} onBlur={e => e.target.style.borderColor = T.border}/>
                      {hasDepts && (<datalist id="dept-dl">
                          {depts.map((d) => <option key={d.id} value={d.name}/>)}
                        </datalist>)}
                    </div>
                  </div>
                  {selDept && (selDept.email || selDept.phone || selDept.whatsapp) && (<div style={{ display: "flex", gap: 14, flexWrap: "wrap", paddingTop: 6, borderTop: `1px solid #c7d2fe` }}>
                      {selDept.email && <span style={{ fontSize: 11, color: "#4338ca" }}>✉️ {selDept.email}</span>}
                      {selDept.phone && <span style={{ fontSize: 11, color: "#4338ca" }}>📞 {selDept.phone}</span>}
                      {selDept.whatsapp && <span style={{ fontSize: 11, color: "#4338ca" }}>💬 {selDept.whatsapp}</span>}
                    </div>)}
                </div>);
            })()}

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
              <FI label="Cidade" value={aModal.city} onChange={e => setAModal({ ...aModal, city: e.target.value })} ph="Cidade"/>
              <FI label="UF" value={aModal.state} onChange={e => setAModal({ ...aModal, state: e.target.value })} ph="UF" max={2}/>
            </div>

            {(() => {
                const clientCat = (contacts.find(c => c.name === aModal.client) || { category: "" }).category || "";
                const isPrivado = clientCat === "Privado";
                const visibleSt = ACT_ST.filter(st => !(st === "Aguarda nota de empenho" && isPrivado));
                return (<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={LABEL_ST}>Status{isPrivado && <span style={{ fontSize: 10, color: T.txtX, marginLeft: 8, fontWeight: 400 }}>— Nota de empenho não disponível (setor privado)</span>}</label>
                  <div style={{ display: "flex", gap: 0, background: T.bg, borderRadius: T.radS, border: `1px solid ${T.border}`, overflow: "hidden" }}>
                    {visibleSt.map((st, i) => {
                        const on = aModal.status === st;
                        const { bg } = ss(st);
                        return (<button key={st} onClick={() => setAModal({ ...aModal, status: st })} style={{ flex: 1, padding: "8px 4px", border: "none", borderRight: i < visibleSt.length - 1 ? `1px solid ${T.border}` : "none", background: on ? bg : "transparent", color: on ? "#4b5563" : T.txtX, cursor: "pointer", fontSize: 10, fontWeight: on ? 700 : 400, lineHeight: 1.3, textAlign: "center", transition: "all .15s" }}>
                          {st}
                        </button>);
                    })}
                  </div>
                </div>);
            })()}
            <FI label="Observações" value={aModal.notes || ""} onChange={e => setAModal({ ...aModal, notes: e.target.value })} ph="Ex: Curso para 30 pessoas..." ml/>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 22, justifyContent: "space-between", paddingTop: 16, borderTop: `1px solid ${T.borderS}` }}>
            <div>{aModal.id && <Btn danger onClick={() => delA(aModal.id)}>Excluir</Btn>}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn ghost onClick={() => setAModal(null)}>Cancelar</Btn>
              <Btn onClick={saveA}>{aModal.id ? "Salvar Alterações" : "Salvar Atividade"}</Btn>
            </div>
          </div>
        </>)}
    </OLay>

    </>);
}
