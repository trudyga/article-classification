const express = require("express");
const bodyParser = require("body-parser");

const PreprocessorCtrl = require("./preprocessor/preprocessor.controller");

const app = express();
app.use(bodyParser.urlencoded({ limit: "1mb", extended: false }));
app.use(bodyParser.json({ limit: "1mb" }));

const port = 5000;

app.use("/article", PreprocessorCtrl);

app.listen(port, () => console.log(`App listening on port ${port}.`));
