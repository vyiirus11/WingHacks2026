const express = require("express");
const router = express.Router();
const StudySpace = require("../models/StudySpace");
const Review = require("../models/Review");

router.get("/", async (req, res) => {
  try {
    const { tag } = req.query;
    const query = tag ? { tags: { $in: [new RegExp(tag, "i")] } } : {};
    const spaces = await StudySpace.find(query).sort({ createdAt: -1 }).lean();

    const spaceIds = spaces.map(s => s._id);
    const agg = await Review.aggregate([
      { $match: { spaceId: { $in: spaceIds } } },
      {
        $group: {
          _id: "$spaceId",
          avgStudy: { $avg: "$ratings.study" },
          avgSafety: { $avg: "$ratings.safety" },
          avgInclusivity: { $avg: "$ratings.inclusivity" },
          count: { $sum: 1 }
        }
      }
    ]);

    const scoreMap = new Map(
      agg.map(a => [String(a._id), {
        count: a.count,
        confidence: Number(((a.avgStudy + a.avgSafety + a.avgInclusivity) / 3).toFixed(2))
      }])
    );

    const out = spaces.map(s => {
      const extra = scoreMap.get(String(s._id)) || { count: 0, confidence: null };
      return { ...s, reviewCount: extra.count, confidence: extra.confidence };
    });

    res.json(out);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const space = await StudySpace.create(req.body);
    res.json(space);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;