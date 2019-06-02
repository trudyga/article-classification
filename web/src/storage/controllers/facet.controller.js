const mongoose = require("mongoose");

const ArticleModel = require("../models/article.model");
const FacetModel = require("../models/facet.model");
const IdentifierModel = require("../models/identifier.model");
const ClassificationModel = require("../models/classification.model");
const EntityModel = require("../models/entity.model");

class FacetController {
  static async createFacet(name, identifiers) {
    const identifierInstances = identifiers.map(
      identifier => new IdentifierModel(identifier)
    );

    const facet = new FacetModel({
      name,
      identifiers: identifierInstances
    });

    return facet.save();
  }

  static async getFacet(name) {
    const facet = await FacetModel.findOne({ name });

    return facet;
  }
}

module.exports = FacetController;
