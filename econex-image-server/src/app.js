import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { corsMiddleware } from "./middleware/cors.js";
import { errorHandler } from "./middleware/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";
import imageRoutes from "./routes/image.routes.js";
import wasteRoutes from "./routes/waste.routes.js";
import pollutionRoutes from "./routes/pollution.routes.js";
import disasterRoutes from "./routes/disaster.routes.js";
import linkRoutes from "./routes/link.routes.js";
import videoRoutes from "./routes/video.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(corsMiddleware);

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Serve frontend static files from ai-main folder (single server solution)
const frontendPath = path.join(__dirname, "../../ai-main");
app.use(express.static(frontendPath));

app.use("/api", healthRoutes);
app.use("/api", imageRoutes);
app.use("/api", wasteRoutes);
app.use("/api", pollutionRoutes);
app.use("/api", disasterRoutes);
app.use("/api", linkRoutes);
app.use("/api/video", videoRoutes);

app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: "NOT_FOUND",
            message: "API endpoint not found."
        }
    });
});

app.use(errorHandler);

export default app;
