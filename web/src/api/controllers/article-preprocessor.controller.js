const TextPreprocessor = require("../../preprocessor/preprocessing/preprocessor");

function handlePreprocessTextRequest(req, res) {
  if (!req.body.text) {
    return res.status(400).json({ message: "text is not specified" });
  }

  const preprocessedText = preprocessText(req.body.text);

  return res.send(preprocessedText);
}

function preprocessText(text) {
  let article = TextPreprocessor.removeNoisePatters(
    TextPreprocessor.removeEmoji(text)
  );
  const articleSentences = TextPreprocessor.splitBySentences(article);
  const articleWords = articleSentences
    .map(sentence => TextPreprocessor.splitByWords(sentence))
    .reduce(
      (totalWords, sentenceWords) => totalWords.concat(sentenceWords),
      []
    );

  // console.log("articleWords", articleWords);
  const lematizedWords = TextPreprocessor.handleTextLemmatization(articleWords);
  // console.log("lematizedWords", lematizedWords);
  // const normalizedWords = TextPreprocessor.handleTextNormalization(
  //   lematizedWords,
  // );
  // console.log("normalizedWords", normalizedWords);
  const meaningfullWords = TextPreprocessor.removeBreakWords(lematizedWords);
  // console.log("meaningfull words", meaningfullWords);

  return meaningfullWords.join(" ");
}
module.exports = {
  preprocessText,
  handlePreprocessTextRequest
};
