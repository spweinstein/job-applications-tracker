const Resume = require("../models/resume.js");
const Company = require("../models/company.js");

const renderIndex = async (req, res) => {
  const resumes = await Resume.find({
    user: req.session.user._id,
  });
  console.log(resumes);
  //   await Resume.populate(resumes, { path: "user" });
  res.render("./resumes/index.ejs", {
    pageTitle: "Resumes",
    resumes,
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

  console.log(resume.experience[0].company._id);
  res.render("./resumes/edit.ejs", {
    pageTitle: "Edit Resume",
    resume,
    companies,
  });
};

const createResume = async (req, res) => {
  req.body.user = req.session.user._id;
  console.log(req.body);

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
  });
  res.render("resumes/show.ejs", {
    resume,
    pageTitle: "Resume Details",
  });
};

const deleteResume = async (req, res) => {
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
