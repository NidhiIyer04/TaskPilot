require("dotenv").config();
const OpenAI = require("openai");
const fs = require("fs");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Speech-to-Text function
async function speechToText(audioFilePath) {
  try {
    // Ensure the file exists
    if (!fs.existsSync(audioFilePath)) {
      throw new Error("Audio file not found.");
    }

    // Read the audio file
    const audioFile = fs.createReadStream(audioFilePath);

    // Call OpenAI API for transcription
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
