const JobApp = require("../models/jobApp.js");
const Company = require("../models/company.js");
const Resume = require("../models/resume.js");

// GET "/jobApps/"
const renderIndex = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "appliedAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const skip = (page - 1) * limit;

  const filter = { user: req.session.user._id };

  const [jobApps, totalCount] = await Promise.all([
    JobApp.find(filter)
      .populate("company")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    JobApp.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  res.render("./jobApps/index.ejs", {
    pageTitle: "Job Applications",
    jobApps,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
    sort: { sortBy, sortOrder: req.query.sortOrder || "desc" },
  });
};

// GET "/jobApps/new"
const renderNewAppForm = async (req, res) => {
  const companies = await Company.find({
    user: req.session.user._id,
  });
  const resumes = await Resume.find({
    user: req.session.user._id,
  });
  res.render("./jobApps/new.ejs", {
    pageTitle: "New Job Application",
    companies,
    resumes,
  });
};

// GET "/jobApps/:id"
const renderShowAppPage = async (req, res) => {
  const jobApp = await JobApp.findOne({
    _id: req.params.id,
    user: req.session.user._id,
  })
    .populate("company")
    .populate("resume");
  res.render("./jobApps/show.ejs", {
    pageTitle: `View Job App`,
    jobApp,
  });
};

// GET "/jobApps/:id/edit"
const renderEditAppForm = async (req, res) => {
  const jobApp = await JobApp.findOne({
    _id: req.params.id,
    user: req.session.user._id,
  })
    .populate("company")
    .populate("resume");
  const companies = await Company.find({
    user: req.session.user._id,
  });
  const resumes = await Resume.find({
    user: req.session.user._id,
  });

  res.render("./jobApps/edit.ejs", {
    pageTitle: "Edit Job App",
    jobApp,
    companies,
    resumes,
  });
};

// POST "/jobApps/"
const createApp = async (req, res) => {
  req.body.archived = req.body.archived === "on" ? true : false;
  req.body.user = req.session.user._id;
  // Remove appliedAt if it's an empty string
  if (req.body.appliedAt === "") {
    delete req.body.appliedAt;
  } else {
    const date = new Date(req.body.appliedAt);
    date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
    req.body.appliedAt = date;
  }
  await JobApp.create(req.body);
  res.redirect("/jobApps");
};

// DELETE "/jobApps/:id"
const deleteApp = async (req, res) => {
  const jobApp = await JobApp.findOneAndDelete({
    _id: req.params.id,
    user: req.session.user._id,
  });
  res.redirect("/jobApps");
};

// PUT "/jobApps/:id"
const updateApp = async (req, res) => {
  req.body.archived = req.body.archived === "on" ? true : false;
  // Remove appliedAt if it's an empty string
  if (req.body.appliedAt === "") {
    delete req.body.appliedAt;
  } else {
    const date = new Date(req.body.appliedAt);
    date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
    req.body.appliedAt = date;
  }
  const jobApp = await JobApp.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.session.user._id,
    },
    req.body,
  );
  res.redirect(`/jobApps/${req.params.id}`);
};

module.exports = {
  renderIndex,
  renderNewAppForm,
  renderShowAppPage,
  renderEditAppForm,
  createApp,
  deleteApp,
  updateApp,
};
