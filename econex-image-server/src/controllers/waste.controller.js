import { WasteAnalyzer } from "../services/ai/wasteAnalyzer.js";
import { logger } from "../utils/logger.js";

export class WasteController {
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

            const result = await WasteAnalyzer.analyze(req.file);

            return res.json(result);

        } catch (error) {
            logger.error("Waste analysis error:", error.message);
            next(error);
        }
    }
}
