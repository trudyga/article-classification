const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;
const modelNames = require("./names.config");

const ClassificationSchema = new Schema({
  facet: {
    type: ObjectId,
    ref: modelNames.FACET,
    required: true
  },
  identifier: {
    type: ObjectId,
    ref: modelNames.IDENTIFIER,
    required: true
  },
  precision: {
    type: Number,
    required: true
  }
});

const Classification = mongoose.model(
  modelNames.CLASSFICATION,
  ClassificationSchema
);

module.exports = Classification;
