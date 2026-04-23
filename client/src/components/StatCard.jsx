import React from "react";

export default function StatCard({ label, value, accent }) {
  return (
    <div style={{ ...styles.card, borderTop: `2px solid ${accent}` }}>
      <span style={styles.label}>{label}</span>
      <span style={{ ...styles.value, color: accent }}>{value}</span>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--bg2)", borderRadius: 10,
    border: "1px solid var(--border)", borderTopWidth: 2,
    padding: "16px 18px",
  },
  label: {
    display: "block", fontSize: 10, color: "var(--muted)",
    fontFamily: "var(--font-mono)", letterSpacing: "0.08em",
    textTransform: "uppercase", marginBottom: 8,
  },
  value: {
    display: "block", fontSize: 26, fontWeight: 800,
    fontFamily: "var(--font-display)", letterSpacing: "-1px",
  },
};
