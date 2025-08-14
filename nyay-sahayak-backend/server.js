// server.js

// 1. Import necessary packages
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from .env file
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 2. Initialize Express app and Google AI
const app = express();
const port = 5001; // We'll run our backend on this port

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

// 3. Configure Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable the server to parse JSON in request bodies

// --- This is our simple test route for debugging ---
app.get('/test', (req, res) => {
  console.log("SUCCESS: /test route was reached!");
  res.send("Hello from the backend!");
});

// 4. Define the Upgraded API Endpoint
app.post('/api/gemini', async (req, res) => {
  // This log will appear in your backend terminal every time a request is made.
  console.log(`--- REQUEST RECEIVED at /api/gemini: ${new Date().toLocaleTimeString()} ---`);

  try {
    // Get the user's question from the request body and rename it for clarity
    const { prompt: userQuery } = req.body;

    if (!userQuery) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // --- REFINED PROMPT ---
    // This detailed prompt instructs the AI to return a structured JSON object.
    const structuredPrompt = `
      **System Prompt:** You are 'Nyay Sahayak', an expert AI legal information assistant for India. Your goal is to break down complex legal topics into simple, actionable information. You MUST respond in a specific JSON format.

      **User's Question:** "${userQuery}"

      **Your Task:**
      1.  Analyze the user's question.
      2.  Based on your knowledge of Indian law, generate a response by populating the following JSON schema.
      3.  **DO NOT provide legal advice.** Only provide factual, informational content.
      4.  The 'key_points' should be an array of strings.
      5.  The 'practical_next_steps' should be an array of strings.

      **JSON Schema to use:**
      {
        "simplified_explanation": "A single, very simple sentence that summarizes the answer.",
        "key_points": [
          "A key takeaway or important fact.",
          "Another key takeaway or important fact."
        ],
        "source": "The primary legal source, like 'Article 19 of the Constitution' or 'Section 420 of the IPC'.",
        "practical_next_steps": [
          "A practical, general action a person could consider.",
          "Another practical action a person could consider."
        ]
      }
    `;
    // --- END OF REFINED PROMPT ---

    // Generate content using the new, more detailed prompt
    const result = await model.generateContent(structuredPrompt);
    const response = await result.response;
    const text = response.text();

    // Send the structured response back to the frontend
    res.json({ response: text });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: 'Failed to generate response from AI' });
  }
});

// 5. Start the Server
app.listen(port, () => {
  console.log(`Nyay Sahayak backend server is running on http://localhost:${port}`);
});
