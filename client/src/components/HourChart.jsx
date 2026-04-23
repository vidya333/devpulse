import React from "react";

export default function HourChart({ hourMap, peakHour }) {
  const max = Math.max(...hourMap, 1);
  return (
    <div style={styles.wrap}>
      {hourMap.map((val, i) => {
        const pct = val / max;
        const isPeak = i === peakHour;
        return (
          <div key={i} style={styles.col} title={`${i}:00 — ${val} pushes`}>
            <div style={{
              ...styles.bar,
              height: `${Math.max(2, pct * 72)}px`,
              background: isPeak ? "var(--accent)" : pct > 0.4 ? "#7c3aed" : "var(--bg3)",
              boxShadow: isPeak ? "0 0 8px rgba(0,255,136,0.5)" : "none",
            }} />
          </div>
        );
      })}
      <div style={styles.axisRow}>
        {["0", "6", "12", "18", "23"].map((h) => (
          <span key={h} style={styles.axisLabel}>{h}</span>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrap: { position: "relative" },
  col: { display: "inline-flex", flexDirection: "column", justifyContent: "flex-end", width: "calc(100% / 24)", height: 72, verticalAlign: "bottom" },
  bar: { width: "80%", margin: "0 auto", borderRadius: "2px 2px 0 0", transition: "height 0.5s ease" },
  axisRow: { display: "flex", justifyContent: "space-between", marginTop: 6 },
  axisLabel: { fontSize: 9, color: "var(--muted)", fontFamily: "var(--font-mono)" },
};
