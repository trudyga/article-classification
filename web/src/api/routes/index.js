const { Router } = require("express");
const ArticleClassifierRouter = require("./article-classifier.routes");
const ArticlePreprocessorRouter = require("./article-preprocessor.routes");

const router = Router();

router.use("/article/preprocessor", ArticlePreprocessorRouter);
router.use("/article/classifier", ArticleClassifierRouter);

module.exports = router;
