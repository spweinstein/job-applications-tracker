const { Router } = require("express");
const authRoutes = require("./auth.js");
const jobAppRoutes = require("./jobApps.js");
const companyRoutes = require("./companies.js");
const resumeRoutes = require("./resumes.js");
const authMiddlewares = require("../middleware/authMiddlewares.js");

const router = Router();

// router.get("/", (req, res) => {
//   res.redirect("/jobApps");
// });

router.use("/auth", authRoutes);
router.use(
  "/jobApps",
  authMiddlewares.isSignedIn,
  authMiddlewares.isAbleToAccessJobApps,
  jobAppRoutes,
);
router.use("/companies", authMiddlewares.isSignedIn, companyRoutes);
router.use("/resumes", authMiddlewares.isSignedIn, resumeRoutes);
module.exports = router;
