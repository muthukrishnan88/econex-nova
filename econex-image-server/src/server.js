import app from "./app.js";
import { config } from "./config/env.js";
import { logger } from "./utils/logger.js";

const PORT = config.port;

app.listen(PORT, () => {
    logger.info("");
    logger.info("==============================================");
    logger.info("     ECONEX NOVA IMAGE SERVER");
    logger.info("==============================================");
    logger.info(`Server  : http://localhost:${PORT}`);
    logger.info(`Health  : http://localhost:${PORT}/api/health`);
    logger.info("");
    logger.info("API Endpoints:");
    logger.info(`  POST http://localhost:${PORT}/api/image/verify`);
    logger.info(`  POST http://localhost:${PORT}/api/waste/analyze`);
    logger.info(`  POST http://localhost:${PORT}/api/pollution/analyze`);
    logger.info("");
    logger.info(`Mode    : ${config.isDevelopment ? "DEVELOPMENT" : "PRODUCTION"}`);
    logger.info(`AI      : ${config.ai.provider}`);
    logger.info("==============================================");
    logger.info("");
});
