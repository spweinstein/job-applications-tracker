const CoverLetter = require("../models/coverLetter.js");
const JobApp = require("../models/jobApp.js");

// GET "/coverLetters/"
const renderIndex = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "updatedAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const skip = (page - 1) * limit;

  const filter = { user: req.session.user._id };

  const [coverLetters, totalCount] = await Promise.all([
    CoverLetter.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    CoverLetter.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  res.render("./coverLetters/index.ejs", {
    pageTitle: "Cover Letters",
    coverLetters,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
    sort: { sortBy, sortOrder: req.query.sortOrder || "desc" },
  });
};

// GET "/coverLetters/new"
const renderNewCoverLetterForm = (req, res) => {
  res.render("coverLetters/new.ejs", {
    pageTitle: "New Cover Letter",
  });
};

// GET "/coverLetters/:id"
const renderShowCoverLetterPage = async (req, res) => {
  const coverLetter = await CoverLetter.findOne({
    user: req.session.user._id,
    _id: req.params.id,
  });
  const previewLimit = 10;

  const [jobApps, totalJobAppsCount] = await Promise.all([
    JobApp.find({ coverLetter: req.params.id })
      .sort({ updatedAt: -1 })
      .limit(previewLimit),
    JobApp.countDocuments({ coverLetter: req.params.id }),
  ]);
  res.render("./coverLetters/show.ejs", {
    pageTitle: "Cover Letter Details",
    coverLetter,
    jobApps,
    totalJobAppsCount,
    previewLimit,
  });
};

// GET "/coverLetters/:id/edit"
const renderEditCoverLetterForm = async (req, res) => {
  const coverLetter = await CoverLetter.findOne({
    user: req.session.user._id,
    _id: req.params.id,
  });
  res.render("./coverLetters/edit.ejs", {
    pageTitle: "Edit Cover Letter",
    coverLetter,
  });
};

// POST "/coverLetters/:id"
const createCoverLetter = async (req, res) => {
  const coverLetterInDatabase = await CoverLetter.findOne({
    user: req.session.user._id,
    name: req.body.name,
  });
  if (coverLetterInDatabase) {
    // res.send(`CoverLetter ${req.body.name} already in database!`);
    res.render("coverLetters/new.ejs", {
      pageTitle: "New Cover Letter",
      error: `CoverLetter ${req.body.name} already in database!`,
    });
  } else {
    req.body.user = req.session.user._id;
    await CoverLetter.create(req.body);
    res.redirect("/coverLetters");
  }
};

// DELETE "/coverLetters/:id"
const deleteCoverLetter = async (req, res) => {
  const jobAppCount = await JobApp.countDocuments({
    coverLetter: req.params.id,
  });
  if (jobAppCount > 0) {
    const [coverLetters, totalCount] = await Promise.all([
      CoverLetter.find({ user: req.session.user._id })
        .sort({ updatedAt: -1 })
        .limit(10),
      CoverLetter.countDocuments({ user: req.session.user._id }),
    ]);

    return res.render("./coverLetters/index.ejs", {
      pageTitle: "Cover Letters",
      coverLetters,
      pagination: {
        currentPage: 1,
        totalPages: Math.ceil(totalCount / 10),
        totalCount,
        limit: 10,
      },
      sort: { sortBy: "updatedAt", sortOrder: "desc" },
      error: `Cannot delete coverLetter. It has ${jobAppCount} linked job application(s). Please delete those first.`,
    });
  }

  await CoverLetter.findOneAndDelete({
    user: req.session.user._id,
    _id: req.params.id,
  });
  res.redirect("/coverLetters");
};

// PUT "/coverLetters/:id"
const updateCoverLetter = async (req, res) => {
  // Check if another coverLetter with this name exists (excluding current coverLetter)
  const duplicateCoverLetter = await CoverLetter.findOne({
    user: req.session.user._id,
    name: req.body.name,
    _id: { $ne: req.params.id }, // Exclude the current coverLetter being updated
  });

  if (duplicateCoverLetter) {
    // Could use flash messages, or for now, send error
    return res.render("coverLetters/edit.ejs", {
      pageTitle: "Edit CoverLetter",
      error: `CoverLetter ${req.body.name} already in database!`,
      coverLetter: req.body,
    });
  } else {
    await CoverLetter.findOneAndUpdate(
      {
        user: req.session.user._id,
        _id: req.params.id,
      },
      req.body,
    );
    res.redirect("/coverLetters");
  }
};

module.exports = {
  renderIndex,
  renderNewCoverLetterForm,
  renderShowCoverLetterPage,
  renderEditCoverLetterForm,
  createCoverLetter,
  deleteCoverLetter,
  updateCoverLetter,
};
