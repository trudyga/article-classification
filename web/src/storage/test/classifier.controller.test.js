const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

const connect = require("../connect");

const facetsInitMigration = require("../migrations/facets-init.migration");
const FacetModel = require("../models/facet.model");
const EntityModel = require("../models/entity.model");
const ArticleModel = require("../models/article.model");
const ClassificationModel = require("../models/classification.model");

const ClassifierCtrl = require("../controllers/classifier.controller");
const facetsConfig = require("../config/facets");

describe("Classifier Model Ctrl test", () => {
  before(done => {
    connect(async () => {
      await facetsInitMigration(facetsConfig);

      done();
    });
  });

  describe("#addArticleToStorage", () => {
    const article = {
      title: "Title",
      text: "Some text conent",
      source: "https://someurl.com"
    };
    afterEach(async () => {
      await ArticleModel.deleteMany();
    });

    it("Should add article to DB", async () => {
      const articleInstance = await ClassifierCtrl.addArticleToStorage(
        article.title,
        article.source,
        article.text
      );

      const articles = await ArticleModel.find().lean();

      expect(articles).to.have.lengthOf(1);
    });

    it("Should return create article with correct data", async () => {
      const { title, source, text } = article;
      const articleInstance = await ClassifierCtrl.addArticleToStorage(
        title,
        source,
        text
      );

      for (const key in article) {
        expect(articleInstance[key]).to.be.equal(article[key]);
      }
    });
  });

  describe("#createClassificationForIdentifier", () => {
    const article = {
      title: "Title",
      text: "Some text conent",
      source: "https://someurl.com"
    };

    before(async () => {
      this.article = await ClassifierCtrl.addArticleToStorage(
        article.title,
        article.source,
        article.text
      );
    });

    after(async () => {
      await ArticleModel.deleteMany();
    });

    afterEach(async () => {
      await ClassificationModel.deleteMany();
    });

    it("Should add classification identifier for article and facet to DB", async () => {
      const facet = await FacetModel.findOne({ name: facetsConfig[0].name });

      const identifier = "emotion";
      const precision = 0.442;

      await ClassifierCtrl.createClassificationForIdentifier(
        this.article.id,
        facet.id,
        identifier,
        precision,
        false
      );

      const classifications = await ClassificationModel.find().lean();

      expect(classifications).to.have.lengthOf(1);
    });

    it("Should return created classifier controller with correct data", async () => {
      const facet = await FacetModel.findOne({ name: facetsConfig[0].name });
      const identifier = "emotion";
      const precision = 0.442;

      const classification = await ClassifierCtrl.createClassificationForIdentifier(
        this.article.id,
        facet.id,
        identifier,
        precision,
        false
      );

      expect(classification.article.toString()).to.be.equal(
        this.article.id.toString()
      );
      expect(classification.facet.toString()).to.be.equal(facet.id.toString());
      expect(classification.identifier).to.be.equal(identifier);
      expect(classification.precision).to.be.equal(precision);
      expect(classification.isPositive).to.be.equal(false);
    });

    it("Should resolve binded data", async () => {
      const facet = await FacetModel.findOne({ name: facetsConfig[0].name });
      const identifier = "emotion";
      const precision = 0.442;

      await ClassifierCtrl.createClassificationForIdentifier(
        this.article.id,
        facet.id,
        identifier,
        precision,
        false
      );

      const classification = await ClassificationModel.findOne()
        .populate("article")
        .populate("facet");

      expect(classification.article.title).to.be.equal(this.article.title);
      expect(classification.facet.name).to.be.equal(facet.name);
    });

    it("Should not create 2 classifications for same (identifier, facet, article, method)", async () => {
      const facet = await FacetModel.findOne({ name: facetsConfig[0].name });
      const identifier = "emotion";
      const precision = 0.442;

      await ClassifierCtrl.createClassificationForIdentifier(
        this.article.id,
        facet.id,
        identifier,
        precision,
        false
      );

      return expect(
        ClassifierCtrl.createClassificationForIdentifier(
          this.article.id,
          facet.id,
          identifier,
          precision,
          false
        )
      ).to.be.rejectedWith(Error);
    });
  });

  describe("#createClassifiedEntity", () => {
    const article = {
      title: "Title",
      text: "Some text conent",
      source: "https://someurl.com"
    };

    before(async () => {
      this.article = await ClassifierCtrl.addArticleToStorage(
        article.title,
        article.source,
        article.text
      );
    });

    after(async () => {
      await ArticleModel.deleteMany();
    });

    afterEach(async () => {
      await ClassificationModel.deleteMany();
      await EntityModel.deleteMany();
    });

    it("Should add classified entity to database", async () => {
      const facet = await FacetModel.findOne({ name: facetsConfig[0].name });

      const identifiers = facet.identifiers.map(identifier => identifier.name);
      const precision = 0.442;

      const classifications = await Promise.all(
        identifiers.map(identifier =>
          ClassifierCtrl.createClassificationForIdentifier(
            this.article.id,
            facet.id,
            identifier,
            precision,
            false
          )
        )
      );

      await ClassifierCtrl.createClassifiedEntity(
        this.article.id,
        classifications,
        []
      );

      const entities = await EntityModel.find().lean();

      expect(entities).to.have.lengthOf(1);
    });

    it("Should bind classification ids to actual documents", async () => {
      const facet = await FacetModel.findOne({ name: facetsConfig[0].name });

      const identifiers = facet.identifiers.map(identifier => identifier.name);
      const precision = 0.442;

      const classifications = await Promise.all(
        identifiers.map(identifier =>
          ClassifierCtrl.createClassificationForIdentifier(
            this.article.id,
            facet.id,
            identifier,
            precision,
            false
          )
        )
      );

      await ClassifierCtrl.createClassifiedEntity(
        this.article.id,
        classifications,
        []
      );

      const entity = await EntityModel.findOne().populate(
        "autoClassifications"
      );

      expect(entity.autoClassifications).to.have.lengthOf(2);
      expect(
        entity.autoClassifications.map(c => c.precision)
      ).to.have.same.members([0.442, 0.442]);
    });
  });
});
