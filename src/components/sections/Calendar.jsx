import { useMemo, useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { T, TYPE_CLR } from "../../constants/theme";
import { tClr, actLabel } from "../../utils/helpers";
import { dimM, fd1, MONTHS, WDAYS } from "../../utils/date";
import { SectionHeader, Btn, Pill } from "../ui";
import { CARD } from "../../styles/common";

export function CalendarView({ activities, onNew, onOpen }) {
  const [calV, setCalV] = useState("weekly");
  const [wk, setWk] = useState(0);
  const [mo, setMo] = useState(new Date().getMonth());
  const [yr, setYr] = useState(Math.max(new Date().getFullYear(), 2026));

  const todayReal = useMemo(() => new Date(), []);
  const base = useMemo(() => {
    const d = new Date(todayReal);
    d.setDate(d.getDate() - d.getDay());
    return d;
  }, [todayReal]);

  const wDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i + wk * 7);
      return d;
    });
  }, [base, wk]);

  const getDayActs = (day, month, year) =>
    activities.filter((a) => {
      const p = a.startDate.split("/");
      return (
        parseInt(p[0]) === day && parseInt(p[1]) === month + 1 && parseInt(p[2]) === year
      );
    });

  return (
    <div>
      <SectionHeader
        title="Calendário"
        actions={[
          <div
            key="tabs"
            style={{
              display: "flex",
              gap: 2,
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: T.radS,
              padding: 3,
            }}
          >
            {[
              ["weekly", "Semana"],
              ["monthly", "Mês"],
              ["annual", "Ano"],
            ].map(([v, l]) => (
              <Pill key={v} label={l} active={calV === v} onClick={() => setCalV(v)} />
            ))}
          </div>,
          <Btn key="new" onClick={onNew}>
            <Plus size={13} /> Nova
          </Btn>,
        ]}
      />

      {calV === "weekly" && (
        <div style={{ ...CARD, overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 20px",
              borderBottom: `1px solid ${T.borderS}`,
              background: "#f8fafc",
              borderRadius: `${T.rad} ${T.rad} 0 0`,
            }}
          >
            <button
              onClick={() => setWk((w) => w - 1)}
              type="button"
              style={{
                padding: "4px 8px",
                border: `1px solid ${T.border}`,
                borderRadius: T.radS,
                background: T.surface,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronLeft size={13} />
            </button>
            <span style={{ fontWeight: 600, fontSize: 13, color: T.txt }}>
              {wDays[0].getDate()} a {wDays[6].getDate()} de {MONTHS[wDays[0].getMonth()]} {wDays[0].getFullYear()}
            </span>
            <button
              onClick={() => setWk((w) => w + 1)}
              type="button"
              style={{
                padding: "4px 8px",
                border: `1px solid ${T.border}`,
                borderRadius: T.radS,
                background: T.surface,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronRight size={13} />
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7,1fr)",
              borderBottom: `1px solid ${T.borderS}`,
            }}
          >
            {wDays.map((d, i) => {
              const isToday = d.toDateString() === todayReal.toDateString();
              return (
                <div
                  key={i}
                  style={{
                    padding: "10px 0",
                    textAlign: "center",
                    background: isToday ? T.priL : "transparent",
                    borderRight: i < 6 ? `1px solid ${T.borderS}` : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: T.txtX,
                      marginBottom: 5,
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                    }}
                  >
                    {WDAYS[d.getDay()]}
                  </div>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 9,
                      background: isToday ? T.pri : "transparent",
                      color: isToday ? "#fff" : T.txtS,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                      fontSize: 13,
                      fontWeight: isToday ? 700 : 400,
                    }}
                  >
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7,1fr)",
              borderTop: `1px solid ${T.borderS}`,
            }}
          >
            {wDays.map((d, i) => {
              const da = getDayActs(d.getDate(), d.getMonth(), d.getFullYear());
              return (
                <div
                  key={i}
                  style={{
                    minHeight: 170,
                    padding: 6,
                    borderRight: i < 6 ? `1px solid ${T.borderS}` : "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                  }}
                >
                  {da.map((a) => {
                    const { bg } = tClr(a.type, TYPE_CLR);
                    return (
                      <div
                        key={a.id}
                        onClick={() => onOpen(a)}
                        style={{
                          padding: "6px 8px",
                          borderRadius: 7,
                          background: bg,
                          cursor: "pointer",
                          marginBottom: 4,
                        }}
                      >
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#1e293b", lineHeight: 1.3 }}>
                          {actLabel(a)}
                        </div>
                        <div style={{ fontSize: 9, color: "#374151", lineHeight: 1.3 }}>{a.client}</div>
                        <div style={{ fontSize: 9, color: "#475569", lineHeight: 1.3 }}>
                          {a.startTime}–{a.endTime}
                        </div>
                        {a.city && <div style={{ fontSize: 9, color: "#475569", lineHeight: 1.3 }}>{a.city}</div>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {calV === "monthly" && (
        <div style={CARD}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 20px",
              borderBottom: `1px solid ${T.borderS}`,
              background: "#f8fafc",
              borderRadius: `${T.rad} ${T.rad} 0 0`,
            }}
          >
            <button
              onClick={() => {
                if (mo === 0) {
                  if (yr > 2026) {
                    setMo(11);
                    setYr((y) => y - 1);
                  }
                } else {
                  setMo((m) => m - 1);
                }
              }}
              type="button"
              style={{
                padding: "4px 8px",
                border: `1px solid ${T.border}`,
                borderRadius: T.radS,
                background: T.surface,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                opacity: mo === 0 && yr <= 2026 ? 0.3 : 1,
              }}
              disabled={mo === 0 && yr <= 2026}
            >
              <ChevronLeft size={13} />
            </button>
            <span style={{ fontWeight: 600, fontSize: 13, color: T.txt }}>
              {MONTHS[mo]} {yr}
            </span>
            <button
              onClick={() => {
                if (mo === 11) {
                  setMo(0);
                  setYr((y) => y + 1);
                } else {
                  setMo((m) => m + 1);
                }
              }}
              type="button"
              style={{
                padding: "4px 8px",
                border: `1px solid ${T.border}`,
                borderRadius: T.radS,
                background: T.surface,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronRight size={13} />
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7,1fr)",
              background: "#f8fafc",
              borderBottom: `1px solid ${T.borderS}`,
            }}
          >
            {WDAYS.map((d) => (
              <div
                key={d}
                style={{
                  padding: "8px",
                  textAlign: "center",
                  fontSize: 10,
                  fontWeight: 600,
                  color: T.txtX,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                {d}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
            {Array.from({ length: fd1(mo, yr) }).map((_, i) => (
              <div
                key={"e" + i}
                style={{
                  minHeight: 110,
                  borderBottom: `1px solid ${T.borderS}`,
                  borderRight: `1px solid ${T.borderS}`,
                  background: "#fafafa",
                }}
              />
            ))}
            {Array.from({ length: dimM(mo, yr) }, (_, i) => i + 1).map((day) => {
              const da = getDayActs(day, mo, yr);
              const isToday =
                day === todayReal.getDate() && mo === todayReal.getMonth() && yr === todayReal.getFullYear();
              return (
                <div
                  key={day}
                  style={{
                    minHeight: 110,
                    padding: "5px 6px",
                    borderBottom: `1px solid ${T.borderS}`,
                    borderRight: `1px solid ${T.borderS}`,
                    background: isToday ? "#eff6ff" : T.surface,
                    verticalAlign: "top",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = isToday ? "#dbeafe" : T.bg)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = isToday ? T.priL : T.surface)
                  }
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 7,
                      background: isToday ? T.pri : "transparent",
                      color: isToday ? "#fff" : T.txtM,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: isToday ? 700 : 400,
                      marginBottom: 3,
                    }}
                  >
                    {day}
                  </div>
                  {da.map((a) => {
                    const { bg } = tClr(a.type, TYPE_CLR);
                    return (
                      <div
                        key={a.id}
                        onClick={() => onOpen(a)}
                        style={{
                          padding: "4px 5px",
                          borderRadius: 5,
                          background: bg,
                          marginBottom: 3,
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: 9, fontWeight: 700, color: "#1e293b", lineHeight: 1.3 }}>
                          {actLabel(a)}
                        </div>
                        <div style={{ fontSize: 8, color: "#374151", lineHeight: 1.2 }}>
                          {a.client.split(" ").slice(0, 2).join(" ")}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {calV === "annual" && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 20px",
              marginBottom: 12,
              background: T.surface,
              borderRadius: T.rad,
              border: `1px solid ${T.border}`,
            }}
          >
            <button
              onClick={() => {
                if (yr > 2026) setYr((y) => y - 1);
              }}
              type="button"
              style={{
                padding: "4px 8px",
                border: `1px solid ${T.border}`,
                borderRadius: T.radS,
                background: T.surface,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                opacity: yr <= 2026 ? 0.3 : 1,
              }}
              disabled={yr <= 2026}
            >
              <ChevronLeft size={13} />
            </button>
            <span style={{ fontWeight: 600, fontSize: 13, color: T.txt }}>{yr}</span>
            <button
              onClick={() => setYr((y) => y + 1)}
              type="button"
              style={{
                padding: "4px 8px",
                border: `1px solid ${T.border}`,
                borderRadius: T.radS,
                background: T.surface,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronRight size={13} />
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {MONTHS.map((mn, mi) => {
              const fd = fd1(mi, yr);
              const dc = dimM(mi, yr);
              const mA = activities.filter((a) => {
                const p = a.startDate.split("/");
                return parseInt(p[1]) === mi + 1 && parseInt(p[2]) === yr;
              });
              return (
                <div
                  key={mi}
                  style={{ ...CARD, cursor: "pointer" }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = T.shadowM)}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = T.shadow)}
                >
                  <div
                    style={{
                      padding: "8px 14px",
                      borderBottom: `1px solid ${T.borderS}`,
                      background: "#f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderRadius: `${T.rad} ${T.rad} 0 0`,
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 12, color: T.txt }}>{mn}</span>
                    {mA.length > 0 && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          background: T.priL,
                          color: T.pri,
                          padding: "2px 7px",
                          borderRadius: 20,
                        }}
                      >
                        {mA.length} ativ.
                      </span>
                    )}
                  </div>
                  <div style={{ padding: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 3 }}>
                      {WDAYS.map((d) => (
                        <div
                          key={d}
                          style={{
                            textAlign: "center",
                            fontSize: 7,
                            color: "#cbd5e1",
                            fontWeight: 600,
                          }}
                        >
                          {d[0]}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
                      {Array.from({ length: fd }).map((_, i) => (
                        <div key={i} />
                      ))}
                      {Array.from({ length: dc }, (_, i) => i + 1).map((d) => {
                        const h = mA.filter((a) => parseInt(a.startDate.split("/")[0]) === d);
                        const hasAct = h.length > 0;
                        return (
                          <div
                            key={d}
                            style={{
                              textAlign: "center",
                              fontSize: 7,
                              padding: "2px 0",
                              borderRadius: 4,
                              background: hasAct ? T.pri : "transparent",
                              color: hasAct ? "#fff" : T.txtX,
                              fontWeight: hasAct ? 700 : 400,
                            }}
                          >
                            {d}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
