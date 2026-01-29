const Activity = require("../models/activity.js");
const Company = require("../models/company.js");
const JobApp = require("../models/jobApp.js");

// GET "/activities/"
const renderIndex = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "startAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  const skip = (page - 1) * limit;

  const filter = { user: req.session.user._id };

  const [activities, totalCount] = await Promise.all([
    Activity.find(filter)
      .populate("company")
      .populate("jobApp")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Activity.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  console.log(activities);

  res.render("./activities/index.ejs", {
    pageTitle: "Activities",
    activities,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
    },
    sort: { sortBy, sortOrder: req.query.sortOrder || "desc" },
  });
};

// GET "/activities/new"
const renderNewActivityForm = async (req, res) => {
  const companies = await Company.find({
    user: req.session.user._id,
  });
  const jobApps = await JobApp.find({
    user: req.session.user._id,
  });
  res.render("./activities/new.ejs", {
    pageTitle: "New Activity",
    companies,
    jobApps,
  });
};

// GET "/activities/:id"
const renderShowActivityPage = async (req, res) => {
  const activity = await Activity.findOne({
    _id: req.params.id,
    user: req.session.user._id,
  })
    .populate("company")
    .populate("jobApp");
  res.render("./activities/show.ejs", {
    pageTitle: `View Activity`,
    activity,
  });
};

// GET "/activities/:id/edit"
const renderEditActivityForm = async (req, res) => {
  const activity = await Activity.findOne({
    _id: req.params.id,
    user: req.session.user._id,
  })
    .populate("company")
    .populate("jobApp");
  const companies = await Company.find({
    user: req.session.user._id,
  });
  const jobApps = await JobApp.find({
    user: req.session.user._id,
  });

  res.render("./activities/edit.ejs", {
    pageTitle: "Edit Activity",
    activity,
    companies,
    jobApps,
  });
};

// POST "/activities/"
const createActivity = async (req, res) => {
  req.body.user = req.session.user._id;

  // Handle startAt date
  if (req.body.startAt === "") {
    delete req.body.startAt;
  } else {
    const date = new Date(req.body.startAt);
    date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
    req.body.startAt = date;
  }

  // Handle endAt date (optional)
  if (req.body.endAt === "") {
    delete req.body.endAt;
  } else if (req.body.endAt) {
    const date = new Date(req.body.endAt);
    date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
    req.body.endAt = date;
  }

  await Activity.create(req.body);
  res.redirect("/activities");
};

// DELETE "/activities/:id"
const deleteActivity = async (req, res) => {
  const activity = await Activity.findOneAndDelete({
    _id: req.params.id,
    user: req.session.user._id,
  });
  res.redirect("/activities");
};

// PUT "/activities/:id"
const updateActivity = async (req, res) => {
  // Handle startAt date
  if (req.body.startAt === "") {
    delete req.body.startAt;
  } else {
    const date = new Date(req.body.startAt);
    date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
    req.body.startAt = date;
  }

  // Handle endAt date (optional)
  if (req.body.endAt === "") {
    delete req.body.endAt;
  } else if (req.body.endAt) {
    const date = new Date(req.body.endAt);
    date.setUTCHours(12, 0, 0, 0); // Set to noon UTC
    req.body.endAt = date;
  }

  const activity = await Activity.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.session.user._id,
    },
    req.body,
  );
  res.redirect(`/activities/${req.params.id}`);
};

module.exports = {
  renderIndex,
  renderNewActivityForm,
  renderShowActivityPage,
  renderEditActivityForm,
  createActivity,
  deleteActivity,
  updateActivity,
};
