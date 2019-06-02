const mongoose = require("mongoose");
const { Schema } = mongoose;
const modelNames = require("./names.config");

const Identifier = require("./identifier.model");

const FacetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  identifiers: [Identifier.schema]
});

const Facet = mongoose.model(modelNames.FACET, FacetSchema);

module.exports = Facet;
