const { Router } = require("express");
const controllers = require("../controllers/activities.js");

const router = Router();

// Routes
router.get("/", controllers.renderIndex);

router.get("/new", controllers.renderNewActivityForm);

router.get("/:id", controllers.renderShowActivityPage);

router.get("/:id/edit", controllers.renderEditActivityForm);

router.post("/", controllers.createActivity);

router.delete("/:id", controllers.deleteActivity);

router.put("/:id", controllers.updateActivity);

module.exports = router;
