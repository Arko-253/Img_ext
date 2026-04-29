# Picfin Deployment Guide

Complete guide to deploying Picfin to production with proper environment configuration.

## 🏗️ Architecture

Picfin uses a **runtime configuration system** that works across all deployment scenarios:

1. **Frontend** discovers API URL at runtime via `/api/config` endpoint
2. **Falls back** to build-time environment variable if endpoint unavailable
3. **Environment variables** control server port and CORS settings

---

## 🚀 Local Development

```bash
# Terminal 1: Backend Server
cd server
npm start
# Loads .env or .env.development
# Runs on http://localhost:5000
# Serves /api/config endpoint

# Terminal 2: Frontend
cd ui
npm run dev
# Loads VITE_API_URL from .env.development
# Calls /api/config to get runtime API URL
# Falls back to build-time value if /api/config fails
# Runs on http://localhost:5173
```

---

## 🌍 Production Deployment

### Step 1: Build Frontend

```bash
cd ui
npm run build
# Output: ui/dist/

# The built app includes VITE_API_URL as fallback
# But will prefer /api/config endpoint at runtime
```

### Step 2: Deploy Backend

Deploy `server/` to your server:

```bash
# On production server
cd server
npm install --production
npm start

# Set environment variables
export PORT=8000
export NODE_ENV=production
export CORS_ORIGINS=https://your-frontend.com
```

### Step 3: Deploy Frontend

Deploy `ui/dist/` to static hosting or your server:

```bash
# Serve ui/dist/ at https://your-frontend.com
# Or deploy to: Vercel, Netlify, GitHub Pages, etc.
```

---

## 🔌 How Runtime Configuration Works

### Request Flow

```
User loads https://your-frontend.com
    ↓
Browser executes index.html script
    ↓
Tries: fetch('/api/config') on same origin
    ↓
If same origin:
  ✓ Gets API URL from backend: http://backend-server:8000
If different origin:
  ✗ CORS blocks request, falls back to VITE_API_URL
    ↓
Frontend stores in window.VITE_API_URL
    ↓
App.vue uses window.VITE_API_URL for API calls
```

### Configuration Priorities

Frontend uses this priority order for API URL:

1. `window.VITE_API_URL` (set by /api/config or index.html script)
2. `import.meta.env.VITE_API_URL` (build-time environment variable)
3. `'http://localhost:5000'` (hardcoded fallback)

---

## 📋 Deployment Scenarios

### Scenario 1: Same Server (Frontend + Backend)

**Setup:** Serve both frontend and backend from same domain

```
https://picfin.com/
  ├─ Frontend: served by Nginx/Apache
  └─ Backend: /api/* routed to Node.js

.env (Backend):
PORT=8000
NODE_ENV=production
CORS_ORIGINS=https://picfin.com
```

**Flow:**
1. Frontend loads from https://picfin.com/
2. Calls `/api/config` → Gets `https://picfin.com:8000`
3. Uses backend API from same origin ✓

---

### Scenario 2: Different Domains (CDN + Backend)

**Setup:** Frontend on CDN, backend on separate server

```
Frontend: https://cdn.picfin.com/
Backend:  https://api.picfin.com/

.env (Backend):
PORT=443
NODE_ENV=production
CORS_ORIGINS=https://cdn.picfin.com
VITE_API_URL=https://api.picfin.com
```

**Flow:**
1. Frontend loads from https://cdn.picfin.com/
2. Tries `/api/config` on cdn.picfin.com → blocked by CORS ✗
3. Falls back to build-time `VITE_API_URL` → https://api.picfin.com ✓

---

### Scenario 3: Docker Deployment

**Backend Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY server.js .
COPY ../ai ./ai

ENV NODE_ENV=production
ENV PORT=5000
ENV CORS_ORIGINS=https://frontend.example.com

EXPOSE 5000
CMD ["node", "server.js"]
```

**docker-compose.yml:**

```yaml
version: '3'
services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      PORT: 5000
      CORS_ORIGINS: https://frontend.example.com
    volumes:
      - ./ai:/app/ai

  frontend:
    build: ./ui
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: https://api.example.com
```

Run:
```bash
docker-compose up
```

---

### Scenario 4: Cloud Deployment (AWS/Heroku/Vercel)

#### Backend on Heroku

```bash
# Push to Heroku
git push heroku main

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
heroku config:set CORS_ORIGINS=https://your-frontend.vercel.app
```

#### Frontend on Vercel

```bash
# vercel.json
{
  "env": {
    "VITE_API_URL": "@api_url"
  },
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

Set in Vercel dashboard:
- `VITE_API_URL=https://picfin-backend.herokuapp.com`

---

## 🔐 Environment Variables Reference

### Backend (.env or process.env)

```env
# Server Configuration
PORT=5000                                    # Listen port
NODE_ENV=production                          # Environment mode
MAX_FILE_SIZE=104857600                      # Max upload size (100MB)
UPLOAD_TIMEOUT=300000                        # Request timeout (5 min)

# CORS & Security
CORS_ORIGINS=https://frontend.com            # Allowed origins (comma-separated)
RATE_LIMIT=100                               # Requests per minute

# Logging
LOG_LEVEL=info                               # Log verbosity
DEBUG=false                                  # Detailed logging
```

### Frontend (.env or .env.production)

```env
# Build-time API URL (used as fallback)
VITE_API_URL=https://api.example.com
VITE_ENV=production

# At runtime, frontend tries /api/config first
# Falls back to VITE_API_URL if /api/config fails
```

---

## ✅ Deployment Checklist

- [ ] Backend environment variables set (`PORT`, `NODE_ENV`, `CORS_ORIGINS`)
- [ ] Frontend built with correct `VITE_API_URL` fallback
- [ ] `/api/config` endpoint accessible from backend
- [ ] CORS origins configured correctly
- [ ] SSL/HTTPS enabled in production
- [ ] File upload size limits set appropriately
- [ ] Logs configured and monitored
- [ ] `.env` files NOT committed to Git
- [ ] Database/AI engine configured on backend server
- [ ] Tested end-to-end in production environment

---

## 🧪 Testing Configuration

### Test 1: Frontend Can Reach Backend

```bash
# From browser console
fetch('/api/config')
  .then(r => r.json())
  .then(d => console.log('Config:', d))
```

Expected output:
```json
{
  "apiUrl": "http://localhost:5000",
  "environment": "development"
}
```

### Test 2: API Calls Work

```bash
# Upload test files and verify search works
# Check browser Network tab:
# 1. GET /api/config → should return config
# 2. POST /search → should return ZIP file
```

### Test 3: Fallback Works

```bash
# Simulate /api/config failure (block in browser DevTools)
# Frontend should still work using VITE_API_URL fallback
```

---

## 🚨 Troubleshooting

### "Cannot reach API"

1. **Check backend is running:**
   ```bash
   curl http://localhost:5000/api/config
   ```

2. **Check CORS settings:**
   ```env
   # .env (backend)
   CORS_ORIGINS=http://localhost:5173,https://your-domain.com
   ```

3. **Check network in DevTools:**
   - Look for `/api/config` request
   - If blocked, check CORS headers
   - If 404, backend not serving config endpoint

### "API URL is localhost in production"

1. **Rebuild frontend with correct VITE_API_URL:**
   ```bash
   VITE_API_URL=https://api.example.com npm run build
   ```

2. **Or rely on /api/config endpoint:**
   - Serve frontend from same domain as backend
   - Backend's `/api/config` will return correct URL

### "Cross-origin errors"

**Solution:** Ensure backend serves config with CORS headers:

```javascript
// server.js already includes:
app.use(cors({
  origin: CORS_ORIGINS.split(','),
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
```

Update `CORS_ORIGINS` in `.env` to include frontend domain.

---

## 📚 Additional Resources

- [Express Deployment](https://expressjs.com/en/advanced/best-practice-deployment.html)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Node.js Production](https://nodejs.org/en/docs/guides/nodejs-on-docker/)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Last updated:** April 29, 2026
