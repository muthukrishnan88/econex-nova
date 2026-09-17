import { VideoAnalyzer } from "../services/video/videoAnalyzer.js";
import { logger } from "../utils/logger.js";

const videoAnalyzer = new VideoAnalyzer();

/**
 * POST /api/video/analyze
 * Analyze video: AI detection first, then disaster analysis
 */
export async function analyzeVideo(req, res) {
    try {
        const { video, fileName, mimeType, size } = req.body;

        if (!video) {
            return res.status(400).json({
                success: false,
                error: "No video data provided"
            });
        }

        logger.info(`Analyzing video: ${fileName || "unknown"} (${size} bytes)`);

        const result = await videoAnalyzer.analyze({
            video,
            fileName,
            mimeType,
            size
        });

        res.json(result);

    } catch (error) {
        logger.error("Video analysis controller error:", error);
        res.status(500).json({
            success: false,
            error: error.message || "Video analysis failed"
        });
    }
}
