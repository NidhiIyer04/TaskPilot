const Interaction = require("../models/Schema");
const { getNLPResponse } = require("../utils/nlp");
const { analyzeSentiment } = require("../utils/sentiment");
const { speechToText } = require("../utils/speechToText");
const { textToSpeech } = require("../utils/textToSpeech");
const fs = require("fs");
const path = require("path");



// Controller function to handle the call
const handleCall = async (req, res) => {
  const { clientId, audioFilePath } = req.body;

  try {
    // Step 1: Convert Audio to Text (Speech-to-Text)
    const transcript = await speechToText(audioFilePath);
    if (!transcript) {
      return res.status(400).json({
        message: "Speech-to-text conversion failed. Please check the audio file.",
      });
    }
    console.log("Transcript:", transcript);

    // Step 2: Analyze Sentiment
    const sentimentResult = analyzeSentiment(transcript);

    // Step 3: Process Transcript (NLP Query Handling)
    const nlpResponse = await getNLPResponse(transcript);

    // Step 4: Convert NLP Response to Audio (Text-to-Speech)
    const outputDir = path.join(__dirname, "../output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const outputAudioPath = path.join(outputDir, `${clientId}_${Date.now()}.mp3`);
    await textToSpeech(nlpResponse, outputAudioPath);

    // Step 5: Save Interaction to Database
    const interaction = new Interaction({
      clientId,
      callTranscript: transcript,
      sentimentScore: sentimentResult.score,
      escalated: !nlpResponse,
    });
    await interaction.save();

    // Respond with the output paths and analysis
    res.json({
      message: "Call handled successfully",
      transcript,
      nlpResponse,
      sentimentScore: sentimentResult.score,
      sentimentAnalysis: sentimentResult,
      outputAudioPath,
    });
  } catch (error) {
    console.error("Error handling call:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { handleCall };
