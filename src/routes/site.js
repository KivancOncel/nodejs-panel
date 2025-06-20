const path = require("path");

const express = require("express");

const siteController = require("../controller/site");

const router = express.Router();

router.get("/", siteController.getIndex);
router.get("/:slug", siteController.getContentBySlug);
router.get("/haberler/:slug", siteController.getBlogBySlug);

module.exports = router;
