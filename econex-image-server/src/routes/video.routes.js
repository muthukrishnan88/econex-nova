import express from "express";
import { analyzeVideo } from "../controllers/video.controller.js";

const router = express.Router();

/**
 * POST /api/video/analyze
 * Analyze video: AI check + disaster detection
 */
router.post("/analyze", analyzeVideo);

export default router;
