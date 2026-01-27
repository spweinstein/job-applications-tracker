const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },

  description: String,
});

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
  },

  school: {
    type: String,
    required: true,
  },

  year: Number,
});

const projectSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },

  year: Number,

  title: {
    type: String,
    required: true,
  },

  link: String,

  description: String,
});

const certificationSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },

  year: Number,

  title: {
    type: String,
    required: true,
  },

  description: String,
});

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    link: {
      type: String,
    },

    summary: String,

    notes: String,

    experience: [experienceSchema],
    education: [educationSchema],
    projects: [projectSchema],
    certifications: [certificationSchema],
    skills: [String],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Resume", resumeSchema);
