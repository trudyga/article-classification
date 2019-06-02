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
    type: String,
    required: true
  },
  precision: {
    type: Number,
    required: true
  },
  isPositive: {
    type: Boolean,
    required: true
  }
});

const Classification = mongoose.model(
  modelNames.CLASSFICATION,
  ClassificationSchema
);

module.exports = Classification;
