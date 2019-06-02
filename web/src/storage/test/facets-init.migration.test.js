const chai = require("chai");
const expect = chai.expect;

const connect = require("../connect");

const FacetModel = require("../models/facet.model");
const facetsInitMigration = require("../migrations/facets-init.migration");
const facetsConfig = require("../config/facets");

describe("Facets Initialize Migration Test", () => {
  before(done => connect(done));

  describe("Facet Creation test", () => {
    beforeEach(async () => {
      await FacetModel.deleteMany();
    });

    after(async () => {
      await FacetModel.deleteMany();
    });

    it("Should create same amount of Facets", async () => {
      await facetsInitMigration(facetsConfig);

      const facetsAmount = facetsConfig.length;

      const facets = await FacetModel.find().lean();

      expect(facets).to.have.lengthOf(facetsAmount);
    });

    it("Should create facets with same names", async () => {
      await facetsInitMigration(facetsConfig);

      const facetsNames = facetsConfig.map(f => f.name);

      const facets = await FacetModel.find().lean();

      expect(facets.map(f => f.name)).to.have.same.members(facetsNames);
    });
  });

  describe("Facet Identifier creation test", () => {
    beforeEach(async () => {
      await FacetModel.deleteMany();
    });

    after(async () => {
      await FacetModel.deleteMany();
    });

    it("Should create all identifiers for facet", async () => {
      await facetsInitMigration(facetsConfig);

      const facets = await FacetModel.find().lean();

      facets.forEach(facet => {
        const facetConfig = facetsConfig.find(f => f.name === facet.name);
        expect(facet.identifiers).to.have.lengthOf(
          facetConfig.identifiers.length
        );
      });
    });

    it("Should create all identifiers with correct keys for facet", async () => {
      await facetsInitMigration(facetsConfig);

      const facets = await FacetModel.find().lean();

      facets.forEach(facet => {
        const facetConfig = facetsConfig.find(f => f.name === facet.name);

        expect(facet.identifiers.map(i => i.key)).to.have.same.members(
          facetConfig.identifiers.map(i => i.key)
        );

        expect(facet.identifiers.map(i => i.name)).to.have.same.members(
          facetConfig.identifiers.map(i => i.name)
        );
      });
    });
  });
});
