import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("cricket_career.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    userId TEXT,
    name TEXT,
    country TEXT,
    role TEXT,
    batting_style TEXT,
    bowling_style TEXT,
    age INTEGER,
    status TEXT,
    current_team TEXT,
    net_worth REAL,
    popularity INTEGER,
    form_score INTEGER,
    technique INTEGER, timing INTEGER, power INTEGER, temperament INTEGER, spin_skill INTEGER, pace_skill INTEGER, shot_selection INTEGER,
    speed INTEGER, accuracy INTEGER, swing_turn INTEGER, variations INTEGER, death_bowling INTEGER, stamina INTEGER,
    catching INTEGER, throw_accuracy INTEGER, reflex INTEGER, agility INTEGER,
    confidence INTEGER, work_ethic INTEGER, leadership INTEGER, big_match_temperament INTEGER,
    fitness INTEGER, injury_resistance INTEGER, recovery_speed INTEGER,
    media_pressure INTEGER DEFAULT 0,
    slump_active INTEGER DEFAULT 0,
    slump_duration INTEGER DEFAULT 0,
    slump_penalty INTEGER DEFAULT 0,
    workload_red INTEGER DEFAULT 0,
    workload_white INTEGER DEFAULT 0,
    team_morale INTEGER DEFAULT 70,
    dressing_room_trust INTEGER DEFAULT 70,
    archetype TEXT DEFAULT 'Balanced',
    greatness_index REAL DEFAULT 0,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS world_records (
    id TEXT PRIMARY KEY,
    category TEXT,
    record_name TEXT,
    holder_name TEXT,
    value REAL,
    unit TEXT,
    format TEXT,
    date_set DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contracts (
    id TEXT PRIMARY KEY,
    player_id TEXT,
    contract_type TEXT,
    team TEXT,
    annual_value REAL,
    start_date DATETIME,
    end_date DATETIME,
    status TEXT,
    created DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS franchise_contracts (
    id TEXT PRIMARY KEY,
    player_id TEXT,
    team_id TEXT,
    contract_value REAL,
    duration INTEGER,
    start_date DATETIME,
    end_date DATETIME,
    status TEXT,
    earnings_to_date REAL,
    performance_bonuses TEXT,
    created DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS franchise_auctions (
    id TEXT PRIMARY KEY,
    auction_id TEXT,
    season INTEGER,
    format TEXT,
    results TEXT,
    created DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS career_decisions (
    id TEXT PRIMARY KEY,
    player_id TEXT,
    decision_id TEXT,
    decision_type TEXT,
    decision_text TEXT,
    options_chosen TEXT,
    consequences TEXT,
    impact_on_career TEXT,
    date_made DATETIME,
    created DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS injuries (
    id TEXT PRIMARY KEY,
    player_id TEXT,
    injury_type TEXT,
    severity TEXT,
    start_date DATETIME,
    recovery_date DATETIME,
    matches_missed INTEGER,
    created DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS stadiums (
    id TEXT PRIMARY KEY,
    name TEXT,
    location TEXT,
    capacity INTEGER
  );

  CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    team_name TEXT,
    country TEXT,
    ranking_points INTEGER DEFAULT 100
  );

  CREATE TABLE IF NOT EXISTS player_rankings (
    id TEXT PRIMARY KEY,
    player_id TEXT,
    format TEXT,
    category TEXT, -- 'batting', 'bowling', 'all_rounder'
    points INTEGER,
    rank INTEGER,
    updated DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Initial Data
const stadiumCount = db.prepare("SELECT COUNT(*) as count FROM stadiums").get() as any;
if (stadiumCount.count === 0) {
  const stadiums = [
    { id: 's1', name: "Lord's Cricket Ground", location: 'London, UK', capacity: 31100 },
    { id: 's2', name: 'Melbourne Cricket Ground', location: 'Melbourne, Australia', capacity: 100024 },
    { id: 's3', name: 'Eden Gardens', location: 'Kolkata, India', capacity: 68000 },
    { id: 's4', name: 'The Wanderers', location: 'Johannesburg, South Africa', capacity: 34000 },
    { id: 's5', name: 'Kensington Oval', location: 'Bridgetown, Barbados', capacity: 28000 },
    { id: 's6', name: 'Narendra Modi Stadium', location: 'Ahmedabad, India', capacity: 132000 },
    { id: 's7', name: 'The Oval', location: 'London, UK', capacity: 27500 }
  ];
  const insertStadium = db.prepare("INSERT INTO stadiums (id, name, location, capacity) VALUES (?, ?, ?, ?)");
  stadiums.forEach(s => insertStadium.run(s.id, s.name, s.location, s.capacity));
}

const teamCount = db.prepare("SELECT COUNT(*) as count FROM teams").get() as any;
if (teamCount.count === 0) {
  const teams = [
    { id: 't1', team_name: 'India', country: 'India', ranking_points: 120 },
    { id: 't2', team_name: 'Australia', country: 'Australia', ranking_points: 118 },
    { id: 't3', team_name: 'England', country: 'England', ranking_points: 115 },
    { id: 't4', team_name: 'Pakistan', country: 'Pakistan', ranking_points: 108 },
    { id: 't5', team_name: 'South Africa', country: 'South Africa', ranking_points: 105 },
    { id: 't6', team_name: 'New Zealand', country: 'New Zealand', ranking_points: 102 },
    { id: 't7', team_name: 'West Indies', country: 'West Indies', ranking_points: 95 },
    { id: 't8', team_name: 'Sri Lanka', country: 'Sri Lanka', ranking_points: 92 },
    { id: 't9', team_name: 'Mumbai Indians', country: 'India', ranking_points: 150 },
    { id: 't10', team_name: 'Chennai Super Kings', country: 'India', ranking_points: 148 },
    { id: 't11', team_name: 'Royal Challengers Bangalore', country: 'India', ranking_points: 140 }
  ];
  const insertTeam = db.prepare("INSERT INTO teams (id, team_name, country, ranking_points) VALUES (?, ?, ?, ?)");
  teams.forEach(t => insertTeam.run(t.id, t.team_name, t.country, t.ranking_points));
}

const recordCount = db.prepare("SELECT COUNT(*) as count FROM world_records").get() as any;
if (recordCount.count === 0) {
  const records = [
    // Batting Records
    { id: 'r1', category: 'batting', record_name: 'Fastest ODI Century', holder_name: 'AB de Villiers', value: 31, unit: 'balls', format: 'ODI' },
    { id: 'r2', category: 'batting', record_name: 'Highest Test Score', holder_name: 'Brian Lara', value: 400, unit: 'runs', format: 'Test' },
    { id: 'r3', category: 'batting', record_name: 'Most ODI Runs', holder_name: 'Sachin Tendulkar', value: 18426, unit: 'runs', format: 'ODI' },
    { id: 'r4', category: 'batting', record_name: 'Most Test Runs', holder_name: 'Sachin Tendulkar', value: 15921, unit: 'runs', format: 'Test' },
    { id: 'r5', category: 'batting', record_name: 'Most ODI Centuries', holder_name: 'Virat Kohli', value: 50, unit: 'centuries', format: 'ODI' },
    { id: 'r6', category: 'batting', record_name: 'Highest ODI Score', holder_name: 'Rohit Sharma', value: 264, unit: 'runs', format: 'ODI' },
    { id: 'r7', category: 'batting', record_name: 'Fastest T20I Century', holder_name: 'David Miller', value: 35, unit: 'balls', format: 'T20I' },
    
    // Bowling Records
    { id: 'r8', category: 'bowling', record_name: 'Most Test Wickets', holder_name: 'Muttiah Muralitharan', value: 800, unit: 'wickets', format: 'Test' },
    { id: 'r9', category: 'bowling', record_name: 'Most ODI Wickets', holder_name: 'Muttiah Muralitharan', value: 534, unit: 'wickets', format: 'ODI' },
    { id: 'r10', category: 'bowling', record_name: 'Best Test Figures (Innings)', holder_name: 'Jim Laker', value: 10, unit: 'wickets', format: 'Test' },
    { id: 'r11', category: 'bowling', record_name: 'Best ODI Figures', holder_name: 'Chaminda Vaas', value: 8, unit: 'wickets', format: 'ODI' }
  ];
  const insertRecord = db.prepare("INSERT INTO world_records (id, category, record_name, holder_name, value, unit, format) VALUES (?, ?, ?, ?, ?, ?, ?)");
  records.forEach(r => insertRecord.run(r.id, r.category, r.record_name, r.holder_name, r.value, r.unit, r.format));
}

// Seed AI Players for Rankings
const aiPlayerCount = db.prepare("SELECT COUNT(*) as count FROM players WHERE userId = 'AI_PLAYER'").get() as any;
if (aiPlayerCount.count === 0) {
  const aiPlayers = [
    { id: 'ai1', name: 'Virat Kohli', country: 'India', role: 'Batter', technique: 95, confidence: 98, greatness_index: 9500 },
    { id: 'ai2', name: 'Steve Smith', country: 'Australia', role: 'Batter', technique: 97, confidence: 95, greatness_index: 9200 },
    { id: 'ai3', name: 'Joe Root', country: 'England', role: 'Batter', technique: 94, confidence: 94, greatness_index: 9100 },
    { id: 'ai4', name: 'Kane Williamson', country: 'New Zealand', role: 'Batter', technique: 96, confidence: 92, greatness_index: 9000 },
    { id: 'ai5', name: 'Babar Azam', country: 'Pakistan', role: 'Batter', technique: 92, confidence: 90, greatness_index: 8500 },
    { id: 'ai6', name: 'Jasprit Bumrah', country: 'India', role: 'Bowler', technique: 98, confidence: 96, greatness_index: 8800 },
    { id: 'ai7', name: 'Pat Cummins', country: 'Australia', role: 'Bowler', technique: 95, confidence: 95, greatness_index: 8700 },
    { id: 'ai8', name: 'Rashid Khan', country: 'Afghanistan', role: 'Bowler', technique: 94, confidence: 97, greatness_index: 8600 }
  ];
  
  const insertAI = db.prepare(`
    INSERT INTO players (id, userId, name, country, role, technique, confidence, greatness_index, status) 
    VALUES (?, 'AI_PLAYER', ?, ?, ?, ?, ?, ?, 'Active')
  `);
  
  aiPlayers.forEach(p => insertAI.run(p.id, p.name, p.country, p.role, p.technique, p.confidence, p.greatness_index));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for development with Vite
  }));
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Reset Career Endpoint
  app.post("/api/reset-career", (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    try {
      // Delete all data associated with this user
      // Note: In this simple implementation, we delete by player_id which we find from players table
      const player = db.prepare("SELECT id FROM players WHERE userId = ?").get(userId) as any;
      
      if (player) {
        db.prepare("DELETE FROM contracts WHERE player_id = ?").run(player.id);
        db.prepare("DELETE FROM franchise_contracts WHERE player_id = ?").run(player.id);
        db.prepare("DELETE FROM career_decisions WHERE player_id = ?").run(player.id);
        db.prepare("DELETE FROM injuries WHERE player_id = ?").run(player.id);
        db.prepare("DELETE FROM players WHERE id = ?").run(player.id);
      }
      
      res.json({ status: "success", message: "Career data reset successfully" });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  // Generic collection handler to mimic PocketBase
  app.get("/api/collections/:collection/records", (req, res) => {
    const { collection } = req.params;
    const { filter, sort } = req.query;
    
    let query = `SELECT * FROM ${collection.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)}`;
    const params: any[] = [];

    if (filter) {
      // Very basic filter parsing for the demo
      const match = (filter as string).match(/(\w+)\s*=\s*"([^"]+)"/);
      if (match) {
        query += ` WHERE ${match[1]} = ?`;
        params.push(match[2]);
      }
    }

    if (sort) {
      const sortField = (sort as string).startsWith("-") ? (sort as string).substring(1) : sort;
      const order = (sort as string).startsWith("-") ? "DESC" : "ASC";
      query += ` ORDER BY ${sortField} ${order}`;
    }

    try {
      const stmt = db.prepare(query);
      const records = stmt.all(...params);
      res.json({ items: records });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.post("/api/collections/:collection/records", (req, res) => {
    const { collection } = req.params;
    const data = req.body;
    const tableName = collection.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    
    if (!data.id) data.id = Math.random().toString(36).substring(2, 15);
    
    // Handle JSON fields
    const processedData = { ...data };
    for (const key in processedData) {
      if (typeof processedData[key] === 'object') {
        processedData[key] = JSON.stringify(processedData[key]);
      }
    }

    const keys = Object.keys(processedData);
    const values = Object.values(processedData);
    const placeholders = keys.map(() => "?").join(", ");
    
    try {
      const stmt = db.prepare(`INSERT INTO ${tableName} (${keys.join(", ")}) VALUES (${placeholders})`);
      stmt.run(...values);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
