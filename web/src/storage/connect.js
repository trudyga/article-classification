const mongoose = require("mongoose");

function connect(done) {
  const password = "qwerty123";
  mongoose.connect(
    `mongodb+srv://studentSystem:${password}@diploma-rhsqo.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  );
  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", done);
}

module.exports = connect;
