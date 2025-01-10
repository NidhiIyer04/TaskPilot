const Sentiment = require("sentiment");

const sentiment = new Sentiment();

// Sentiment Analysis function
function analyzeSentiment(text) {
  try {
    const result = sentiment.analyze(text);
    return {
      score: result.score, // Positive > 0, Negative < 0, Neutral = 0
      comparative: result.comparative,
      tokens: result.tokens,
      positiveWords: result.positive,
      negativeWords: result.negative,
    };
  } catch (error) {
    console.error("Error in Sentiment Analysis:", error.message);
    return {
      score: 0,
      comparative: 0,
      tokens: [],
      positiveWords: [],
      negativeWords: [],
    };
  }
}

module.exports = { analyzeSentiment };
