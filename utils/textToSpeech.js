require("dotenv").config();

const OpenAI = require("openai");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function textToSpeech(text, outputFilePath) {
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      input: text,
      voice: "alloy",
      response_format: "mp3",
    });

    // Save the generated audio file
    fs.writeFileSync(outputFilePath, response.data);
    console.log(`Audio saved to ${outputFilePath}`);
  } catch (error) {
    console.error("Error in Text-to-Speech:", error.message);
  }
}

module.exports = { textToSpeech };
