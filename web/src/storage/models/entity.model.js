const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;
const modelNames = require("./names.config");

const Classification = require("./classification.model");

const EntitySchema = new Schema({
  article: {
    type: ObjectId,
    ref: modelNames.ARTICLE
  },
  autoClassifications: [Classification.schema],
  manualClassifications: [Classification.schema]
});

const Entity = mongoose.model(modelNames.ENTITY, EntitySchema);

module.exports = Entity;
