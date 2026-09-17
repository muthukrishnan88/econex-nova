import { PollutionAnalyzer } from "../services/ai/pollutionAnalyzer.js";
import { logger } from "../utils/logger.js";

export class PollutionController {
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

            const result = await PollutionAnalyzer.analyze(req.file);

            return res.json(result);

        } catch (error) {
            logger.error("Pollution analysis error:", error.message);
            next(error);
        }
    }
}
