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

/*const response = openai.responses.create({
  model: "gpt-5-nano",
  input: "Erstelle ein JSON-Object mit einem Array aus Information zu 100 verschiedenen Songs zum Thema Pop Classics. Jedes Array-Element soll ein Objekt bestehend aus „title“ (Songtitel), „artist“ (Interpret) und „year“ (Veröffentlichungsjahr) sein.",
  store: true,
});

response.then((result) => console.log(result.output_text));*/

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
  
  const songs = [
    {
      "title": "I Want to Hold Your Hand",
      "artist": "The Beatles",
      "year": 1963,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Can’t Help Falling in Love",
      "artist": "Elvis Presley",
      "year": 1961,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "My Girl",
      "artist": "The Temptations",
      "year": 1965,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Good Vibrations",
      "artist": "The Beach Boys",
      "year": 1966,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Dancing in the Street",
      "artist": "Martha & The Vandellas",
      "year": 1964,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Dancing Queen",
      "artist": "ABBA",
      "year": 1976,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Stayin’ Alive",
      "artist": "Bee Gees",
      "year": 1977,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Let It Be",
      "artist": "The Beatles",
      "year": 1970,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Superstition",
      "artist": "Stevie Wonder",
      "year": 1972,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Hotel California",
      "artist": "Eagles",
      "year": 1976,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Billie Jean",
      "artist": "Michael Jackson",
      "year": 1982,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Girls Just Want to Have Fun",
      "artist": "Cyndi Lauper",
      "year": 1983,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Take On Me",
      "artist": "a-ha",
      "year": 1985,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Sweet Child O’ Mine",
      "artist": "Guns N’ Roses",
      "year": 1987,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Like a Prayer",
      "artist": "Madonna",
      "year": 1989,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "...Baby One More Time",
      "artist": "Britney Spears",
      "year": 1999,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "I Will Always Love You",
      "artist": "Whitney Houston",
      "year": 1992,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Wannabe",
      "artist": "Spice Girls",
      "year": 1996,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Smells Like Teen Spirit",
      "artist": "Nirvana",
      "year": 1991,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Vogue",
      "artist": "Madonna",
      "year": 1990,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Crazy in Love",
      "artist": "Beyoncé feat. Jay-Z",
      "year": 2003,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Since U Been Gone",
      "artist": "Kelly Clarkson",
      "year": 2004,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Yeah!",
      "artist": "Usher ft. Lil Jon & Ludacris",
      "year": 2004,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Poker Face",
      "artist": "Lady Gaga",
      "year": 2008,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Hips Don’t Lie",
      "artist": "Shakira ft. Wyclef Jean",
      "year": 2005,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Rolling in the Deep",
      "artist": "Adele",
      "year": 2010,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Uptown Funk",
      "artist": "Mark Ronson ft. Bruno Mars",
      "year": 2014,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Blinding Lights",
      "artist": "The Weeknd",
      "year": 2019,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Butter",
      "artist": "BTS",
      "year": 2021,
      "uri": "spotify:track:PUT_URI_HERE"
    },
    {
      "title": "Shake It Off",
      "artist": "Taylor Swift",
      "year": 2014,
      "uri": "spotify:track:PUT_URI_HERE"
    }
    // ... bis insgesamt 100 Songs
  ];

console.log(songs[1].title);
