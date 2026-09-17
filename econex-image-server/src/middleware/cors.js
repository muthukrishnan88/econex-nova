import cors from "cors";
import { config } from "../config/env.js";

export const corsMiddleware = cors({
    origin: (origin, callback) => {
        // In production, allow configured frontend URL
        // In development, allow localhost variants
        const allowedOrigins = [
            config.frontend.url,
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:3000",
            "http://localhost:8000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:8000"
        ];

        // Allow if no origin (same-origin or server-to-server)
        if (!origin) {
            return callback(null, true);
        }

        // Allow if origin in whitelist
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Allow Render frontend URLs (*.onrender.com)
        if (origin.endsWith('.onrender.com')) {
            return callback(null, true);
        }

        // Development mode: allow all
        if (config.isDevelopment) {
            return callback(null, true);
        }

        // Production: reject unknown origins
        callback(new Error('Not allowed by CORS'));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"]
});
