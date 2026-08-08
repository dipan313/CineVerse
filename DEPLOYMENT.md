# 🚀 CINEVERSE — Complete Production Deployment Guide

This guide details how to deploy **CINEVERSE** across all major free-tier cloud platforms in under 2 minutes:

---

## 1. ⚡ Option A: Netlify (Recommended & Instant)

1. Connect your repository to **[Netlify](https://app.netlify.com/)**.
2. Set the build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Netlify will automatically detect `netlify.toml` and `public/_redirects` to handle Single Page App (SPA) routing with zero configuration!
4. Click **Deploy Site** — it will be live immediately on your `.netlify.app` domain.

---

## 2. ▲ Option B: Vercel (Instant Zero-Config)

1. Import your project into **[Vercel](https://vercel.com/new)**.
2. Vercel automatically reads `vercel.json` and configures:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Click **Deploy** — your project is live with global edge caching!

---

## 3. 🖥️ Option C: Render / Railway / Full-Stack Node.js

1. Create a new **Web Service** on **[Render](https://render.com/)** or **[Railway](https://railway.app/)**.
2. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/server.js`
   - **Environment Variable**: `PORT=5000` (or leave default)
3. Your full-stack Express API backend and high-performance frontend will run seamlessly.

---

## 4. 🐳 Option D: Docker Container Deployment

To run containerized anywhere (AWS, DigitalOcean, VPS):
```bash
# Build the Docker image
docker build -t cineverse .

# Run container on port 5000
docker run -p 5000:5000 cineverse
```

---

## 5. 🛠️ Local Testing & Validation

```bash
# Build production bundle
npm run build

# Preview locally
npm run preview
```
