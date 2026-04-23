import React, { useEffect, useState } from "react";
import HourChart from "../components/HourChart";
import LangChart from "../components/LangChart";
import RepoCard from "../components/RepoCard";
import StatCard from "../components/StatCard";

const LANG_COLORS = {
  JavaScript: "#f7df1e", TypeScript: "#3178c6", Python: "#3572a5",
  Rust: "#dea584", Go: "#00add8", Java: "#b07219", "C++": "#f34b7d",
  CSS: "#563d7c", HTML: "#e34c26", Ruby: "#701516", PHP: "#4f5d95",
  Swift: "#fa7343", Kotlin: "#a97bff", Dart: "#00b4ab",
};

function timeLabel(hour) {
  if (hour === 0) return "midnight";
  if (hour < 6) return `${hour}am (night owl 🦉)`;
  if (hour < 12) return `${hour}am`;
  if (hour === 12) return "noon";
  if (hour < 18) return `${hour - 12}pm`;
  return `${hour - 12}pm (evening coder)`;
}

export default function Dashboard({ data, onBack }) {
  const { user, stats, repos, roast } = data;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    window.scrollTo(0, 0);
  }, []);

  const accountAge = Math.floor(
    (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 365)
  );

  return (
    <div style={{ ...styles.page, opacity: visible ? 1 : 0, transition: "opacity 0.4s" }}>
      <div style={styles.grid} />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={onBack} style={styles.backBtn}>← New search</button>
          <div style={styles.headerRight}>
            <span style={styles.liveBadge}><span style={styles.liveDot} />LIVE DATA</span>
          </div>
        </div>

        {/* Profile section */}
        <div style={styles.profileSection}>
          <img src={user.avatar} alt={user.login} style={styles.avatar} />
          <div style={styles.profileInfo}>
            <h1 style={styles.name}>{user.name || user.login}</h1>
            <a href={`https://github.com/${user.login}`} target="_blank" rel="noreferrer" style={styles.handle}>
              @{user.login}
            </a>
            {user.bio && <p style={styles.bio}>{user.bio}</p>}
            <div style={styles.profileMeta}>
              {user.location && <span style={styles.metaItem}>📍 {user.location}</span>}
              {user.company && <span style={styles.metaItem}>🏢 {user.company}</span>}
              <span style={styles.metaItem}>⏳ {accountAge}y on GitHub</span>
            </div>
          </div>
        </div>

        {/* AI Roast Card */}
        {roast && (
          <div style={styles.roastCard}>
            <div style={styles.roastHeader}>
              <span style={styles.roastIcon}>⚡</span>
              <span style={styles.roastLabel}>AI VERDICT</span>
            </div>
            <p style={styles.roastText}>{roast}</p>
          </div>
        )}

        {/* Stats Row */}
        <div style={styles.statsGrid}>
          <StatCard label="Public Repos" value={user.publicRepos} accent="var(--accent)" />
          <StatCard label="Followers" value={user.followers} accent="#7c3aed" />
          <StatCard label="Current Streak" value={`${stats.streak}d`} accent="#f59e0b" />
          <StatCard label="Recent Commits" value={stats.totalCommits} accent="#06b6d4" />
          <StatCard label="Peak Hour" value={`${stats.peakHour}:00`} accent="#ec4899" />
          <StatCard label="Peak Day" value={stats.peakDay} accent="var(--accent)" />
        </div>

        {/* Charts Row */}
        <div style={styles.chartsRow}>
          <div style={styles.chartCard}>
            <h3 style={styles.cardTitle}>Commit hours</h3>
            <p style={styles.cardSub}>You code most at {timeLabel(stats.peakHour)}</p>
            <HourChart hourMap={stats.hourMap} peakHour={stats.peakHour} />
          </div>
          <div style={styles.chartCard}>
            <h3 style={styles.cardTitle}>Languages</h3>
            <p style={styles.cardSub}>Based on your public repos</p>
            <LangChart languages={stats.topLanguages} colors={LANG_COLORS} />
          </div>
        </div>

        {/* Day heatmap */}
        <div style={styles.dayCard}>
          <h3 style={styles.cardTitle}>Day of week activity</h3>
          <div style={styles.dayRow}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => {
              const val = stats.dayMap[i];
              const max = Math.max(...stats.dayMap);
              const pct = max > 0 ? val / max : 0;
              return (
                <div key={d} style={styles.dayItem}>
                  <div style={{ ...styles.dayBar, height: `${Math.max(4, pct * 80)}px`, background: pct > 0.7 ? "var(--accent)" : pct > 0.3 ? "#7c3aed" : "var(--bg3)" }} />
                  <span style={styles.dayLabel}>{d}</span>
                  <span style={styles.dayCount}>{val}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Repos */}
        {repos.length > 0 && (
          <div>
            <h3 style={{ ...styles.cardTitle, marginBottom: 16 }}>Top repositories</h3>
            <div style={styles.reposGrid}>
              {repos.map((repo) => (
                <RepoCard key={repo.name} repo={repo} langColors={LANG_COLORS} />
              ))}
            </div>
          </div>
        )}

        <div style={styles.footer}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)" }}>
            DevPulse — built with GitHub API + Claude AI
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "var(--bg)", position: "relative" },
  grid: {
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
    backgroundImage: "linear-gradient(rgba(0,255,136,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.02) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
  },
  container: { maxWidth: 960, margin: "0 auto", padding: "32px 20px 64px", position: "relative", zIndex: 1 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 },
  backBtn: {
    background: "transparent", border: "1px solid var(--border2)", color: "var(--muted2)",
    borderRadius: 8, padding: "8px 16px", cursor: "pointer",
    fontFamily: "var(--font-mono)", fontSize: 12, transition: "color 0.15s, border-color 0.15s",
  },
  headerRight: { display: "flex", gap: 12 },
  liveBadge: {
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.15)",
    borderRadius: 100, padding: "6px 12px",
    fontSize: 10, color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em",
  },
  liveDot: {
    width: 6, height: 6, borderRadius: "50%", background: "var(--accent)",
    display: "inline-block", animation: "pulse-glow 1.5s infinite",
  },
  profileSection: { display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap" },
  avatar: { width: 88, height: 88, borderRadius: 12, border: "2px solid var(--border2)", flexShrink: 0 },
  profileInfo: { flex: 1, minWidth: 200 },
  name: { fontSize: 28, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.5px", marginBottom: 4 },
  handle: { fontSize: 14, color: "var(--accent)", fontFamily: "var(--font-mono)", textDecoration: "none" },
  bio: { fontSize: 14, color: "var(--muted2)", marginTop: 8, lineHeight: 1.6 },
  profileMeta: { display: "flex", flexWrap: "wrap", gap: 16, marginTop: 10 },
  metaItem: { fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" },
  roastCard: {
    background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(0,255,136,0.06))",
    border: "1px solid rgba(124,58,237,0.3)",
    borderRadius: 12, padding: "20px 24px", marginBottom: 28,
  },
  roastHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  roastIcon: { fontSize: 16 },
  roastLabel: { fontSize: 10, fontFamily: "var(--font-mono)", color: "#a78bfa", letterSpacing: "0.1em", fontWeight: 700 },
  roastText: { fontSize: 15, lineHeight: 1.75, color: "var(--text)" },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: 12, marginBottom: 24,
  },
  chartsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
  chartCard: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 12, padding: "20px 20px 16px",
  },
  dayCard: {
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 12, padding: "20px 24px", marginBottom: 24,
  },
  dayRow: { display: "flex", gap: 12, alignItems: "flex-end", marginTop: 20, height: 100 },
  dayItem: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, justifyContent: "flex-end" },
  dayBar: { width: "100%", borderRadius: 4, transition: "height 0.5s ease", maxWidth: 40 },
  dayLabel: { fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" },
  dayCount: { fontSize: 10, color: "var(--muted)", fontFamily: "var(--font-mono)" },
  cardTitle: { fontSize: 14, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.2px" },
  cardSub: { fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)", marginTop: 4, marginBottom: 16 },
  reposGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 },
  footer: { marginTop: 48, textAlign: "center" },
};
