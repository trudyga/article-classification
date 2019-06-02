const axios = require("axios");
const validator = require("validator");
const initFacetsMigration = require("../../storage/migrations/facets-init.migration");

const TextPreprocessorCtrl = require("./article-preprocessor.controller");
const ClassifierModelCtrl = require("../../storage/controllers/classifier.controller");
const FacetModelCtrl = require("../../storage/controllers/facet.controller");
const facetConfig = require("../../storage/config/facets.json");

const host = "127.0.0.1";
const port = "6000";
const suicideIdentifierEndpoint = `http://${host}:${port}/api/identifier/suicide`;

class ArticleClassifierCtrl {
  static async classifyArticle(req, res) {
    const article = req.body;
    const { title, source, text } = article;

    if (!title || !text) {
      return res.status(400).json({ message: "Title, text must be specified" });
    }

    const preprocessedText = TextPreprocessorCtrl.preprocessText(text);

    const {
      data: {
        prediction: { suicide }
      }
    } = await axios.post(suicideIdentifierEndpoint, {
      text: preprocessedText
    });

    let suicideFacet = await FacetModelCtrl.getFacet("suicide");
    if (suicideFacet === null) {
      await initFacetsMigration(facetConfig);
      suicideFacet = await FacetModelCtrl.getFacet("suicide");
    }

    const articleInstance = await ClassifierModelCtrl.addArticleToStorage(
      title,
      source,
      text
    );
    const identifierName = "suicide-positive";
    const suicideProbability = suicide.svmProba;
    const isSuicidePositive = suicide.svm;
    const suicideClassification = await ClassifierModelCtrl.createClassificationForIdentifier(
      articleInstance.id,
      suicideFacet.id,
      identifierName,
      suicideProbability,
      isSuicidePositive
    );

    const sourceFacet = await FacetModelCtrl.getFacet("source");
    const newsIdentifierName = "source-news";
    const otherIdentifierName = "source-other";
    const isNews = validator.isURL(source);
    const sourceClassification = await ClassifierModelCtrl.createClassificationForIdentifier(
      articleInstance.id,
      sourceFacet.id,
      isNews ? newsIdentifierName : otherIdentifierName,
      1,
      true,
      "manual"
    );

    const createdEntity = await ClassifierModelCtrl.createClassifiedEntity(
      articleInstance.id,
      [suicideClassification, sourceClassification],
      []
    );

    const entity = await ClassifierModelCtrl.getEntityById(createdEntity.id);

    return res.status(201).json(entity);
  }

  static async getEntities(req, res) {
    const query = req.query;

    if (!query.createdAfter && !query.id) {
      return res.status(400).json({
        message: "createdAfter or id query parameter must be specified"
      });
    }

    // If Query .id is specified
    if (query.id) {
      const entities = await ClassifierModelCtrl.getEntityById(query.id);

      return res.status(200).json(entities);
    }

    const createdAfter = new Date(query.createdAfter);

    const entities = await ClassifierModelCtrl.getEntitiesCreateAfterData(
      createdAfter
    );

    return res.status(200).json(entities);
  }
}

module.exports = ArticleClassifierCtrl;
