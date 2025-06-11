const path = require("path");

const express = require("express");

const siteController = require("../controller/site");

const router = express.Router();

router.get("/", siteController.getIndex);
router.get("/:slug", siteController.getContentBySlug);

module.exports = router;
