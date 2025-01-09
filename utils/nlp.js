require("dotenv").config();

const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getNLPResponse(query) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: query }],
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error in NLP:", error.message);
    return null;
  }
}

module.exports = getNLPResponse;
