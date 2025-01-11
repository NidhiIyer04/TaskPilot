// utils/textToAudio.js
require("dotenv").config();
const fs = require("fs");
const PlayHT = require("playht");

PlayHT.init({
  userId: process.env.PLAYHT_USER_ID,
  apiKey: process.env.PLAYHT_API_KEY,
});

async function textToAudio(text, outputFilePath) {
  try {
    const stream = await PlayHT.stream(text, { voiceEngine: "PlayDialog" });
    stream.on("data", (chunk) => {
      fs.appendFileSync(outputFilePath, chunk);
    });
    return outputFilePath;
  } catch (error) {
    console.error("Error in Text-to-Speech:", error.message);
    throw error;
  }
}

module.exports = textToAudio;
