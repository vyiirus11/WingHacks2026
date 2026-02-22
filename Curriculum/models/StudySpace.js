const mongoose = require("mongoose");

const StudySpaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    locationText: { type: String, required: true },
    tags: [{ type: String }],
    geo: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
    }
  },
  { timestamps: true }
);

StudySpaceSchema.index({ geo: "2dsphere" });

module.exports = mongoose.model("StudySpace", StudySpaceSchema);