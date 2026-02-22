const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    spaceId: { type: mongoose.Schema.Types.ObjectId, ref: "StudySpace", required: true },
    userName: { type: String, default: "Anonymous" },
    ratings: {
      study: { type: Number, min: 1, max: 5, required: true },
      safety: { type: Number, min: 1, max: 5, required: true },
      inclusivity: { type: Number, min: 1, max: 5, required: true }
    },
    tags: [{ type: String }],
    comment: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);