const mongoose = require("mongoose");

const MentorProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    major: { type: String, required: true },
    year: { type: String, required: true },
    coursesStrong: [{ type: String }],
    interests: [{ type: String }],
    availability: [{ type: String }],
    mentorshipStyle: { type: String, default: "Support + accountability" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MentorProfile", MentorProfileSchema);