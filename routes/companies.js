const { Router } = require("express");
const controllers = require("../controllers/companies.js");
const paginationMiddleware = require("../middleware/paginationMiddleware.js");

const router = Router();

router.get("/", paginationMiddleware(), controllers.renderIndex);
router.get("/new", controllers.renderNewCompanyForm);
router.post("/", controllers.createCompany);
router.get("/:id/edit", controllers.renderEditCompanyForm);
router.get("/:id", controllers.renderShowCompanyPage);
router.delete("/:id", controllers.deleteCompany);
router.put("/:id", controllers.updateCompany);

module.exports = router;
