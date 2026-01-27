const mongoose = require("mongoose");

const jobAppSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    title: String,
    status: {
      type: String,
      enum: ["Applied", "Interviewing", "Offer", "Rejected"],
      default: "Applied",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
    source: {
      type: String,
      enum: ["LinkedIn", "Indeed", "Company Site", "Networking"],
      default: "Indeed",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    url: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("JobApp", jobAppSchema);
