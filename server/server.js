require('dotenv').config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { exec } = require("child_process");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();

// Environment variables
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGINS = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:3000'];
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '104857600'); // 100MB default

// CORS configuration
app.use(cors({
  origin: CORS_ORIGINS,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

console.log(`[${NODE_ENV}] Server starting on port ${PORT}`);
console.log(`[${NODE_ENV}] CORS origins: ${CORS_ORIGINS.join(', ')}`);

const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: MAX_FILE_SIZE }
});

// API Configuration endpoint - returns runtime API URL for frontend
app.get('/api/config', (req, res) => {
  res.json({
    apiUrl: `http://localhost:${PORT}`,
    environment: NODE_ENV
  });
});

app.post(
  "/search",
  upload.fields([
    { name: "query", maxCount: 1 },
    { name: "dataset", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const sessionId = uuidv4();

      const queryPath = req.files["query"][0].path;
      const zipPath = req.files["dataset"][0].path;

      const extractPath = path.join(__dirname, "uploads", sessionId);
      fs.mkdirSync(extractPath, { recursive: true });

      // 🔥 unzip dataset
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(extractPath, true);

      // 🔍 FIX: handle nested folder inside zip
      let datasetPath = extractPath;

      const files = fs.readdirSync(extractPath);
      console.log("Extracted files:", files);

      if (files.length === 1) {
        const possibleFolder = path.join(extractPath, files[0]);

        if (fs.lstatSync(possibleFolder).isDirectory()) {
          datasetPath = possibleFolder;
        }
      }

      console.log("Using dataset path:", datasetPath);

      // 🔥 Python paths (SAFE)
      const pythonPath = path.join(
        __dirname,
        "../ai/.venv/Scripts/python.exe"
      );
      const scriptPath = path.join(__dirname, "../ai/ai_engine.py");

      // 🔥 run AI
      exec(
        `"${pythonPath}" "${scriptPath}" "${queryPath}" "${datasetPath}"`,
        (error, stdout, stderr) => {
          if (error) {
            console.error("Exec error:", error);
            console.error("Stderr:", stderr);
            return res.status(500).send("AI error");
          }

          console.log("AI Output:", stdout);

          let matches;
          try {
            matches = JSON.parse(stdout);
          } catch (err) {
            console.error("JSON Parse error:", stdout);
            return res.status(500).send("Parse error");
          }

          // 🔥 zip matched images
          const resultZip = new AdmZip();

          matches.forEach((file) => {
            if (fs.existsSync(file)) {
              resultZip.addLocalFile(file);
            }
          });

          const resultPath = path.join(
            __dirname,
            "results",
            `${sessionId}.zip`
          );

          resultZip.writeZip(resultPath);

          console.log("Returning zip:", resultPath);

          res.download(resultPath);
        }
      );
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).send("Server error");
    }
  }
);

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${NODE_ENV}`);
});