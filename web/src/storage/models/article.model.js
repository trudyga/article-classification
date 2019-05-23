const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;
const modelNames = require("./names.config");

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

const Article = mongoose.model(modelNames.Article, ArticleSchema);

module.exports = Article;
