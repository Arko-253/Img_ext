# Picfin - Find Your Photos Instantly

A cutting-edge face recognition application that helps you find your photos in event albums instantly. No endless scrolling. Just your moment.

## 🎯 Overview

Picfin combines advanced AI-powered face detection with a sleek, modern interface to help you search through large photo datasets in seconds. Perfect for events, parties, and digital archives.

**Tech Stack:**
- **Frontend:** Vue 3 + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **AI Engine:** Python + PyTorch + FAISS
- **Face Recognition:** FaceNet + MTCNN

---

## 📋 Project Structure

```
face/
├── ai/                    # AI engine for face recognition
│   ├── ai_engine.py      # Core ML logic
│   ├── dataset/          # Training/reference images
│   └── requirements.txt  # Python dependencies
├── server/               # Express backend API
│   ├── server.js         # Main server file
│   ├── package.json      # Node dependencies
│   ├── uploads/          # Temporary upload storage
│   └── results/          # Query results storage
├── ui/                   # Vue 3 frontend
│   ├── src/
│   │   ├── App.vue       # Main component
│   │   ├── main.js       # Vue entry point
│   │   └── style.css     # Global styles
│   ├── public/
│   │   └── textures/     # Background texture assets
│   └── package.json      # Node dependencies
└── .gitignore            # Git ignore rules
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+** (for AI engine)
- **Node.js 16+** (for server & UI)
- **CUDA 11.8+** (optional, for GPU acceleration)
- **Git**

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/picfin.git
cd face
```

#### 2. AI Engine Setup
```bash
cd ai

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 3. Server Setup
```bash
cd ../server

# Install dependencies
npm install

# Start the server (runs on http://localhost:5000)
npm start
```

#### 4. UI Setup
```bash
cd ../ui

# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev
```

---

## 🎨 Features

✅ **AI-Powered Face Recognition** - State-of-the-art FaceNet embeddings  
✅ **Fast Search** - FAISS indexing for sub-second queries  
✅ **Responsive Design** - Works on mobile, tablet, and desktop  
✅ **Gen Z Aesthetic** - Modern, textured UI with intentional imperfection  
✅ **Privacy-Focused** - Local processing, no cloud uploads  
✅ **Batch Processing** - Search through entire photo collections  

---

## 📱 Usage

1. **Open the App:** Navigate to `http://localhost:5173`

2. **Upload Query Image:** Select a photo of yourself from the event

3. **Upload Dataset:** Upload a ZIP file containing all event photos

4. **Search:** Click "Find Me" and wait for results

5. **Download:** Results are automatically downloaded as a ZIP file

---

## 🔧 Configuration

### AI Engine (`ai/ai_engine.py`)
- **Model:** InceptionResnetV1 (pretrained on VGGFace2)
- **Detection:** MTCNN (Multi-task Cascaded Convolutional Networks)
- **Indexing:** FAISS (Facebook AI Similarity Search)
- **Device:** Auto-detects GPU/CPU

### Server (`server/server.js`)
- **Port:** 5000 (configurable)
- **Upload Limit:** 100MB (configurable in multer)
- **CORS:** Enabled for development

### UI (`ui/src/App.vue`)
- **API Endpoint:** `http://localhost:5000`
- **Fonts:** Sekuya (headings), Doto (body)
- **Colors:** Deep burgundy (#120807) + Neon red (#ff2e4d)

---

## 🔐 Security & Environment Variables

### Setup Environment Files

1. **Copy `.env.example` to `.env`:**
   ```bash
   cp .env.example .env
   ```

2. **Frontend Environment** (`ui/.env`):
   ```env
   # API endpoint
   VITE_API_URL=http://localhost:5000
   VITE_ENV=development
   ```

3. **Root Environment** (`.env`):
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   MAX_FILE_SIZE=104857600
   UPLOAD_TIMEOUT=300000

   # Frontend Configuration
   VITE_API_URL=http://localhost:5000
   VITE_ENV=development

   # CORS & Security
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

### Production Configuration

For production, update `VITE_API_URL` to your deployed backend:
```env
# Development
VITE_API_URL=http://localhost:5000

# Production
VITE_API_URL=https://api.yourdomain.com
```

**Important:** Never commit `.env` files to Git. They're in `.gitignore` by default.

---

## 📦 Building for Production

### Frontend Build
```bash
cd ui
npm run build
# Output in: ui/dist/
```

### Backend Deployment
```bash
cd server
npm install --production
npm start
```

### AI Engine Deployment
```bash
cd ai
pip install -r requirements.txt
# Make sure GPU drivers are installed if using CUDA
```

---

## 🤝 API Endpoints

### `POST /search`
Search for a face in a photo collection.

**Request:**
```bash
curl -X POST http://localhost:5000/search \
  -F "query=@photo.jpg" \
  -F "dataset=@photos.zip"
```

**Response:** ZIP file containing matching images

---

## 🐛 Troubleshooting

### "CUDA out of memory"
- Reduce `BATCH_SIZE` in `.env`
- Use CPU mode: `DEVICE=cpu`

### "No module named 'faiss'"
```bash
pip install faiss-cpu  # CPU version
# or
pip install faiss-gpu  # GPU version (requires CUDA)
```

### "Connection refused" on localhost
- Ensure server is running: `npm start` in `server/`
- Check ports: 5000 (server) and 5173 (UI)

### Textures not showing
- Ensure textures are in `ui/public/textures/`
- Check file names: `grain.png` and `paper.png`

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| Query Time | < 2 seconds |
| Database Size | Up to 10,000 images |
| Accuracy | 95%+ (varies by image quality) |
| Memory Usage | ~4GB (GPU) / ~8GB (CPU) |

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@picfin.dev

---

## 🎉 Acknowledgments

- **FaceNet:** Schroff et al., "FaceNet: A Unified Embedding for Face Recognition and Clustering"
- **FAISS:** Facebook AI Research
- **PyTorch:** Meta AI
- **Vue.js:** Evan You & Community

---

**Made with ❤️ for finding your memories**

Last updated: April 29, 2026
