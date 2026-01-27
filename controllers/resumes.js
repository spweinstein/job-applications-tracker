const Resume = require("../models/resume.js");
const Company = require("../models/company.js");
const JobApp = require("../models/jobApp.js");

const renderIndex = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "updatedAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const skip = (page - 1) * limit;

  const filter = { user: req.session.user._id };

  const [resumes, totalCount] = await Promise.all([
    Resume.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Resume.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  res.render("./resumes/index.ejs", {
    pageTitle: "Resumes",
    resumes,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
    sort: { sortBy, sortOrder: req.query.sortOrder || "desc" },
  });
};

const renderNewResumeForm = async (req, res) => {
  const companies = await Company.find({
    user: req.session.user._id,
  });
  res.render("./resumes/new.ejs", {
    pageTitle: "Add Resume",
    companies,
  });
};

const renderEditResumeForm = async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.session.user._id,
  }).populate("experience.company");
  const companies = await Company.find({ user: req.session.user._id });

  res.render("./resumes/edit.ejs", {
    pageTitle: "Edit Resume",
    resume,
    companies,
  });
};

const createResume = async (req, res) => {
  req.body.user = req.session.user._id;

  await Resume.create(req.body);
  res.redirect("/resumes");
};

const updateResume = async (req, res) => {
  // Ensure that if we are updating the resume and emptying one of these optional sections,
  // that the optional section is cleared from the db record
  req.body.education = req.body.education ? req.body.education : [];
  req.body.projects = req.body.projects ? req.body.projects : [];
  req.body.certifications = req.body.certifications
    ? req.body.certifications
    : [];

  // Clean up empty company references
  if (req.body.projects) {
    req.body.projects.forEach((proj) => {
      if (proj.company === "") {
        delete proj.company;
      }
    });
  }

  if (req.body.certifications) {
    req.body.certifications.forEach((cert) => {
      if (cert.company === "") {
        delete cert.company;
      }
    });
  }

  await Resume.findOneAndUpdate(
    {
      user: req.session.user._id,
      _id: req.params.id,
    },
    req.body,
  );
  res.redirect(`/resumes/${req.params.id}`);
};

const showResume = async (req, res) => {
  const resume = await Resume.findOne({
    user: req.session.user._id,
    _id: req.params.id,
  })
    .populate("experience.company")
    .populate("projects.company")
    .populate("certifications.company");
  res.render("resumes/show.ejs", {
    resume,
    pageTitle: "Resume Details",
  });
};

const deleteResume = async (req, res) => {
  const jobAppCount = await JobApp.countDocuments({
    resume: req.params.id,
  });
  if (jobAppCount > 0) {
    const [resumes, totalCount] = await Promise.all([
      Resume.find({ user: req.session.user._id })
        .sort({ updatedAt: -1 })
        .limit(10),
      Resume.countDocuments({ user: req.session.user._id }),
    ]);

    return res.render("./resumes/index.ejs", {
      pageTitle: "Resumes",
      resumes,
      pagination: {
        currentPage: 1,
        totalPages: Math.ceil(totalCount / 10),
        totalCount,
        limit: 10,
      },
      sort: { sortBy: "updatedAt", sortOrder: "desc" },
      error: `Cannot delete resume. It has ${jobAppCount} linked job application(s). Please delete those first.`,
    });
  }

  await Resume.findOneAndDelete({
    _id: req.params.id,
    user: req.session.user._id,
  });
  res.redirect("../resumes");
};

module.exports = {
  renderIndex,
  renderNewResumeForm,
  renderEditResumeForm,
  createResume,
  updateResume,
  showResume,
  deleteResume,
};
