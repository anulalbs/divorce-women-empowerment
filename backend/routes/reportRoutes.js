import express from "express";
import mongoose from "mongoose";
import Report from "../models/Report.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Create a new report
router.post("/", authMiddleware, async (req, res) => {
  try {
    const reporterId = req.user?._id;
    const { expertId, comment } = req.body;

    if (!expertId || !mongoose.isValidObjectId(expertId)) {
      return res.status(400).json({ message: "Invalid expertId" });
    }
    if (!comment || typeof comment !== "string" || !comment.trim()) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const report = await Report.create({
      expertId,
      userId: reporterId,
      comment: comment.trim(),
      status: "open",
    });

    res.status(201).json(report);
  } catch (err) {
    console.error("/reports POST error", err);
    res.status(500).json({ message: "Failed to create report" });
  }
});

  // Check reports for one or many expert IDs
  // GET /api/reports/check/:expertId  -> { reported: true/false, matched: [report,..] }
  // GET /api/reports/check?expertIds=id1,id2 -> { reportedIds: [id1,...] }
  router.get("/check/:expertId", authMiddleware, async (req, res) => {
    try {
      const { expertId } = req.params;
      if (!expertId || !mongoose.isValidObjectId(expertId)) {
        return res.status(400).json({ message: "Invalid expertId" });
      }
      const report = await Report.findOne({
        expertId,
        status: { $in: ["open", "in-progress"] },
      });
      return res.json({ reported: !!report, report });
    } catch (err) {
      console.error("/reports/check/:expertId error", err);
      res.status(500).json({ message: "Failed to check reports" });
    }
  });

  router.get("/check", authMiddleware, async (req, res) => {
    try {
      const { expertIds } = req.query;
      if (!expertIds) return res.json({ reportedIds: [] });
      const ids = expertIds.split(",").map((s) => s.trim()).filter(Boolean);
      const validIds = ids.filter((i) => mongoose.isValidObjectId(i));
      if (validIds.length === 0) return res.json({ reportedIds: [] });
      const reports = await Report.find({
        expertId: { $in: validIds },
        status: { $in: ["open", "in-progress", "closed"] },
      }).select("expertId");
      const reportedIds = reports.map((r) => String(r.expertId));
      return res.json({ reportedIds });
    } catch (err) {
      console.error("/reports/check error", err);
      res.status(500).json({ message: "Failed to check reports" });
    }
  });

// Admin: get all reports for an expert (populate reporter info)
router.get("/expert/:expertId", authMiddleware, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { expertId } = req.params;
    if (!expertId || !mongoose.isValidObjectId(expertId)) {
      return res.status(400).json({ message: "Invalid expertId" });
    }
    const reports = await Report.find({ expertId }).populate("userId", "fullname email").sort({ createdAt: -1 });
    return res.json({ reports });
  } catch (err) {
    console.error("/reports/expert/:expertId error", err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

// Admin: update a report (e.g., close it)
router.patch("/:reportId", authMiddleware, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { reportId } = req.params;
    const { status } = req.body;
    if (!reportId || !mongoose.isValidObjectId(reportId)) {
      return res.status(400).json({ message: "Invalid reportId" });
    }
    const allowed = ["open", "in-progress", "closed", "resolved"];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Report not found" });
    const previousStatus = report.status;
    if (status) report.status = status;
    await report.save();

    // If status transitions to in-progress, mark the expert as inactive (isActive = false)
    // If status was in-progress and now moved away, restore isActive = true
    try {
      const expertId = report.expertId;
      if (status === 'in-progress' && previousStatus !== 'in-progress') {
        await User.findByIdAndUpdate(expertId, { isActive: false });
      } else if (previousStatus === 'in-progress' && status !== 'in-progress') {
        await User.findByIdAndUpdate(expertId, { isActive: true });
      }
    } catch (uErr) {
      console.error('Failed to update expert isActive state', uErr);
    }

    return res.json({ report });
  } catch (err) {
    console.error("PATCH /reports/:reportId error", err);
    res.status(500).json({ message: "Failed to update report" });
  }
});

export default router;
