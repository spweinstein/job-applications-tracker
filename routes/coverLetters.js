const { Router } = require("express");
const controllers = require("../controllers/coverLetters.js");

const router = Router();

router.get("/", controllers.renderIndex);
router.get("/new", controllers.renderNewCoverLetterForm);
router.post("/", controllers.createCoverLetter);
router.get("/:id/edit", controllers.renderEditCoverLetterForm);
router.get("/:id", controllers.renderShowCoverLetterPage);
router.delete("/:id", controllers.deleteCoverLetter);
router.put("/:id", controllers.updateCoverLetter);

module.exports = router;
