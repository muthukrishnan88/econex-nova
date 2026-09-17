import { config } from "../../config/env.js";

export class ImageValidator {
    static validate(file) {
        if (!file) {
            throw new Error("No image file provided.");
        }

        if (!file.buffer) {
            throw new Error("Invalid file data.");
        }

        if (!config.upload.allowedTypes.includes(file.mimetype)) {
            throw new Error(
                `Unsupported file type: ${file.mimetype}. ` +
                `Allowed types: ${config.upload.allowedTypes.join(", ")}`
            );
        }

        if (file.size > config.upload.maxFileSizeBytes) {
            throw new Error(
                `File size ${(file.size / 1024 / 1024).toFixed(2)} MB exceeds ` +
                `maximum ${config.upload.maxFileSizeMB} MB.`
            );
        }

        return true;
    }

    static getFileInfo(file) {
        return {
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            sizeKB: Math.round(file.size / 1024),
            sizeMB: (file.size / 1024 / 1024).toFixed(2)
        };
    }
}
