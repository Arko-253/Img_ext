# Deploy to Render.com

Complete guide to deploy Picfin backend to Render.com with proper configuration.

## 📋 Prerequisites

- GitHub repository with Picfin code
- Render.com account (free tier available)
- Frontend deployed (Vercel, Netlify, or static hosting)

---

## 🚀 Step-by-Step Deployment

### Step 1: Push Code to GitHub

```bash
cd e:\face
git add .
git commit -m "Render deployment configuration"
git push origin main
```

### Step 2: Create Render Service

1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `Picfin` repository

### Step 3: Configure Service

**Basic Settings:**
- **Name:** `picfin-backend`
- **Root Directory:** `./server`
- **Environment:** `Node`
- **Node Version:** `18.17.0`
- **Build Command:** (auto-populated from render.yaml)
- **Start Command:** `node server.js`
- **Plan:** Free tier (or paid for production)

**Environment Variables:**

Set these on Render dashboard:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Set to production |
| `CORS_ORIGINS` | `https://your-frontend.vercel.app` | Your frontend domain |
| `MAX_FILE_SIZE` | `104857600` | 100MB limit |
| `PORT` | Leave blank | Render auto-assigns |

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Clone repository
   - Run build command (install Python, pip dependencies, npm install)
   - Start the server
3. You'll get a URL like: `https://picfin-backend.onrender.com`

---

## 🔗 Frontend Configuration

Update your frontend environment variables:

**For production (Vercel):**

```env
VITE_API_URL=https://picfin-backend.onrender.com
```

Or let it auto-detect via `/api/config` endpoint.

---

## 📝 render.yaml Explanation

```yaml
services:
  - type: web                          # Web service
    name: picfin-backend              # Service name
    env: node                          # Node.js environment
    nodeVersion: 18.17.0              # Specify Node version
    plan: free                         # Free tier
    rootDir: ./server                 # Working directory
    
    buildCommand: |                    # Build steps
      apt-get update && apt-get install -y python3 python3-pip
      pip3 install -r ../ai/requirements.txt
      npm install --production        # Production deps only
    
    startCommand: node server.js       # Start command
    
    envVars:
      - key: PORT
        sync: false                    # Render auto-assigns
      - key: NODE_ENV
        value: production
      - key: CORS_ORIGINS
        sync: false                    # Set in Render dashboard
      - key: MAX_FILE_SIZE
        value: 104857600
      - key: NODE_OPTIONS
        value: --max-old-space-size=512  # Memory optimization
```

---

## 🔐 Environment Variables on Render

### Automatic Variables (Render provides these)
- `PORT` - Auto-assigned port
- `RENDER_EXTERNAL_URL` - Your service URL

### You Must Set
- `CORS_ORIGINS` - Frontend URL(s)
- `NODE_ENV` - Set to `production`

### How to Set Variables on Render

1. Go to service → **"Environment"**
2. Add each variable
3. Click **"Save"**
4. Service redeploys automatically

---

## ✅ Verification

### Check Service Status

1. Go to service page on Render
2. Look for **"Live"** status (green)
3. Click service URL

### Test Backend

```bash
# Test config endpoint
curl https://picfin-backend.onrender.com/api/config

# Response should be:
{
  "apiUrl": "https://picfin-backend.onrender.com",
  "environment": "production"
}

# Test CORS
curl -H "Origin: https://your-frontend.vercel.app" \
  https://picfin-backend.onrender.com/api/config
```

### View Logs

1. Service page → **"Logs"**
2. Check for startup messages and errors
3. Look for: `Server running on port ...`

---

## 🐛 Troubleshooting

### Build Fails: "python3 not found"

**Issue:** Python3 not installed
**Solution:** Check render.yaml includes:
```bash
apt-get install -y python3 python3-pip
```

### Build Fails: "requirements.txt not found"

**Issue:** Incorrect path to requirements.txt
**Solution:** Ensure render.yaml has correct path:
```bash
pip3 install -r ../ai/requirements.txt
```

### Service crashes after deploy

**Check logs for:**
1. Missing environment variables
2. Port conflicts
3. File permission issues

**Solution:**
```bash
# SSH into service
render sh

# Check environment
printenv | grep -E "PORT|NODE_ENV|CORS"

# Check files
ls -la ../ai/requirements.txt
```

### CORS errors from frontend

**Issue:** Frontend can't reach backend
**Solution:**
1. Set `CORS_ORIGINS` to your frontend domain
2. Include protocol: `https://domain.com`
3. Separate multiple origins with comma: `https://domain1.com,https://domain2.com`

### "Cannot find module" errors

**Issue:** Dependencies not installed
**Solution:**
1. Check `npm install` runs in build
2. Verify package.json exists in `/server`
3. Render logs will show install progress

### Timeout errors

**Issue:** AI processing too slow
**Solution:**
1. Increase Render plan (more CPU/memory)
2. Optimize AI engine for speed
3. Set `NODE_OPTIONS: --max-old-space-size=1024`

---

## 🚀 Advanced Configuration

### Use Custom Domain

1. Render dashboard → Service → **"Custom Domains"**
2. Add domain (e.g., `api.picfin.com`)
3. Configure DNS records per Render instructions
4. Update `CORS_ORIGINS` and frontend `VITE_API_URL`

### Enable HTTPS (Auto)

Render automatically provisions SSL certificates. Your service is HTTPS by default.

### Upgrade from Free Tier

Free tier has limitations:
- Services spin down after 15 minutes
- Limited CPU/memory
- No custom domains

To upgrade:
1. Service → **"Settings"** → **"Plan"**
2. Choose **"Starter"** or **"Standard"**
3. Paid plans are always-on

### Background Jobs (Optional)

For cleanup tasks, use cron jobs:
```yaml
jobs:
  - type: cron
    name: cleanup
    schedule: "0 2 * * *"  # Daily at 2 AM
    command: node cleanup.js
```

---

## 🔄 Continuous Deployment

Render auto-deploys when you push to main:

1. Push code to GitHub
2. Render detects push
3. Runs build command
4. Deploys if successful
5. Rolls back if failed

To disable auto-deploy:
Service → **"Settings"** → Turn off **"Auto-Deploy"**

---

## 📊 Monitoring

### Check Performance

Render dashboard shows:
- CPU usage
- Memory usage
- Request count
- Response times

### View Real-time Logs

```bash
# SSH into service
render sh

# Tail logs
pm2 logs

# Check disk space
df -h
```

### Set Up Alerts (Paid Plans)

1. Service → **"Alerts"**
2. Configure thresholds
3. Email notifications sent on issues

---

## 💾 Database/Storage

For persistent storage:

### Option 1: PostgreSQL (Render)
```bash
# Create PostgreSQL database
# Connect via DATABASE_URL environment variable
```

### Option 2: AWS S3
```env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=...
```

### Option 3: Persistent Disk (Paid)
1. Service → **"Settings"** → **"Disk"**
2. Add persistent disk
3. Mount at `/data`

---

## 🎯 Common Configurations

### Development Deployment

```env
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,https://localhost:3000
MAX_FILE_SIZE=524288000  # 500MB for testing
```

### Production Deployment

```env
NODE_ENV=production
CORS_ORIGINS=https://app.picfin.com
MAX_FILE_SIZE=104857600  # 100MB limit
NODE_OPTIONS=--max-old-space-size=1024
```

### Docker Alternative

If you prefer Docker instead of render.yaml:

```dockerfile
FROM node:18-alpine

RUN apk add --no-cache python3 py3-pip

WORKDIR /app

COPY ../ai/requirements.txt ./ai/
RUN pip3 install -r ./ai/requirements.txt

COPY server/package*.json ./server/
RUN cd server && npm install --production

COPY server ./server
COPY ai ./ai

WORKDIR /app/server
EXPOSE 5000

CMD ["node", "server.js"]
```

---

## 📞 Support & Resources

- [Render Docs](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [Environment Variables](https://render.com/docs/environment-variables)
- [Troubleshooting](https://render.com/docs/troubleshooting)

---

**Last updated:** April 29, 2026
