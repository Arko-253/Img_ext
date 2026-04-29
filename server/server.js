require('dotenv').config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { spawn } = require("child_process");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : NODE_ENV === 'production'
    ? []
    : ['http://localhost:5173', 'http://localhost:3000'];

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '104857600');

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS']
}));

console.log(`[${NODE_ENV}] Server starting on port ${PORT}`);

// Ensure required directories exist on startup
['uploads', 'results'].forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
});

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: MAX_FILE_SIZE }
});

app.get('/api/config', (req, res) => {
  res.json({
    apiUrl: `${req.protocol}://${req.get('host')}`,
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
    const sessionId = uuidv4();
    const extractPath = path.join(__dirname, "uploads", sessionId);
    const resultPath = path.join(__dirname, "results", `${sessionId}.zip`);

    // Cleanup helper — call after response or on error
    const cleanup = () => {
      try {
        if (fs.existsSync(extractPath))
          fs.rmSync(extractPath, { recursive: true, force: true });
        if (fs.existsSync(resultPath))
          fs.unlinkSync(resultPath);
        if (req.files?.query?.[0]?.path)
          fs.unlinkSync(req.files.query[0].path);
        if (req.files?.dataset?.[0]?.path)
          fs.unlinkSync(req.files.dataset[0].path);
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    };

    try {
      const queryPath = req.files["query"][0].path;
      const zipPath = req.files["dataset"][0].path;

      fs.mkdirSync(extractPath, { recursive: true });

      const zip = new AdmZip(zipPath);
      zip.extractAllTo(extractPath, true);

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

      const scriptPath = path.join(__dirname, "../ai/ai_engine.py");
      console.log("Spawning python3 with script:", scriptPath);
      console.log("Script exists:", fs.existsSync(scriptPath));

      // Use python3.10 explicitly — matches the version pip3.10 installed packages into
      const pyProcess = spawn("python3", [scriptPath, queryPath, datasetPath]);

      let stdout = "";
      let stderr = "";

      pyProcess.stdout.on("data", (data) => { stdout += data.toString(); });
      pyProcess.stderr.on("data", (data) => { 
        stderr += data.toString(); 
        console.error("PYTHON STDERR:", data.toString()); // add this line
      });

      pyProcess.on("close", (code) => {
        if (code !== 0) {
          console.error("Python error (code", code, "):", stderr);
          cleanup();
          return res.status(500).send("AI error");
        }

        console.log("AI Output:", stdout);

        let matches;
        try {
          matches = JSON.parse(stdout);
        } catch (err) {
          console.error("JSON Parse error:", stdout);
          cleanup();
          return res.status(500).send("Parse error");
        }

        const resultZip = new AdmZip();
        matches.forEach((file) => {
          if (fs.existsSync(file)) resultZip.addLocalFile(file);
        });

        resultZip.writeZip(resultPath);
        console.log("Returning zip:", resultPath);

        res.download(resultPath, () => cleanup());
      });

    } catch (err) {
      console.error("Server error:", err);
      cleanup();
      res.status(500).send("Server error");
    }
  }
);

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${NODE_ENV}`);
});
