const { Router } = require("express");
const authRoutes = require("./auth.js");
const jobAppRoutes = require("./jobApps.js");
const companyRoutes = require("./companies.js");
const resumeRoutes = require("./resumes.js");
const coverLetterRoutes = require("./coverLetters.js");

const authMiddlewares = require("../middleware/authMiddlewares.js");

const router = Router();

router.get("/", (req, res) => {
  res.render("index.ejs", {
    pageTitle: "Job Application Tracker",
  });
});

router.use("/auth", authRoutes);
router.use(
  "/jobApps",
  authMiddlewares.isSignedIn,
  authMiddlewares.isAbleToAccessJobApps,
  jobAppRoutes,
);
router.use("/companies", authMiddlewares.isSignedIn, companyRoutes);
router.use("/resumes", authMiddlewares.isSignedIn, resumeRoutes);
router.use("/coverLetters", authMiddlewares.isSignedIn, coverLetterRoutes);

module.exports = router;
