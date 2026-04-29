# 🚀 Picfin - Complete Setup Guide

Step-by-step guide to get Picfin running locally.

## ✅ Prerequisites

- **Python 3.8+** - Download from https://www.python.org/
- **Node.js 16+** - Download from https://nodejs.org/
- **Git** - Download from https://git-scm.com/
- **CUDA 11.8+** (optional, for GPU acceleration)

**Verify installations:**
```bash
python --version      # Should be 3.8+
node --version        # Should be 16+
npm --version         # Comes with Node.js
git --version         # Should be 2.0+
```

---

## 📥 Installation Steps

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/picfin.git
cd face
```

### Step 2: Setup AI Engine (Python)

```bash
cd ai

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies (takes ~5-10 minutes first time)
pip install -r requirements.txt

# Verify installation
python -c "import torch; print('PyTorch:', torch.__version__)"
```

**Expected output:** `PyTorch: 2.x.x` or higher

### Step 3: Setup Server (Node.js)

```bash
cd ../server

# Install dependencies
npm install

# Verify installation
npm list express cors multer

# Create uploads and results directories
mkdir -p uploads results
```

### Step 4: Setup UI (Vue + Vite)

```bash
cd ../ui

# Install dependencies
npm install

# Verify installation
npm list vue vite tailwindcss
```

---

## 🎯 Running the Application

### Terminal 1: AI Engine (Python)

```bash
cd face/ai

# Activate virtual environment (if not already active)
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Ready for requests (models load on first use)
echo "AI Engine ready..."
```

### Terminal 2: Backend Server (Node.js)

```bash
cd face/server

# Start server
npm start

# Expected output:
# Server running on http://localhost:5000
```

### Terminal 3: Frontend (Vue + Vite)

```bash
cd face/ui

# Start development server
npm run dev

# Expected output:
# Local: http://localhost:5173
```

### Open Application

Visit: **http://localhost:5173**

---

## 🧪 Testing the Application

### Test with Sample Images

1. **Create test folder:**
   ```bash
   mkdir test_images
   cd test_images
   ```

2. **Add test images:**
   - Download 3-5 photos of yourself
   - Download 10-20 photos of an event/crowd
   - Place all in a ZIP file: `event.zip`

3. **Test via UI:**
   - Upload one of your photos as "Your Face"
   - Upload `event.zip` as "Event Album"
   - Click "Find Me"
   - Wait for results

### Quick Test via cURL

```bash
curl -X POST http://localhost:5000/search \
  -F "query=@path/to/your/photo.jpg" \
  -F "dataset=@path/to/event.zip" \
  -o results.zip

unzip results.zip
```

---

## 🔧 Configuration

### Environment Variables Setup

1. **Copy environment templates:**
   ```bash
   cp .env.example .env
   cp ui/.env.example ui/.env  # or use the provided ui/.env
   ```

2. **Root Configuration (.env):**
   ```env
   # Server
   PORT=5000
   NODE_ENV=development
   MAX_FILE_SIZE=104857600
   UPLOAD_TIMEOUT=300000
   
   # Frontend API
   VITE_API_URL=http://localhost:5000
   VITE_ENV=development
   ```

3. **Frontend Configuration (ui/.env):**
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_ENV=development
   ```

### Changing API Endpoint

To change the API endpoint (e.g., for production):

**Development:**
```env
VITE_API_URL=http://localhost:5000
```

**Production:**
```env
VITE_API_URL=https://api.yourdomain.com
```

The frontend will automatically use this URL from `import.meta.env.VITE_API_URL`.

### AI Engine Configuration

GPU/CPU mode detection (automatic):
```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")
```

---

## ✨ Verification Checklist

- [ ] Python installed and activated
- [ ] Node.js installed
- [ ] Git clone successful
- [ ] AI requirements installed (`pip list | grep torch`)
- [ ] Server dependencies installed (`npm list`)
- [ ] UI dependencies installed (`npm list`)
- [ ] All 3 servers running without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Can upload files successfully
- [ ] Textures display in background

---

## 🐛 Common Issues & Fixes

### Issue: "Command not found: python"
**Solution:** 
- Add Python to PATH
- Restart terminal after installation
- Use `python3` instead of `python`

### Issue: "npm: command not found"
**Solution:**
- Reinstall Node.js
- Ensure `/usr/local/bin` is in PATH
- Restart terminal

### Issue: Virtual environment not activating
**Solution:**
```bash
# Delete and recreate
rm -rf .venv
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux
```

### Issue: "Address already in use" on port 5000
**Solution:**
```bash
# Kill process using port 5000
# macOS/Linux:
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: "ModuleNotFoundError: No module named 'torch'"
**Solution:**
```bash
cd ai
source .venv/bin/activate
pip install --upgrade torch torchvision
```

### Issue: CORS errors in browser console
**Solution:** 
- Ensure server is running on port 5000
- Check `cors()` configuration in `server/server.js`
- Frontend should be on port 5173

### Issue: Textures not showing
**Solution:**
- Verify files exist: `ui/public/textures/grain.png` and `paper.png`
- Check browser console for 404 errors
- Restart development server

---

## 📚 Documentation

Each folder has detailed documentation:
- [Main README](../README.md) - Project overview
- [AI Engine](../ai/README.md) - Face recognition details
- [Server](../server/README.md) - API documentation
- [UI](../ui/README.md) - Frontend guide

---

## 🚀 Next Steps

### Development
- Modify `src/App.vue` for UI changes
- Edit `server/server.js` for backend logic
- Update `ai/ai_engine.py` for ML improvements

### Production Deployment
- Build UI: `cd ui && npm run build`
- Deploy to Vercel, Netlify, or own server
- Deploy backend to Heroku, AWS, or own server
- Ensure AI engine has GPU access

### Optimization
- Add caching layer (Redis)
- Implement database for results
- Add authentication/authorization
- Monitor performance metrics

---

## 🆘 Support

- **Issues?** Check GitHub Issues
- **Questions?** See documentation in each folder
- **Help?** Email: support@picfin.dev

---

## 📝 Notes

- First run takes longer (models download automatically)
- GPU recommended for production
- Store API keys in `.env` files (never commit)
- Keep `.gitignore` in sync with sensitive files

---

**Happy coding! 🎉**

Last updated: April 29, 2026
