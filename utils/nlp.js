require("dotenv").config();
const OpenAI = require("openai");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// NLP Query Handling function
async function getNLPResponse(query) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: query },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error in NLP:", error.message);
    return null;
  }
}

module.exports = { getNLPResponse };
