const { Router } = require("express");
const controllers = require("../controllers/resumes.js");
const router = Router();

// GET /resumes/
router.get("/", controllers.renderIndex);
router.get("/new", controllers.renderNewResumeForm);
router.post("/", controllers.createResume);
router.get("/:id/edit", controllers.renderEditResumeForm);
router.put("/:id", controllers.updateResume);
router.get("/:id", controllers.showResume);
router.delete("/:id", controllers.deleteResume);

module.exports = router;
