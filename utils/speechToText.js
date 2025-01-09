require("dotenv").config();

const OpenAI = require("openai");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function speechToText(audioFilePath) {
  try {
    const audioFile = fs.createReadStream(audioFilePath);
    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });
    return response.text;
  } catch (error) {
    console.error("Error in Speech-to-Text:", error.message);
    return null;
  }
}

module.exports = { speechToText };
