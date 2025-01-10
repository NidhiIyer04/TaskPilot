// utils/processText.js
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL_ID,
});

async function processTextWithGemini(inputText) {
  try {
    const result = await model.generateContent(inputText);
    return result.response.text();
  } catch (error) {
    console.error("Error in Text Processing:", error.message);
    throw error;
  }
}

module.exports = processTextWithGemini;
