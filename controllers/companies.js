const Company = require("../models/company.js");
const JobApp = require("../models/jobApp.js");

// GET "/companies/"
const renderIndex = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "appliedAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const skip = (page - 1) * limit;

  const filter = { user: req.session.user._id };

  const [companies, totalCount] = await Promise.all([
    Company.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Company.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  res.render("./companies/index.ejs", {
    pageTitle: "Companies",
    companies,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
    sort: { sortBy, sortOrder: req.query.sortOrder || "desc" },
  });
};

// GET "/companies/new"
const renderNewCompanyForm = (req, res) => {
  res.render("companies/new.ejs", {
    pageTitle: "New Company",
  });
};

// GET "/companies/:id"
const renderShowCompanyPage = async (req, res) => {
  const company = await Company.findOne({
    user: req.session.user._id,
    _id: req.params.id,
  });
  const previewLimit = 10;

  const [jobApps, totalJobAppsCount] = await Promise.all([
    JobApp.find({ company: req.params.id })
      .sort({ updatedAt: -1 })
      .limit(previewLimit),
    JobApp.countDocuments({ company: req.params.id }),
  ]);
  res.render("./companies/show.ejs", {
    pageTitle: "Company Details",
    company,
    jobApps,
    totalJobAppsCount,
    previewLimit,
  });
};

// GET "/companies/:id/edit"
const renderEditCompanyForm = async (req, res) => {
  const company = await Company.findOne({
    user: req.session.user._id,
    _id: req.params.id,
  });
  res.render("./companies/edit.ejs", {
    pageTitle: "Edit Company",
    company,
  });
};

// POST "/companies/:id"
const createCompany = async (req, res) => {
  const companyInDatabase = await Company.findOne({
    user: req.session.user._id,
    name: req.body.name,
  });
  if (companyInDatabase) {
    // res.send(`Company ${req.body.name} already in database!`);
    res.render("companies/new.ejs", {
      pageTitle: "New Company",
      error: `Company ${req.body.name} already in database!`,
    });
  } else {
    req.body.user = req.session.user._id;
    await Company.create(req.body);
    res.redirect("/companies");
  }
};

// DELETE "/companies/:id"
const deleteCompany = async (req, res) => {
  await Company.findOneAndDelete({
    user: req.session.user._id,
    _id: req.params.id,
  });
  res.redirect("/companies");
};

// PUT "/companies/:id"
const updateCompany = async (req, res) => {
  // Check if another company with this name exists (excluding current company)
  const duplicateCompany = await Company.findOne({
    user: req.session.user._id,
    name: req.body.name,
    _id: { $ne: req.params.id }, // Exclude the current company being updated
  });

  if (duplicateCompany) {
    // Could use flash messages, or for now, send error
    res.render("companies/edit.ejs", {
      pageTitle: "Edit Company",
      error: `Company ${req.body.name} already in database!`,
      company: req.body,
    });
  }

  await Company.findOneAndUpdate(
    {
      user: req.session.user._id,
      _id: req.params.id,
    },
    req.body,
  );
  res.redirect("/companies");
};

module.exports = {
  renderIndex,
  renderNewCompanyForm,
  renderShowCompanyPage,
  renderEditCompanyForm,
  createCompany,
  deleteCompany,
  updateCompany,
};
