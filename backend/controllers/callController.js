// controllers/callController.js
require("dotenv").config();
// const twilio = require("twilio")
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");;
const path = require("path");
const audioToText = require("../utils/audioToText");
const processTextWithGemini = require("../utils/processText");
const textToAudio = require("../utils/textToAudio");

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

const handleAudioProcessing = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file received in the backend" });
    }

    // ✅ Step 1: Convert uploaded audio to MP3 using FFmpeg
    const inputPath = req.file.path;
    const outputPath = path.join("uploads", `${Date.now()}-converted.mp3`);

    // 🛠 Use FFmpeg to convert the file to MP3
    await new Promise((resolve, reject) => {
      const ffmpeg = require("fluent-ffmpeg");
      ffmpeg(inputPath)
        .toFormat("mp3")
        .on("end", resolve)
        .on("error", reject)
        .save(outputPath);
    });

    console.log("Audio file converted to MP3:", outputPath);

    // 🎧 Step 2: Convert Audio to Text (Send the MP3 file to your speech-to-text API)
    const transcript = await audioToText(outputPath);
    console.log("Transcript:", transcript);

    // 📜 Step 3: Process Text with Gemini Fine-Tuned Model
    const responseText = await processTextWithGemini(transcript);
    console.log("Gemini Response:", responseText);

    // ✅ Step 4: Convert AI response text to audio
    const finalOutputAudioPath = path.join("uploads", `${Date.now()}-response.mp3`);
    await textToAudio(responseText, finalOutputAudioPath);

    // ✅ Step 5: Send the processed audio URL to the frontend
    res.json({ audioUrl: finalOutputAudioPath });
  } catch (error) {
    console.error("❌ Error in audio processing:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

module.exports = { handleAudioProcessing };