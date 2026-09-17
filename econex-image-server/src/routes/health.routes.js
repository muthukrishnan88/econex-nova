import express from "express";
import { config } from "../config/env.js";

const router = express.Router();

router.get("/health", (req, res) => {
    res.json({
        ok: true,
        service: "ECONEX NOVA Environmental Image Server",
        version: "1.0.0",
        status: "running",
        mode: config.isDevelopment ? "DEVELOPMENT" : "PRODUCTION",
        aiProvider: config.ai.provider,
        endpoints: {
            verify: "POST /api/image/verify",
            waste: "POST /api/waste/analyze",
            pollution: "POST /api/pollution/analyze"
        }
    });
});

export default router;
