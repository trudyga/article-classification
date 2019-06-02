const mongoose = require("mongoose");

const modelNames = require("../models/names.config");
const ArticleModel = require("../models/article.model");
const FacetModel = require("../models/facet.model");
const IdentifierModel = require("../models/identifier.model");
const ClassificationModel = require("../models/classification.model");
const EntityModel = require("../models/entity.model");

class ClassifierCtrl {
  static async addArticleToStorage(title, source, text) {
    const article = new ArticleModel({
      title,
      source,
      text
    });

    return article.save();
  }

  static async createClassificationForIdentifier(
    articleId,
    facetId,
    identifierName,
    precision,
    isPositive,
    method = "svm"
  ) {
    const identifierClassfication = new ClassificationModel({
      facet: facetId,
      article: articleId,
      identifier: identifierName,
      precision,
      isPositive,
      method
    });

    return identifierClassfication.save();
  }

  static async createClassifiedEntity(
    articleId,
    identifierClassificationIds,
    manualClassificationIds = []
  ) {
    const entity = new EntityModel({
      article: articleId,
      autoClassifications: identifierClassificationIds,
      manualClassifications: manualClassificationIds
    });

    return entity.save();
  }

  static async getEntitiesCreateAfterData(createdAfter) {
    const entities = EntityModel.find({
      updatedAt: {
        $gte: createdAfter
      }
    })
      .populate("article")
      .populate({
        path: "autoClassifications",
        populate: [
          {
            path: "facet",
            model: modelNames.FACET
          }
        ]
      })
      .populate({
        path: "manualClassifications",
        populate: [
          {
            path: "facet",
            model: modelNames.FACET
          }
        ]
      })
      .sort("updatedAt");

    return entities;
  }

  static async getEntityById(id) {
    const entity = EntityModel.findById(id)
      .populate("article")
      .populate({
        path: "autoClassifications",
        populate: [
          {
            path: "facet",
            model: modelNames.FACET
          }
        ]
      })
      .populate({
        path: "manualClassifications",
        populate: [
          {
            path: "facet",
            model: modelNames.FACET
          }
        ]
      })
      .sort("updatedAt");

    return entity;
  }
}

module.exports = ClassifierCtrl;
