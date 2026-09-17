import { ImageVerifier } from "../services/ai/imageVerifier.js";
import { logger } from "../utils/logger.js";

export class ImageController {
    static async verify(req, res, next) {
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

            const result = await ImageVerifier.verify(req.file);

            return res.json(result);

        } catch (error) {
            logger.error("Image verification error:", error.message);
            next(error);
        }
    }
}
