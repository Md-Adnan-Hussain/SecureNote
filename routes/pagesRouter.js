const express = require("express");
const router = express.Router();

const pagesController = require("../controllers/pagesController.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/", wrapAsync(pagesController.createNote));

router.get("/link", wrapAsync(pagesController.linkNote));

router.get("/warning", wrapAsync(pagesController.warning));

router.get("/id/:id", wrapAsync(pagesController.getNote));

module.exports = router;
