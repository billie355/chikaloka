require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
const path = require("path"); // IMPORTANTE: Para sa tamang file paths

const app = express();
app.use(express.json());
app.use(cors());

// 1. Dito natin sinasabi kung nasaan ang HTML files (Robust way)
app.use(express.static(path.join(__dirname, "public")));

// 2. Setup Token & OpenAI
const token = process.env.GITHUB_TOKEN;
const client = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: token,
});

// 3. API Route
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful, friendly AI assistant." },
        { role: "user", content: userMessage },
      ],
      model: "gpt-4o",
    });

    res.json({ reply: response.choices[0].message.content });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch response." });
  }
});

// 4. Fallback: Kapag walang ibang route na tumama, ibigay ang index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 5. IMPORTANTE: Gamitin ang PORT ni Render (process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});