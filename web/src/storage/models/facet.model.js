const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;
const modelNames = require("./names.config");

const Identifier = require("./identifier.model");

const FacetSchema = new Schema({
  name: String,
  identifiers: [Identifier]
});

const Facet = mongoose.Model(modelNames.FACET, FacetSchema);

module.exports = Facet;
