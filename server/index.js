const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Groq = require("groq-sdk");

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/roast", async (req, res) => {
  const { username, stats, repos, user } = req.body;

  const topLang = stats.topLanguages[0]?.lang || "mystery language";
  const peakTime =
    stats.peakHour < 6 ? "the dead of night"
    : stats.peakHour < 12 ? "the morning"
    : stats.peakHour < 18 ? "work hours"
    : "the evening";

  const prompt = `You are DevPulse — a sharp, witty developer analyst. Analyze this GitHub profile and give a SHORT, punchy personality verdict. Mix roasting with genuine insight. Be funny but not mean. Max 4 sentences.

Developer: ${username}
Real name: ${user.name || "unknown"}
Top language: ${topLang}
Public repos: ${user.publicRepos}
Followers: ${user.followers}
Current streak: ${stats.streak} days
Total recent commits: ${stats.totalCommits}
Codes most at: ${peakTime} (${stats.peakHour}:00)
Peak coding day: ${stats.peakDay}
Top repos: ${repos.map((r) => r.name).join(", ")}
Repo descriptions: ${repos.map((r) => r.description).filter(Boolean).join(" | ")}

Give the verdict. Be specific, reference their actual data. Make it memorable.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.9,
    });

    const roast = completion.choices[0]?.message?.content;
    if (!roast) return res.status(500).json({ error: "No response from Groq" });

    res.json({ roast });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/github/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const headers = { "User-Agent": "DevPulse-App" };
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, { headers }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers }),
    ]);

    if (!userRes.ok) {
      return res.status(userRes.status).json({ error: "GitHub user not found" });
    }

    const [user, repos, events] = await Promise.all([
      userRes.json(),
      reposRes.json(),
      eventsRes.json(),
    ]);

    const langCount = {};
    repos.forEach((r) => {
      if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
    });
    const topLanguages = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([lang, count]) => ({ lang, count }));

    const hourMap = Array(24).fill(0);
    const dayMap = Array(7).fill(0);
    let totalCommits = 0;
    const commitDates = [];

    events.forEach((e) => {
      if (e.type === "PushEvent") {
        const d = new Date(e.created_at);
        hourMap[d.getHours()]++;
        dayMap[d.getDay()]++;
        totalCommits += e.payload?.commits?.length || 0;
        commitDates.push(e.created_at);
      }
    });

    const uniqueDays = [...new Set(commitDates.map((d) => d.slice(0, 10)))].sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().slice(0, 10);
    let checkDate = today;
    for (const day of uniqueDays) {
      if (day === checkDate) {
        streak++;
        const prev = new Date(checkDate);
        prev.setDate(prev.getDate() - 1);
        checkDate = prev.toISOString().slice(0, 10);
      } else break;
    }

    const topRepos = repos
      .filter((r) => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((r) => ({
        name: r.name,
        stars: r.stargazers_count,
        language: r.language,
        description: r.description,
        url: r.html_url,
        updated: r.pushed_at,
      }));

    const peakHour = hourMap.indexOf(Math.max(...hourMap));
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const peakDay = days[dayMap.indexOf(Math.max(...dayMap))];

    res.json({
      user: {
        login: user.login,
        name: user.name,
        avatar: user.avatar_url,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        publicRepos: user.public_repos,
        location: user.location,
        company: user.company,
        blog: user.blog,
        createdAt: user.created_at,
      },
      stats: { totalCommits, streak, peakHour, peakDay, topLanguages, hourMap, dayMap },
      repos: topRepos,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`DevPulse server on port ${PORT}`);
  console.log(`Groq key loaded: ${!!process.env.GROQ_API_KEY}`);
});