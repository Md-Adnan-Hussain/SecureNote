const express = require("express");
const router = express.Router();

const pagesController = require("../controllers/pagesController.js");

router.get("/", pagesController.createNote);

router.get("/link", pagesController.linkNote);

router.get("/warning", pagesController.warning);

router.get("/id/:id", pagesController.getNote);

module.exports = router;
