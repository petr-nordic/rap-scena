import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY je vyžadován. Prosím, nastavte jej v nastavení (Secrets).");
    }
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Helper to get absolute path to content
const getContentPath = (type: string, slug: string) => {
  return path.join(process.cwd(), 'content', type, `${slug}.mdx`);
};

// API: List all content (alternative to Glob if needed, but let's keep it for now)
app.get("/api/content", async (req, res) => {
  try {
    const types = ['raperi', 'alba', 'skladby', 'labely', 'zanry', 'clanky'];
    const results = [];

    for (const type of types) {
      const dirPath = path.join(process.cwd(), 'content', type);
      try {
        const files = await fs.readdir(dirPath);
        for (const file of files) {
          if (file.endsWith('.mdx')) {
            const content = await fs.readFile(path.join(dirPath, file), 'utf-8');
            results.push({ type, slug: file.replace('.mdx', ''), content });
          }
        }
      } catch (e) {
        // Directory might not exist yet
      }
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// API: Save content
app.post("/api/content", async (req, res) => {
  const { type, slug, content } = req.body;
  if (!type || !slug || !content) {
    return res.status(400).json({ error: "Missing type, slug, or content" });
  }

  try {
    const filePath = getContentPath(type, slug);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// API: Generate content using Gemini with Search Grounding
app.post("/api/generate", async (req, res) => {
  const { type, query } = req.body;

  if (!type || !query) {
    return res.status(400).json({ error: "Missing type or query" });
  }

  try {
    const systemInstruction = `Jsi expert na český rap a hip-hop. Tvým úkolem je vyhledat pravdivé informace a vygenerovat MDX soubor pro entity typu: ${type}.
Vždy používej Google Search grounding k ověření faktů (datum narození, občanské jméno, diskografie, labely atd.).
Všechny informace musí být aktuální.

Odpověz POUZE ve formátu MDX podle následující šablony pro typ ${type}:

Šablony:
- raperi: title, slug, realName, born, active, label, genre (pole), description (max 200 zn.), publishedAt (dnes), text, diskografie.
- alba: title, slug, rapper, rapperSlug, label, year (číslo), genre, description, tracklist (pole), publishedAt (dnes), recenze/popis.
- skladby: title, slug (nazev-tracku-rapper), rapper, rapperSlug, album, albumSlug, year, genre, description, publishedAt (dnes), kontext, zvuk, téma.
- labely: title, slug, founded, location, description, artists (slugy), publishedAt (dnes), historie, umělci.
- zanry: title, slug, origin, description, publishedAt (dnes), původ, charakteristika, česká scéna.
- clanky: title, slug, category, description, publishedAt (dnes), tags, text.

Důležité:
- publishedAt nastav na dnešní datum: ${new Date().toISOString().split('T')[0]}.
- Slug musí být URL safe (malá písmena, pomlčky).
- Generuj POUZE čisté MDX, žádné kecy okolo, žádné markdown code blocky (takže nezačínej \`\`\`mdx).`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Vygeneruj profil pro: ${query} (typ: ${type})`,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    const mdx = response.text;
    res.json({ mdx });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
