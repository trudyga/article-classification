const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;
const modelNames = require("./names.config");

const IdentifierSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  }
});

const Identifier = mongoose.Model(modelNames.IDENTIFIER, IdentifierSchema);

module.exports = Identifier;
