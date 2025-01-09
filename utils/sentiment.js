const Sentiment = require("sentiment");

const sentiment = new Sentiment();

function analyzeSentiment(text) {
  const result = sentiment.analyze(text);
  return {
    score: result.score, // Positive > 0, Negative < 0, Neutral = 0
    comparative: result.comparative,
    tokens: result.tokens,
    positiveWords: result.positive,
    negativeWords: result.negative,
  };
}

module.exports = { analyzeSentiment };
