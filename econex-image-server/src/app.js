import express from "express";
import { corsMiddleware } from "./middleware/cors.js";
import { errorHandler } from "./middleware/errorHandler.js";
import healthRoutes from "./routes/health.routes.js";
import imageRoutes from "./routes/image.routes.js";
import wasteRoutes from "./routes/waste.routes.js";
import pollutionRoutes from "./routes/pollution.routes.js";

const app = express();

app.use(corsMiddleware);

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/api", healthRoutes);
app.use("/api", imageRoutes);
app.use("/api", wasteRoutes);
app.use("/api", pollutionRoutes);

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
