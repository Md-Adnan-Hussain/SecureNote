const express = require("express");
const router = express.Router();

const apisController = require("../controllers/apisController.js");

router.post("/", apisController.createNote);

router.post("/notify", apisController.notifyNote);

router
  .route("/:id")
  .get(apisController.getNote)
  .delete(apisController.deleteNote);

module.exports = router;
