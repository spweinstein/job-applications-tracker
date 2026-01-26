const Company = require("../models/company.js");
const Resume = require("../models/resume.js");

const passUserToView = (req, res, next) => {
  res.locals.user = req.session.user ? req.session.user : null;
  next();
};

const isSignedIn = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect("/auth/login");
};

const isAbleToAccessJobApps = async (req, res, next) => {
  // Determines whether user is signed in and has at least one Company and at least one Resume; otherwise, the user should not be allowed to access any JobApp related endpoint, as
  // they will throw errors
  const [companyCount, resumeCount] = await Promise.all([
    Company.countDocuments({ user: req.session.user._id }),
    Resume.countDocuments({ user: req.session.user._id }),
  ]);
  if (companyCount === 0 || resumeCount === 0) {
    let errorMessage =
      "Before adding a job application, you must have at least ";
    const missing = [];
    if (companyCount === 0) missing.push("one company");
    if (resumeCount === 0) missing.push("one resume");
    errorMessage += missing.join(" and ") + ".";

    return res.render("index.ejs", {
      pageTitle: "Job Applications Homepage",
      jobApps: [],
      pagination: { currentPage: 1, totalPages: 0, totalCount: 0, limit: 10 },
      sort: { sortBy: "appliedAt", sortOrder: "desc" },
      error: errorMessage,
    });
  }
  next();
};

module.exports = { passUserToView, isSignedIn, isAbleToAccessJobApps };
