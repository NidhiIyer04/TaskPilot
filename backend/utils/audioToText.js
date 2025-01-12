require("dotenv").config();
const fs = require("fs");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function audioToText(audioFilePath) {
  try {
    console.log(audioFilePath, "POM POM")
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: "whisper-large-v3-turbo",
      response_format: "json",
      language: "en",
    });
    return transcription.text;
  } catch (error) {
    console.error("Error in Speech-to-Text:", error.message);
    throw error;
  }
}

module.exports = audioToText;
