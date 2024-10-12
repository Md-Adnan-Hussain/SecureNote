const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const apisController = require("../controllers/apisController.js");

router.post("/", wrapAsync(apisController.createNote));

router.post("/notify", wrapAsync(apisController.notifyNote));

router
  .route("/:id")
  .get(wrapAsync(apisController.getNote))
  .delete(wrapAsync(apisController.deleteNote));

module.exports = router;
