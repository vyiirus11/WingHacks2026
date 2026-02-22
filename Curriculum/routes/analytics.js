const express = require("express");
const router = express.Router();
const StressReport = require("../models/StressReport");
const Review = require("../models/Review");
const StudySpace = require("../models/StudySpace");

router.get("/overview", async (req, res) => {
  try {
    const hardestCourses = await StressReport.aggregate([
      { $group: { _id: "$courseCode", avgStress: { $avg: "$stressLevel" }, reports: { $sum: 1 } } },
      { $match: { reports: { $gte: 2 } } },
      { $sort: { avgStress: -1 } },
      { $limit: 8 },
      { $project: { _id: 0, courseCode: "$_id", avgStress: { $round: ["$avgStress", 2] }, reports: 1 } }
    ]);

    const topSpacesAgg = await Review.aggregate([
      {
        $group: {
          _id: "$spaceId",
          avgStudy: { $avg: "$ratings.study" },
          avgSafety: { $avg: "$ratings.safety" },
          avgInclusivity: { $avg: "$ratings.inclusivity" },
          reviews: { $sum: 1 }
        }
      },
      { $match: { reviews: { $gte: 2 } } },
      {
        $addFields: {
          confidence: {
            $round: [
              { $divide: [{ $add: ["$avgStudy", "$avgSafety", "$avgInclusivity"] }, 3] },
              2
            ]
          }
        }
      },
      { $sort: { confidence: -1 } },
      { $limit: 6 }
    ]);

    const spaceIds = topSpacesAgg.map(x => x._id);
    const spaces = await StudySpace.find({ _id: { $in: spaceIds } }).lean();
    const spaceMap = new Map(spaces.map(s => [String(s._id), s]));

    const topSpaces = topSpacesAgg.map(x => ({
      spaceName: spaceMap.get(String(x._id))?.name || "Space",
      confidence: x.confidence,
      reviews: x.reviews
    }));

    const safetyFlagsAgg = await Review.aggregate([
      { $match: { tags: { $in: [/harassment-risk/i] } } },
      { $group: { _id: "$spaceId", flagged: { $sum: 1 } } },
      { $sort: { flagged: -1 } },
      { $limit: 6 }
    ]);

    const flaggedIds = safetyFlagsAgg.map(x => x._id);
    const flaggedSpaces = await StudySpace.find({ _id: { $in: flaggedIds } }).lean();
    const flaggedMap = new Map(flaggedSpaces.map(s => [String(s._id), s.name]));

    const safetyFlags = safetyFlagsAgg.map(x => ({
      spaceName: flaggedMap.get(String(x._id)) || "Space",
      harassmentRiskReports: x.flagged
    }));

    res.json({ hardestCourses, topSpaces, safetyFlags });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/stress", async (req, res) => {
  try {
    const doc = await StressReport.create(req.body);
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;