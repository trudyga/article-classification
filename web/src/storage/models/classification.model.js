const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;
const modelNames = require("./names.config");

const ClassificationSchema = new Schema(
  {
    article: {
      type: ObjectId,
      ref: modelNames.ARTICLE,
      required: true
    },
    facet: {
      type: ObjectId,
      ref: modelNames.FACET,
      required: true
    },
    identifier: {
      type: String,
      required: true
    },
    method: {
      type: String,
      required: true,
      default: "svm",
      enum: ["manual", "svm", "naive-bayes", "bag"]
    },
    precision: {
      type: Number
    },
    isPositive: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

ClassificationSchema.index(
  { article: 1, facet: 1, identifier: 1, method: 1 },
  { unique: true }
);

const Classification = mongoose.model(
  modelNames.CLASSFICATION,
  ClassificationSchema
);

module.exports = Classification;
