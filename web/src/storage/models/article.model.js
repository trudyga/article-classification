const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;
const modelNames = require("./names.config");

const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    source: {
      type: String
    },
    text: {
      type: String,
      required: true
    }
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Article = mongoose.model(modelNames.ARTICLE, ArticleSchema);

module.exports = Article;
