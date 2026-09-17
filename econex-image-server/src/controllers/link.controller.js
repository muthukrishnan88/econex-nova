import { LinkAnalyzer } from "../services/link/linkAnalyzer.js";
import { logger } from "../utils/logger.js";

const analyzer = new LinkAnalyzer();

export class LinkController {
    static async analyze(req, res, next) {
        try {
            const url = req.body?.url;

            if (!url) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: "NO_URL",
                        message: "URL is required."
                    }
                });
            }

            const result = await analyzer.analyze(url);

            return res.json(result);

        } catch (error) {
            logger.error("Link analysis error:", error.message);
            next(error);
        }
    }
}
