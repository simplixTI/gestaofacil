export function SkeletonLine({ w = "100%", h = 12, mb = 0 }) {
  return (
    <div
      className="skeleton"
      style={{ width: w, height: h, borderRadius: 6, marginBottom: mb }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e8edf3",
        padding: "18px 20px",
        boxShadow: "0 2px 8px rgba(0,0,0,.05)",
      }}
    >
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <SkeletonLine w={90} h={22} />
        <div
          style={{
            flex: 1,
            height: 1,
            background: "#e8edf3",
            alignSelf: "center",
          }}
        />
      </div>
      <SkeletonLine w="60%" h={18} mb={6} />
      <SkeletonLine w="40%" h={13} mb={14} />
      <SkeletonLine w="70%" h={12} mb={6} />
      <SkeletonLine w="50%" h={12} mb={16} />
      <div style={{ height: 1, background: "#f1f5f9", marginBottom: 14 }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <SkeletonLine w={80} h={22} />
        <SkeletonLine w={70} h={20} />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr>
      {[180, 120, 100, 90, 90, 80, 80, 80, 50].map((w, i) => (
        <td key={i} style={{ padding: "13px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <div className="skeleton" style={{ height: 13, width: w, borderRadius: 6 }} />
        </td>
      ))}
    </tr>
  );
}
