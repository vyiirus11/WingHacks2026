const express = require("express");
const router = express.Router();
const MentorProfile = require("../models/MentorProfile");

/**
 * POST /api/mentors/match
 * Body:
 * {
 *   major, year,
 *   coursesNeedHelp: ["COP3502"],
 *   interests: ["research"],
 *   availability: ["Mon 6-8pm"]
 * }
 *
 * Returns mentors with a computed matchScore.
 */
router.post("/match", async (req, res) => {
  try {
    const mentee = req.body;

    const mentors = await MentorProfile.find()
      .populate("userId", "name role")
      .lean();

    const scoreMentor = (m) => {
      let score = 0;

      const menteeCourses = new Set((mentee.coursesNeedHelp || []).map(x => x.toUpperCase()));
      const mentorCourses = new Set((m.coursesStrong || []).map(x => x.toUpperCase()));

      // Course overlap (strongest signal)
      let courseHits = 0;
      for (const c of menteeCourses) if (mentorCourses.has(c)) courseHits++;
      score += courseHits * 5;

      // Major match
      if (mentee.major && m.major && mentee.major.toLowerCase() === m.major.toLowerCase()) score += 3;

      // Interests overlap
      const menteeInterests = new Set((mentee.interests || []).map(x => x.toLowerCase()));
      const mentorInterests = new Set((m.interests || []).map(x => x.toLowerCase()));
      let interestHits = 0;
      for (const it of menteeInterests) if (mentorInterests.has(it)) interestHits++;
      score += interestHits * 2;

      // Availability overlap (exact string match)
      const menteeAvail = new Set((mentee.availability || []).map(x => x.toLowerCase()));
      const mentorAvail = new Set((m.availability || []).map(x => x.toLowerCase()));
      let availHits = 0;
      for (const a of menteeAvail) if (mentorAvail.has(a)) availHits++;
      score += availHits * 2;

      // Small bonus if same year (optional)
      if (mentee.year && m.year && mentee.year === m.year) score += 1;

      return score;
    };

    const results = mentors
      .map(m => ({
        mentorName: m.userId?.name || "Mentor",
        major: m.major,
        year: m.year,
        coursesStrong: m.coursesStrong || [],
        interests: m.interests || [],
        availability: m.availability || [],
        mentorshipStyle: m.mentorshipStyle || "",
        matchScore: scoreMentor(m)
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 8);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;