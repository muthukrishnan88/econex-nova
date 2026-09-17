import multer from "multer";
import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
    logger.error("Server error:", err);

    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                error: {
                    code: "FILE_TOO_LARGE",
                    message: "File size exceeds 10 MB limit."
                }
            });
        }

        return res.status(400).json({
            success: false,
            error: {
                code: "UPLOAD_ERROR",
                message: err.message
            }
        });
    }

    if (err.message) {
        return res.status(400).json({
            success: false,
            error: {
                code: "BAD_REQUEST",
                message: err.message
            }
        });
    }

    return res.status(500).json({
        success: false,
        error: {
            code: "SERVER_ERROR",
            message: "Internal server error occurred."
        }
    });
};
