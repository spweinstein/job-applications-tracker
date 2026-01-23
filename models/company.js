const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    website: String,
    description: String,
    notes: String,
  },
  {
    timestamps: true,
  },
);

// Enforce uniqueness on the pair user, name (user model, company name pair must be unique)
companySchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Company", companySchema);
