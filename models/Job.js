const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["Interview", "Accepted", "Declined", "Pending"],
      default: "Pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Remote", "Internship"],
      default: "Full-time",
    },
    jobLocation: {
      type: String,
      default: "Lagos",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
