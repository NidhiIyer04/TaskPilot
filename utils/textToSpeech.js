require("dotenv").config();
const OpenAI = require("openai");
const fs = require("fs");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Text-to-Speech function
async function textToSpeech(text, outputFilePath) {
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    // Convert response to a buffer and write to file
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outputFilePath, buffer);

    console.log(`Audio saved to ${outputFilePath}`);
  } catch (error) {
    console.error("Error in Text-to-Speech:", error.message);
  }
}

module.exports = { textToSpeech };
