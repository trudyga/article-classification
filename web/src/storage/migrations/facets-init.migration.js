const facetController = require("../controllers/facet.controller");

async function createFacets(facetsConfiguration) {
  const facets = facetsConfiguration.map(facet =>
    facetController.createFacet(facet.name, facet.identifiers)
  );

  return Promise.all(facets);
}

module.exports = createFacets;
