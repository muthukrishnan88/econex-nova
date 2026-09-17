import multer from "multer";
import { config } from "../config/env.js";

const storage = multer.memoryStorage();

export const upload = multer({
    storage,

    limits: {
        fileSize: config.upload.maxFileSizeBytes,
        files: 1
    },

    fileFilter: (req, file, cb) => {
        if (config.upload.allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    `Unsupported file type. Allowed: ${config.upload.allowedTypes.join(", ")}`
                )
            );
        }
    }
});
