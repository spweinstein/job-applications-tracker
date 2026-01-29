const User = require("./user.js");
const Company = require("./company.js");
const JobApp = require("./jobApp.js");
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  jobApp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobApp",
    required: true,
  },
  startAt: {
    type: Date,
    required: true,
  },
  endAt: Date,
  type: {
    type: String,
    enum: ["Task", "Interview", "Meeting", "Event", "Email", "Call"],
  },
  state: {
    type: String,
    enum: ["Planned", "Done", "Canceled"],
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  notes: String,
});

module.exports = mongoose.model("Activity", activitySchema);
