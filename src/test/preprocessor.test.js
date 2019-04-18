const chai = require("chai");
const expect = chai.expect;
const preprocessor = require("../preprocessing/preprocessor");

describe("#removeNoisePatters", () => {
  it("Should remove usernames from the text", () => {
    const text = `Цей текс має ім'я. @trudyga`;

    const sanitizedText = preprocessor.removeNoisePatters(text);

    expect(sanitizedText).to.be.equal(`Цей текс має ім'я. `);
  });

  it("Should remove english hashtags from the text", () => {
    const text = `Цей текс має хештег. #health`;

    const sanitizedText = preprocessor.removeNoisePatters(text);

    expect(sanitizedText).to.be.equal(`Цей текс має хештег.`);
  });

  it("Should remove ukrainian hashtags from the text", () => {
    const text = `Цей текс має хештег. #їм'я`;

    const sanitizedText = preprocessor.removeNoisePatters(text);

    expect(sanitizedText).to.be.equal(`Цей текс має хештег.`);
  });

  it("Should remove urls from the text", () => {
    const text = `Цей текс має. https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5777614/`;

    const sanitizedText = preprocessor.removeNoisePatters(text);

    expect(sanitizedText).to.be.equal(`Цей текс має. `);
  });
});

describe("#splitBySentences", () => {
  it("Should split by dot symbol", () => {
    const text = `Перше завдання - намалювати кита на руці ручкою. Наступне - намалювати кита на руці лезом.`;

    const parts = preprocessor.splitBySentences(text);
    expect(parts).to.have.members([
      "Перше завдання - намалювати кита на руці ручкою",
      "Наступне - намалювати кита на руці лезом",
    ]);
    expect(parts).to.have.lengthOf(2);
  });

  it("Should preserve sentences order", () => {
    const text = `Перше завдання - намалювати кита на руці ручкою. Наступне - намалювати кита на руці лезом.`;

    const parts = preprocessor.splitBySentences(text);
    expect(parts).to.have.ordered.members([
      "Перше завдання - намалювати кита на руці ручкою",
      "Наступне - намалювати кита на руці лезом",
    ]);
    expect(parts).to.have.lengthOf(2);
  });

  it("Should split by 3 dot symbol", () => {
    const text = `Сьогдні - тут... Завтра там`;

    const parts = preprocessor.splitBySentences(text);
    expect(parts).to.have.members(["Сьогдні - тут", "Завтра там"]);
  });

  it("Should split by interrobang", () => {
    const text = `Today - 34,231 ?! Tomorrow - 45,31`;
    const parts = preprocessor.splitBySentences(text);
    expect(parts).to.have.members(["Today - 34,231", "Tomorrow - 45,31"]);
  });
});

describe("#splitByWords", () => {
  it("Should split ukrainian by words", () => {
    const sentence =
      "На аватарці адміністратора нової небезпечної гри стоїть фото скульптури, створеної японським художником Мідорі Хаясі";

    const words = [
      "На",
      "аватарці",
      "адміністратора",
      "нової",
      "небезпечної",
      "гри",
      "стоїть",
      "фото",
      "скульптури",
      "створеної",
      "японським",
      "художником",
      "Мідорі",
      "Хаясі",
    ];

    const splited = preprocessor.splitByWords(sentence);

    expect(splited).to.have.ordered.members(words);
    expect(splited).to.have.lengthOf(words.length);
  });

  it("Should not split dash-separated words", () => {
    const sentence = "На зеленувато-червоному ганку сидить";

    const words = ["На", "зеленувато-червоному", "ганку", "сидить"];

    const splited = preprocessor.splitByWords(sentence);

    expect(splited).to.have.ordered.members(words);
    expect(splited).to.have.lengthOf(words.length);
  });

  it("Should split english by words", () => {
    const sentence = "Here on Earth we think about rockets(";

    const words = ["Here", "on", "Earth", "we", "think", "about", "rockets("];

    const splited = preprocessor.splitByWords(sentence);

    expect(splited).to.have.ordered.members(words);
    expect(splited).to.have.lengthOf(words.length);
  });
});

describe("#removeEmoji", () => {
  it("Should remove emoji UTF-16 UTF-32 characters from text", () => {
    const sentence = "Some emoji🙈😉😍";

    const sanitized = preprocessor.removeEmoji(sentence);

    expect(sanitized).to.be.equal("Some emoji");
  });
});

describe("#handleTextLemmatization", () => {
  it("Should throw error if not array is passed", () => {
    const sentence = "Incorrect sentence";

    expect(() => preprocessor.handleTextLemmatization(sentence)).to.throw(
      Error,
      "Only array of words supported",
    );
  });

  it("Should replace words with correspondent from lematization vocabulary in lower case", () => {
    const words = ["яблунь", "Юркевичеві", "виконанню"];

    const lemmatizedWords = ["яблуня", "Юркевич", "виконання"];

    const actualLematizedWords = preprocessor.handleTextLemmatization(words);

    expect(actualLematizedWords).to.have.ordered.members(lemmatizedWords);
  });

  it("Should not modify word if there is not correspondent value in lematization vocabulary", () => {
    const words = ["thisDoesNotExist", "anotherEmptyWord"];

    expect(preprocessor.handleTextLemmatization(words)).to.have.ordered.members(
      words,
    );
  });
});

describe("#removeBreakWords", () => {
  it("Should throw error if not array is passed", () => {
    const sentence = "Incorrect sentence";

    expect(() => preprocessor.handleTextLemmatization(sentence)).to.throw(
      Error,
      "Only array of words supported",
    );
  });

  it("Should remove all breakwords from array", () => {
    const words = ["вся", "яблуня", "на", "Юркевичеві"];

    const expectedArray = ["яблуня", "Юркевичеві"];

    const actualLematizedWords = preprocessor.removeBreakWords(words);

    expect(actualLematizedWords).to.have.ordered.members(expectedArray);
  });

  it("Should not modify array if not beakwords are present", () => {
    const words = ["thisDoesNotExist", "anotherEmptyWord"];

    expect(preprocessor.handleTextLemmatization(words)).to.have.ordered.members(
      words,
    );
  });
});
