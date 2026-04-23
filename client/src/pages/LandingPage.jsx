import React, { useState, useEffect } from "react";

const EXAMPLES = ["torvalds", "gaearon", "sindresorhus", "yyx990803"];

export default function LandingPage({ onSearch, loading, loadingMsg, error }) {
  const [input, setInput] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [exIdx, setExIdx] = useState(0);

  useEffect(() => {
    let i = 0;
    let typing = true;
    let current = EXAMPLES[exIdx];
    const interval = setInterval(() => {
      if (typing) {
        setPlaceholder(current.slice(0, i + 1));
        i++;
        if (i >= current.length) { typing = false; setTimeout(() => {}, 1200); }
      } else {
        setPlaceholder(current.slice(0, i - 1));
        i--;
        if (i <= 0) {
          typing = true;
          setExIdx((prev) => (prev + 1) % EXAMPLES.length);
          current = EXAMPLES[(exIdx + 1) % EXAMPLES.length];
        }
      }
    }, 90);
    return () => clearInterval(interval);
  }, [exIdx]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim());
  };

  return (
    <div style={styles.page}>
      {/* Noise texture overlay */}
      <div style={styles.noise} />
      {/* Grid lines */}
      <div style={styles.grid} />

      <div style={styles.center}>
        <div style={styles.badge}>
          <span style={styles.dot} />
          GitHub Intelligence Layer
        </div>

        <h1 style={styles.h1}>
          <span style={styles.h1green}>Dev</span>Pulse
        </h1>
        <p style={styles.sub}>
          Paste a GitHub username. Get a brutally honest breakdown of your coding personality,
          patterns, and peak hours — powered by real data + AI.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrap}>
            <span style={styles.prompt}>$</span>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder || "username"}
              disabled={loading}
              autoFocus
              spellCheck={false}
            />
            <span style={{ ...styles.cursor, animation: "blink 1s infinite" }}>▌</span>
          </div>
          <button type="submit" style={styles.btn} disabled={loading || !input.trim()}>
            {loading ? "..." : "Analyze →"}
          </button>
        </form>

        {loading && (
          <div style={styles.loadingBox}>
            <span style={styles.loadingDot} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)" }}>
              {loadingMsg}
            </span>
          </div>
        )}

        {error && (
          <p style={styles.error}>⚠ {error}</p>
        )}

        <div style={styles.features}>
          {["Commit heatmap", "Peak coding hours", "Language breakdown", "AI personality verdict", "Streak tracker", "Top repos"].map((f) => (
            <span key={f} style={styles.feature}>{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    background: "var(--bg)",
  },
  noise: {
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
    opacity: 0.4,
  },
  grid: {
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
    backgroundImage: "linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
  },
  center: {
    position: "relative", zIndex: 2,
    maxWidth: 580, width: "90%",
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 24, textAlign: "center",
  },
  badge: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)",
    borderRadius: 100, padding: "6px 16px",
    fontSize: 12, color: "var(--accent)", fontFamily: "var(--font-mono)",
    letterSpacing: "0.05em",
  },
  dot: {
    width: 7, height: 7, borderRadius: "50%", background: "var(--accent)",
    display: "inline-block", animation: "pulse-glow 2s infinite",
  },
  h1: {
    fontSize: "clamp(52px, 10vw, 80px)", fontWeight: 800,
    fontFamily: "var(--font-display)", letterSpacing: "-2px",
    lineHeight: 1, color: "var(--text)",
  },
  h1green: { color: "var(--accent)" },
  sub: {
    fontSize: 16, color: "var(--muted2)", lineHeight: 1.7,
    maxWidth: 460,
  },
  form: { display: "flex", gap: 10, width: "100%", flexWrap: "wrap", justifyContent: "center" },
  inputWrap: {
    flex: 1, minWidth: 260,
    display: "flex", alignItems: "center", gap: 10,
    background: "var(--bg2)", border: "1px solid var(--border2)",
    borderRadius: 8, padding: "0 16px", height: 52,
    fontFamily: "var(--font-mono)",
  },
  prompt: { color: "var(--accent)", fontSize: 16, fontWeight: 700 },
  input: {
    flex: 1, background: "transparent", border: "none", outline: "none",
    color: "var(--text)", fontSize: 15, fontFamily: "var(--font-mono)",
    caretColor: "transparent",
  },
  cursor: { color: "var(--accent)", fontSize: 18, lineHeight: 1 },
  btn: {
    height: 52, padding: "0 28px", borderRadius: 8,
    background: "var(--accent)", color: "#000",
    border: "none", cursor: "pointer",
    fontSize: 15, fontWeight: 700, fontFamily: "var(--font-display)",
    letterSpacing: "-0.3px", transition: "opacity 0.15s",
    whiteSpace: "nowrap",
  },
  loadingBox: {
    display: "flex", alignItems: "center", gap: 10,
    background: "var(--bg2)", border: "1px solid var(--border)",
    borderRadius: 8, padding: "12px 20px",
  },
  loadingDot: {
    width: 8, height: 8, borderRadius: "50%", background: "var(--accent)",
    animation: "pulse-glow 1s infinite",
  },
  error: {
    color: "#f87171", fontFamily: "var(--font-mono)", fontSize: 13,
    background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
    padding: "10px 16px", borderRadius: 8,
  },
  features: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8 },
  feature: {
    fontSize: 11, fontFamily: "var(--font-mono)",
    color: "var(--muted)", border: "1px solid var(--border)",
    borderRadius: 100, padding: "4px 12px",
  },
};
