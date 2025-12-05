require('dotenv').config();
console.log("-----------------------------------------");
console.log("ANG TOKEN AY: ", process.env.GITHUB_TOKEN);
console.log("-----------------------------------------");
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize OpenAI client with GitHub Models configuration
const client = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: message }
      ],
      model: "gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('Error calling API:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
