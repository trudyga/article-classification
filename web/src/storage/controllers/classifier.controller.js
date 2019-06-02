const mongoose = require("mongoose");

const ArticleModel = require("../models/article.model");
const FacetModel = require("../models/facet.model");
const IdentifierModel = require("../models/identifier.model");
const ClassificationModel = require("../models/classification.model");
const EntityModel = require("../models/entity.model");

module.exports = function() {
  async function addArticleToStorage(title, source, text) {
    const article = new ArticleModel({
      title,
      source,
      text
    });

    return article.save();
  }

  async function createFacet(name, identifiers) {
    const identifierInstances = identifiers.map(
      identifier => new IdentifierModel(identifier)
    );

    const facet = new FacetModel({
      name,
      identifiers: identifierInstances
    });

    return facet.save();
  }

  async function getFacet(name) {
    const facet = await FacetModel.findOne({ name });

    return facet;
  }

  async function createClassificationForIdentifier(
    articleId,
    facetId,
    identifierName,
    precision,
    isPositive
  ) {
    const identifierClassfication = new ClassificationModel({
      facet: facetId,
      article: articleId,
      identifier: identifierName,
      precision,
      isPositive
    });

    return identifierClassfication.save();
  }

  async function createClassifiedEntity(
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

  return {
    addArticleToStorage,
    getFacet,
    createFacet,
    createClassificationForIdentifier,
    createClassifiedEntity
  };
};
