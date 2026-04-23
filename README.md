[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-00ff88?style=for-the-badge)]
(https://devpulse-y0w9.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-View%20Code-181717?style=for-the-badge&logo=github)]
(https://github.com/vidya333/devpulse)

# ⚡ DevPulse — Your GitHub, Decoded

A real-time GitHub intelligence dashboard. Enter any GitHub username and get a beautiful breakdown of commit patterns, peak coding hours, language stats, top repos, and an AI-generated personality verdict.

**Built with:** MongoDB-free MERN (React + Express + Node) · GitHub Public API · Claude AI

---

## ✨ Features

- 🔍 Search any public GitHub profile
- 📊 Commit hour heatmap (24-bar chart)
- 📅 Day-of-week activity chart
- 🌐 Top languages breakdown
- 🔥 Current streak tracker
- 📁 Top starred repos
- ⚡ AI-generated personality verdict (roast/praise)
- 🟢 Live data badge — always fresh

---

## 🚀 Quick Start (Local)

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/devpulse.git
cd devpulse
```

### 2. Set up the server

```bash
cd server
cp .env.example .env
# Edit .env and add your keys
npm install
```

### 3. Set up the client

```bash
cd ../client
npm install
```

### 4. Run both together

```bash
# From root
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔑 Environment Variables

### `server/.env`

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Yes | Get from [console.anthropic.com](https://console.anthropic.com) |
| `GITHUB_TOKEN` | Optional | Increases rate limit from 60 to 5000 req/hr. Get from GitHub Settings → Developer settings → Personal access tokens |
| `PORT` | Optional | Default: 5000 |

---

## 🌐 Deploy to Render (Free, ~5 mins)

### Backend (Web Service)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo
4. Set:
   - **Root directory:** `server`
   - **Build command:** `npm install`
   - **Start command:** `node index.js`
5. Add environment variables: `ANTHROPIC_API_KEY`, `GITHUB_TOKEN`
6. Deploy → copy the URL (e.g. `https://devpulse-api.onrender.com`)

### Frontend (Static Site)

1. Go to Render → New → Static Site
2. Connect your repo
3. Set:
   - **Root directory:** `client`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `dist`
4. Add env variable: `VITE_API_URL=https://devpulse-api.onrender.com`
5. Update `client/vite.config.js` to use `VITE_API_URL` for the proxy in production

---

## 🛠 Alternative Deploy: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

Set env vars in Railway dashboard.

---

## 📁 Project Structure

```
devpulse/
├── server/
│   ├── index.js          # Express API + GitHub proxy + AI endpoint
│   ├── package.json
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   └── Dashboard.jsx
│   │   └── components/
│   │       ├── StatCard.jsx
│   │       ├── HourChart.jsx
│   │       ├── LangChart.jsx
│   │       └── RepoCard.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── .env.example
└── package.json          # Root with concurrently
```

---

## 🔧 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite |
| Backend | Node.js, Express |
| AI | Anthropic Claude API |
| Data | GitHub REST API v3 |
| Deploy | Render / Railway |

---

## 📝 Resume Line

> **DevPulse** — Full-stack developer analytics dashboard. Real-time GitHub data visualization with AI-powered personality analysis. Built with React, Node.js/Express, and Claude API. Deployed on Render.

---

## 📄 License

MIT
