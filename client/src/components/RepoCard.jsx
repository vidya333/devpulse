import React from "react";

export default function RepoCard({ repo, langColors }) {
  const daysAgo = Math.floor((Date.now() - new Date(repo.updated)) / (1000 * 60 * 60 * 24));
  const langColor = langColors[repo.language] || "#888";

  return (
    <a href={repo.url} target="_blank" rel="noreferrer" style={styles.card}>
      <div style={styles.top}>
        <span style={styles.name}>{repo.name}</span>
        <span style={styles.stars}>★ {repo.stars}</span>
      </div>
      {repo.description && (
        <p style={styles.desc}>{repo.description.slice(0, 80)}{repo.description.length > 80 ? "…" : ""}</p>
      )}
      <div style={styles.bottom}>
        {repo.language && (
          <span style={styles.lang}>
            <span style={{ ...styles.langDot, background: langColor }} />
            {repo.language}
          </span>
        )}
        <span style={styles.updated}>{daysAgo === 0 ? "today" : `${daysAgo}d ago`}</span>
      </div>
    </a>
  );
}

const styles = {
  card: {
    display: "block", textDecoration: "none",
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 10, padding: "16px 18px",
    transition: "border-color 0.15s, background 0.15s",
  },
  top: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  name: { fontSize: 14, fontWeight: 600, color: "var(--accent)", fontFamily: "var(--font-mono)" },
  stars: { fontSize: 12, color: "var(--accent3)", fontFamily: "var(--font-mono)" },
  desc: { fontSize: 12, color: "var(--muted2)", lineHeight: 1.5, marginBottom: 12 },
  bottom: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  lang: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" },
  langDot: { width: 8, height: 8, borderRadius: "50%" },
  updated: { fontSize: 10, color: "var(--muted)", fontFamily: "var(--font-mono)" },
};
