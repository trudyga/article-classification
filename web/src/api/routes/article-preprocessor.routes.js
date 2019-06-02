const { Router } = require("express");
const ArticlePreprocessorCtrl = require("../controllers/article-preprocessor.controller");

const router = Router();

router.post("/", ArticlePreprocessorCtrl.handlePreprocessTextRequest);

module.exports = router;
