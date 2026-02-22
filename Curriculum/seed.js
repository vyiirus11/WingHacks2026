require("dotenv").config();
const mongoose = require("mongoose");

const StudySpace = require("./models/StudySpace");
const Review = require("./models/Review");
const User = require("./models/User");
const MentorProfile = require("./models/MentorProfile");
const StressReport = require("./models/StressReport");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected for seeding");

  // Clear old data
  await Promise.all([
    StudySpace.deleteMany({}),
    Review.deleteMany({}),
    User.deleteMany({}),
    MentorProfile.deleteMany({}),
    StressReport.deleteMany({})
  ]);

  // Create Study Spaces
  const spaces = await StudySpace.insertMany([
    {
      name: "Marston Science Library",
      locationText: "444 Newell Dr",
      tags: ["quiet", "stem", "outlets", "women-friendly", "well-lit"]
    },
    {
      name: "Library West",
      locationText: "1545 W University Ave",
      tags: ["quiet", "late-night", "safe"]
    }
  ]);

  // Create Users (Mentors)
  const users = await User.insertMany([
    { name: "Aisha", role: "mentor" },
    { name: "Mina", role: "mentor" }
  ]);

  // Mentor Profiles
  await MentorProfile.insertMany([
    {
      userId: users[0]._id,
      major: "Computer Science",
      year: "Senior",
      coursesStrong: ["COP3502", "COP3530"],
      interests: ["internships", "research"],
      availability: ["Mon 6-8pm"]
    },
    {
      userId: users[1]._id,
      major: "Mechanical Engineering",
      year: "Grad",
      coursesStrong: ["PHY2048", "MAC2312"],
      interests: ["grad-school"],
      availability: ["Tue 5-7pm"]
    }
  ]);

  // Reviews
  await Review.insertMany([
    {
      spaceId: spaces[0]._id,
      ratings: { study: 5, safety: 4, inclusivity: 5 },
      tags: ["good-lighting"]
    },
    {
      spaceId: spaces[1]._id,
      ratings: { study: 4, safety: 3, inclusivity: 4 },
      tags: ["harassment-risk"]
    }
  ]);

  // Stress Reports
  await StressReport.insertMany([
    { major: "Computer Science", courseCode: "COP3502", stressLevel: 8 },
    { major: "Computer Science", courseCode: "COP3502", stressLevel: 9 },
    { major: "Engineering", courseCode: "PHY2048", stressLevel: 7 }
  ]);

  console.log("✅ Seed complete!");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});