// utils/textToAudio.js
const PlayHT = require("playht");
const fs = require("fs");

PlayHT.init({
  userId: process.env.PLAYHT_USER_ID,
  apiKey: process.env.PLAYHT_API_KEY,
});

const textToAudio = async (text, outputPath) => {
  try {
    const stream = await PlayHT.stream(text, { voiceEngine: "PlayDialog" });
    const writeStream = fs.createWriteStream(outputPath);

    stream.pipe(writeStream);

    return new Promise((resolve, reject) => {
      stream.on("end", () => resolve(outputPath));
      stream.on("error", reject);
    });
  } catch (error) {
    console.error("❌ Error in Text-to-Speech:", error.message);
    throw error;
  }
};

module.exports = textToAudio;
