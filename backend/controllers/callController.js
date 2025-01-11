// controllers/callController.js
const audioToText = require("../utils/audioToText");
const processTextWithGemini = require("../utils/processText");
const textToAudio = require("../utils/textToAudio");

const handleCall = async (req, res) => {
  const { clientId, audioFilePath } = req.body;

  try {
    // Step 1: Convert Audio to Text
    const transcript = await audioToText(audioFilePath);
    console.log("Transcript:", transcript);

    // Step 2: Process the Text with Gemini Fine-Tuned Model
    const responseText = await processTextWithGemini(transcript);

    // Step 3: Convert the Model Response to Audio
    const outputAudioPath = `output/${clientId}_${Date.now()}.mp3`;
    await textToAudio(responseText, outputAudioPath);

    // Send the response back to the client
    res.json({
      message: "Call handled successfully",
      transcript,
      responseText,
      outputAudioPath,
    });
  } catch (error) {
    console.error("Error handling call:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { handleCall };
