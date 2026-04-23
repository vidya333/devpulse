import React from "react";

export default function LangChart({ languages, colors }) {
  if (!languages.length) return <p style={{ color: "var(--muted)", fontSize: 13 }}>No language data</p>;
  const max = languages[0].count;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {languages.map(({ lang, count }) => {
        const pct = (count / max) * 100;
        const color = colors[lang] || "#888";
        return (
          <div key={lang}>
            <div style={styles.row}>
              <span style={{ ...styles.dot, background: color }} />
              <span style={styles.lang}>{lang}</span>
              <span style={styles.count}>{count} repos</span>
            </div>
            <div style={styles.track}>
              <div style={{ ...styles.fill, width: `${pct}%`, background: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  row: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 },
  dot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  lang: { flex: 1, fontSize: 12, color: "var(--text)", fontFamily: "var(--font-mono)" },
  count: { fontSize: 10, color: "var(--muted)", fontFamily: "var(--font-mono)" },
  track: { height: 4, background: "var(--bg3)", borderRadius: 2, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 2, transition: "width 0.6s ease" },
};
