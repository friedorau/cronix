import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = openai.responses.create({
  model: "gpt-5-nano",
  input: "Erstelle ein JSON-Object mit einem Array aus Information zu 100 verschiedenen Songs zum Thema Pop Classics. Jedes Array-Element soll ein Objekt bestehend aus „title“ (Songtitel), „artist“ (Interpret) und „year“ (Veröffentlichungsjahr) sein.",
  store: true,
});

response.then((result) => console.log(result.output_text));

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 3000 + i
    });
  }

  setupPrimary();
} else {
  /*const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
    );
  `);*/

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    adapter: createAdapter()
  });

  const __dirname = dirname(fileURLToPath(import.meta.url));

  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });

  var games = { "kingsofpop": { "timeline": [{ "title": "Man in the Mirror", "artist": "Michael Jackson", "year": 1990, "link": "2u2udGmop1z67EPpr91km7" }], "JvTS9AC6gZIm0czEAAAN": { "name": "Friedo", "score": 10, "timeline": [{ "title": "Man in the Mirror", "artist": "Michael Jackson", "year": 1990, "link": "2u2udGmop1z67EPpr91km7" }] } } };
  
  io.on('connection', (socket) => {
    console.log(`user connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
      console.log(`user disconnected: ${socket.id}`);
    });

    socket.on("hello", (arg, callback) => {
      console.log(arg); // "world"
      callback("got it");
    });
    
    socket.on("getGames", (callback) => {
      callback(games);
    });
    
  });

  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
}
