// Load environment variables from .env file
require("dotenv").config();

// Import necessary libraries
const fs = require("fs");
const Groq = require("groq-sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const PlayHT = require("playht");

// ✅ Initialize Groq client for Speech-to-Text
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Initialize Google Generative AI client for text processing
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL_ID, // Use your fine-tuned model ID from .env
});

// ✅ Initialize PlayHT client for Text-to-Speech
PlayHT.init({
  userId: process.env.PLAYHT_USER_ID,
  apiKey: process.env.PLAYHT_API_KEY,
});

// 🛠 Function to convert audio to text using Groq API
async function audioToText(audioFilePath) {
  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: "whisper-large-v3-turbo",
      response_format: "json",
      language: "en",
    });
    console.log("Transcribed Text:", transcription.text);
    return transcription.text;
  } catch (error) {
    console.error("Error in Speech-to-Text:", error.message);
    throw error;
  }
}

// 🛠 Function to process text using Google Generative AI
async function processTextWithGemini(inputText) {
  try {
    const result = await model.generateContent(inputText);
    console.log("Model Response:", result.response.text());
    return result.response.text();
  } catch (error) {
    console.error("Error in Text Processing:", error.message);
    throw error;
  }
}

// 🛠 Function to convert text to audio using PlayHT API
async function textToAudio(text, outputFilePath) {
  try {
    const stream = await PlayHT.stream(text, { voiceEngine: "PlayDialog" });
    stream.on("data", (chunk) => {
      fs.appendFileSync(outputFilePath, chunk);
    });
    console.log(`Audio saved to ${outputFilePath}`);
    return outputFilePath;
  } catch (error) {
    console.error("Error in Text-to-Speech:", error.message);
    throw error;
  }
}

// 🏁 Main function to handle the entire workflow
async function handleAudioFile(audioFilePath, outputAudioPath) {
  try {
    // Step 1: Convert audio to text
    const transcribedText = await audioToText(audioFilePath);

    // Step 2: Process the text with Gemini fine-tuned model
    const modelResponse = await processTextWithGemini(transcribedText);

    // Step 3: Convert the model response to audio
    await textToAudio(modelResponse, outputAudioPath);

    console.log("Process completed successfully!");
  } catch (error) {
    console.error("Error in handling the audio file:", error);
  }
}

// Example usage
handleAudioFile("sample_query.mp3", "output_audio.mp3");

module.exports = { audioToText, processTextWithGemini, textToAudio, handleAudioFile };
