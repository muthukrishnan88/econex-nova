import { DisasterAnalyzer } from "../services/disaster/disasterAnalyzer.js";
import { logger } from "../utils/logger.js";

const analyzer = new DisasterAnalyzer();

export class DisasterController {
    static async analyze(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: "NO_FILE",
                        message: "No image file provided."
                    }
                });
            }

            const result = await analyzer.analyze(req.file);

            return res.json(result);

        } catch (error) {
            logger.error("Disaster analysis error:", error.message);
            next(error);
        }
    }
}
