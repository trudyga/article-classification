const express = require("express");
const bodyParser = require("body-parser");

const apiRoutes = require("./api/routes/index");
const connectDB = require("./storage/connect");

const app = express();
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));

const port = 5000;

app.use("/api", apiRoutes);

connectDB(() => {
  app.listen(port, () => console.log(`App listening on port ${port}.`));
});
