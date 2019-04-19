const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

const mapToArray = wordPairs =>
  wordPairs.map(pair => {
    const words = pair.split(/\s+/);
    return { [words[1]]: words[0] };
  });

const mapToObject = wordPairs => {
  const obj = {};

  wordPairs.forEach(pair => {
    const words = pair.split(/\s+/);

    if (!words[0] || !words[1]) {
      return;
    }

    obj[words[1]] = words[0];
  });

  return obj;
};

const lemmatizationPairs = (fileHandlerPromise => {
  const sourceLematization = path.resolve(
    "./src/preprocessing/resources/uk/lemmatization_uk.txt",
  );
  const destinationLematization = path.resolve(
    "./src/preprocessing/resources/uk/lemmatization_uk.json",
  );

  console.log("Read file", sourceLematization);

  return fsPromises
    .open(sourceLematization, "r")
    .then(
      fileHandler =>
        console.log("test") || fileHandler.readFile({ encoding: "utf-8" }),
    )
    .then(fileContents => fileContents.split(/\n/))
    .then(mapToObject)
    .then(parsedContents => JSON.stringify(parsedContents))
    .then(stringifiedContent => {
      return fsPromises.open(destinationLematization, "w").then(fileHandler => {
        console.log(
          "Write to file",
          destinationLematization,
          "stringified Conent",
          stringifiedContent.substr(0, 100),
        );
        return fileHandler.writeFile(stringifiedContent, {
          encoding: "utf-8",
          mode: "0o666",
          flag: "w",
        });
      });
    });
})();
