import { Download, BookOpen, DollarSign } from "lucide-react";
import { T } from "../../constants/theme";
import { money } from "../../utils/money";
import { SectionHeader, MetricCard, Btn, SkeletonLine } from "../ui";
import { ProximasAtividades } from "./ProximasAtividades";
import { CARD } from "../../styles/common";

export function Dashboard({
  activities,
  loading,
  backupDue,
  onBackup,
  onOpenActivity,
  onActivityStatusChange,
  onNavigateActivities,
}) {
  const fin = (() => {
    const totBruto = activities.reduce((s, a) => s + (a.value || 0), 0);
    const totTax = activities.reduce(
      (s, a) => s + (a.value || 0) * Math.max(a.tax || 0, 10) / 100,
      0
    );
    const totExp = activities.reduce(
      (s, a) => s + (a.expenses || []).reduce((ss, e) => ss + (parseFloat(e.valor) || 0), 0),
      0
    );
    return {
      totBruto,
      totTax,
      totExp,
      totNet: totBruto - totTax - totExp,
      aRec: activities
        .filter((a) => a.status !== "Realizado")
        .reduce((s, a) => s + (a.value || 0), 0),
    };
  })();

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <SectionHeader
        title="Visão Geral"
        actions={[
          <div key="bk" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {backupDue && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#475569",
                  background: "#ffffff",
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: "1.5px solid #e8edf3",
                  boxShadow: "0 2px 8px rgba(0,0,0,.05)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#fcd34d",
                    flexShrink: 0,
                  }}
                />
                Backup Pendente
              </span>
            )}
            <Btn ghost onClick={onBackup}>
              <Download size={13} /> Backup Completo
            </Btn>
          </div>,
        ]}
      />

      {loading ? (
        <div style={{ ...CARD, padding: 24, marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <SkeletonLine w={180} h={18} />
            <SkeletonLine w={100} h={28} />
          </div>
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "52px 1px 1fr auto",
                  gap: "0 14px",
                  alignItems: "center",
                  padding: "12px 6px",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <SkeletonLine w={40} h={40} />
                </div>
                <div style={{ width: 1, height: 36, background: "#e8edf3" }} />
                <div>
                  <SkeletonLine w="70%" h={14} mb={6} />
                  <SkeletonLine w="45%" h={11} />
                </div>
                <SkeletonLine w={80} h={28} />
              </div>
            ))}
        </div>
      ) : (
        <>
          <ProximasAtividades
            activities={activities}
            onOpen={onOpenActivity}
            onStatusChange={onActivityStatusChange}
            onVerTodas={onNavigateActivities}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 22 }}>
            <MetricCard
              label="Atividades"
              value={String(activities.length)}
              sub={activities.filter((a) => a.status === "Confirmado").length + " confirmadas"}
              cardBg="#eff6ff"
              iconBg="rgba(255,255,255,.8)"
              iconColor={T.pri}
              Icon={BookOpen}
            />
            <MetricCard
              label="A Receber"
              value={money(fin.aRec)}
              sub="Atividades pendentes"
              cardBg="#fffbeb"
              iconBg="rgba(255,255,255,.8)"
              iconColor="#d97706"
              Icon={DollarSign}
            />
          </div>
        </>
      )}
    </div>
  );
}
