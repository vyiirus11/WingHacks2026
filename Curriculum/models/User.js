const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    pronouns: { type: String },
    identityTags: [{ type: String }],
    role: { type: String, enum: ["mentor", "mentee", "admin"], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);