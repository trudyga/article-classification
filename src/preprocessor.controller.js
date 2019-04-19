const express = require("express");
const TextPreprocessor = require("./preprocessing/preprocessor");

const router = express.Router();

router.post("/", (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ message: "text is not specified" });
  }

  let article = req.body.text;

  article = TextPreprocessor.removeNoisePatters(
    TextPreprocessor.removeEmoji(article),
  );
  const articleSentences = TextPreprocessor.splitBySentences(article);
  const articleWords = articleSentences
    .map(sentence => TextPreprocessor.splitByWords(sentence))
    .reduce(
      (totalWords, sentenceWords) => totalWords.concat(sentenceWords),
      [],
    );

  console.log("articleWords", articleWords);
  const lematizedWords = TextPreprocessor.handleTextLemmatization(articleWords);
  console.log("lematizedWords", lematizedWords);
  // const normalizedWords = TextPreprocessor.handleTextNormalization(
  //   lematizedWords,
  // );
  // console.log("normalizedWords", normalizedWords);
  const meaningfullWords = TextPreprocessor.removeBreakWords(lematizedWords);
  console.log("meaningfull words", meaningfullWords);

  res.send(meaningfullWords.join(" "));
});

module.exports = router;
