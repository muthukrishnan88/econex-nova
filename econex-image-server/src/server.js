import app from "./app.js";
import { config } from "./config/env.js";
import { logger } from "./utils/logger.js";

const PORT = config.port;

const server = app.listen(PORT, () => {
    const host = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

    logger.info("");
    logger.info("==============================================");
    logger.info("     ECONEX NOVA IMAGE SERVER");
    logger.info("==============================================");
    logger.info(`Server  : ${host}`);
    logger.info(`Health  : ${host}/api/health`);
    logger.info("");
    logger.info("API Endpoints:");
    logger.info(`  POST ${host}/api/image/verify`);
    logger.info(`  POST ${host}/api/waste/analyze`);
    logger.info(`  POST ${host}/api/pollution/analyze`);
    logger.info("");
    logger.info(`Mode    : ${config.isDevelopment ? "DEVELOPMENT" : "PRODUCTION"}`);
    logger.info(`AI      : ${config.ai.provider}`);
    logger.info(`Frontend: ${config.frontend.url}`);
    logger.info("==============================================");
    logger.info("");
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
    });
});
