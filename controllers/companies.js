const Company = require("../models/company.js");
const JobApp = require("../models/jobApp.js");

// GET "/companies/"
const renderIndex = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "updatedAt";
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
  const jobAppCount = await JobApp.countDocuments({
    company: req.params.id,
  });
  if (jobAppCount > 0) {
    const [companies, totalCount] = await Promise.all([
      Company.find({ user: req.session.user._id })
        .sort({ updatedAt: -1 })
        .limit(10),
      Company.countDocuments({ user: req.session.user._id }),
    ]);

    return res.render("./companies/index.ejs", {
      pageTitle: "Companies",
      companies,
      pagination: {
        currentPage: 1,
        totalPages: Math.ceil(totalCount / 10),
        totalCount,
        limit: 10,
      },
      sort: { sortBy: "updatedAt", sortOrder: "desc" },
      error: `Cannot delete company. It has ${jobAppCount} linked job application(s). Please delete those first.`,
    });
  }

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
    return res.render("companies/edit.ejs", {
      pageTitle: "Edit Company",
      error: `Company ${req.body.name} already in database!`,
      company: req.body,
    });
  } else {
    await Company.findOneAndUpdate(
      {
        user: req.session.user._id,
        _id: req.params.id,
      },
      req.body,
    );
    res.redirect("/companies");
  }
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
