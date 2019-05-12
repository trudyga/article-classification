const stopwordsUK = require("./resources/uk/stopwords_uk.json");
const lematizationUK = require("./resources/uk/lemmatization_uk.json");
const sentenceDelimeters = require("./resources/uk/sentenceDelimeters_uk.json");
const stemmer = require("ukrstemmer");

class TextPreprocessor {
  static removeNoisePatters(text) {
    const $username = /(@[A-Za-z0-9_]+)/gi;
    const $url = /((ftp|https?):\/\/[^\s]+)/gi;
    const $hashtag = /(^|\s)#(\w*[a-zA-Z_]+|[а-яА-Я'іІїЇ]+\w*)/gi;

    return text
      .replace($username, "")
      .replace($url, "")
      .replace($hashtag, "");
  }

  // possible improvement replace () or "" or «» or long dashes  with spaces
  static replaceBracketsWithSpaces(text) {}

  static removeEmoji(text) {
    return text.replace(
      /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      "",
    );
  }

  static splitBySentences(text) {
    return text
      .split(/(?!)|[?!.;]/gi)
      .map(part => part.trim())
      .filter(part => part !== "");
  }

  static splitByWords(sentence) {
    const $separators = /[,;]+|\s+/gi;
    return sentence
      .split($separators)
      .map(part => part.trim())
      .filter(part => part !== "");
  }

  static removeNumbers(text) {
    return text.replace(/\d+/gi, "");
  }

  // possible optimization: store only lower-cased words
  static handleTextLemmatization(words) {
    if (!(words instanceof Array)) {
      throw new Error("Only array of words supported");
    }

    return words.map(word => {
      const foundMatch =
        lematizationUK[word] || lematizationUK[word.toLowerCase()];

      return foundMatch || word;
    });
  }

  static removeBreakWords(words) {
    if (!(words instanceof Array)) {
      throw new Error("Only array of words supported");
    }

    return words.filter(
      word => !stopwordsUK.some(stopWord => stopWord === word),
    );
  }

  static handleTextNormalization(words) {
    if (!(words instanceof Array)) {
      throw new Error("Only array of words supported");
    }

    return words.map(w => stemmer(w));
  }
}

module.exports = TextPreprocessor;
