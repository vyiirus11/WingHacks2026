const mongoose = require("mongoose");

const StressReportSchema = new mongoose.Schema(
  {
    major: { type: String, required: true },
    courseCode: { type: String, required: true },
    stressLevel: { type: Number, min: 1, max: 10, required: true },
    hoursStudied: { type: Number, min: 0, max: 80, default: 0 },
    note: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StressReport", StressReportSchema);