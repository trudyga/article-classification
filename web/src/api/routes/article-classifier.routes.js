const { Router } = require("express");
const multer = require("multer");
const upload = multer();

const ArticleClassifierCtrl = require("../controllers/article-classifier.controller");

const router = Router();

router.post("/", upload.none(), ArticleClassifierCtrl.classifyArticle);
router.get("/", ArticleClassifierCtrl.getEntities);

module.exports = router;
