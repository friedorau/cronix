import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 3000 + i
    });
  }

  setupPrimary();
} else {
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
    );
  `);

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
