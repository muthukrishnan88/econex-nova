import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: Number(process.env.PORT) || 3000,

    nodeEnv: process.env.NODE_ENV || "development",

    isDevelopment: process.env.NODE_ENV !== "production",

    frontend: {
        url: process.env.FRONTEND_URL || "http://localhost:5173"
    },

    ai: {
        provider: process.env.AI_PROVIDER || "mock",

        bedrock: {
            region: process.env.AWS_REGION || "us-east-1",
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
            modelId: process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-sonnet-20240229-v1:0"
        }
    },

    upload: {
        maxFileSizeMB: Number(process.env.MAX_FILE_SIZE_MB) || 10,
        maxFileSizeBytes: (Number(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024,

        allowedTypes: (
            process.env.ALLOWED_FILE_TYPES ||
            "image/jpeg,image/jpg,image/png"
        ).split(",").map(t => t.trim())
    }
};
