import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import axios from "axios";

export default function App() {
  const [view, setView] = useState("landing");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("");

  const msgs = [
    "Scanning your GitHub...",
    "Analyzing commit patterns...",
    "Judging your 2am sessions...",
    "Generating your verdict...",
  ];

  const handleSearch = async (username) => {
    setLoading(true);
    setError("");
    let msgIdx = 0;
    setLoadingMsg(msgs[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % msgs.length;
      setLoadingMsg(msgs[msgIdx]);
    }, 1200);

    try {
      const { data: ghData } = await axios.get(`/api/github/${username}`);
      const { data: roastData } = await axios.post("/api/roast", ghData);
      clearInterval(interval);
      setData({ ...ghData, roast: roastData.roast });
      setView("dashboard");
    } catch (err) {
      clearInterval(interval);
      setError(
        err.response?.data?.error || "Could not fetch that user. Try another username."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setView("landing");
    setData(null);
    setError("");
  };

  if (view === "dashboard" && data) {
    return <Dashboard data={data} onBack={handleBack} />;
  }

  return (
    <LandingPage
      onSearch={handleSearch}
      loading={loading}
      loadingMsg={loadingMsg}
      error={error}
    />
  );
}
