const { Router } = require("express");
const controllers = require("../controllers/jobApps.js");
const paginationMiddleware = require("../middleware/paginationMiddleware.js");

const router = Router();

// Routes
router.get("/", paginationMiddleware(), controllers.renderIndex);

router.get("/new", controllers.renderNewAppForm);

router.get("/:id", controllers.renderShowAppPage);

router.get("/:id/edit", controllers.renderEditAppForm);

router.post("/", controllers.createApp);

router.delete("/:id", controllers.deleteApp);

router.put("/:id", controllers.updateApp);

module.exports = router;
