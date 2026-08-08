import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// In-Memory & File-backed Database Store
const DATA_FILE = path.join(__dirname, 'db_store.json');

function loadDatabase() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch (e) {
      console.error('Error reading db_store.json', e);
    }
  }
  return {
    users: [],
    watchHistory: [],
    customRatings: {}
  };
}

function saveDatabase(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving db_store.json', e);
  }
}

let db = loadDatabase();

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Cineverse Production Cinema API'
  });
});

// Sync / Record User Watch Actions
app.post('/api/watch', (req, res) => {
  const { movieId, rating, isWatched } = req.body;
  if (!movieId) {
    return res.status(400).json({ error: 'movieId is required' });
  }

  db.watchHistory.unshift({
    movieId,
    rating: rating || 20,
    isWatched: !!isWatched,
    timestamp: new Date().toISOString()
  });

  if (rating) {
    db.customRatings[movieId] = rating;
  }

  saveDatabase(db);
  res.json({ success: true, message: `Recorded watch action for ${movieId}` });
});

// Fetch Server State
app.get('/api/state', (req, res) => {
  res.json({
    success: true,
    data: db
  });
});

// Serve Static Frontend Assets from /dist
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback for client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('<h1>Cineverse API is Running</h1><p>Please run `npm run build` to compile the frontend assets.</p>');
  });
}

app.listen(PORT, () => {
  console.log(`🎬 Cineverse Production Server running on port ${PORT}`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
});
