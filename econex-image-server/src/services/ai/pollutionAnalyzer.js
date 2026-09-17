import { getAIProvider } from "./aiProvider.js";
import { ImageValidator } from "../image/imageValidator.js";
import { pollutionCache } from "./pollutionCache.js";
import { EvidenceValidator } from "./evidenceValidator.js";
import { logger } from "../../utils/logger.js";

export class PollutionAnalyzer {
    static async analyze(file) {
        ImageValidator.validate(file);

        const aiProvider = getAIProvider();
        const modelVersion = aiProvider.modelId || aiProvider.name;

        // Check cache for deterministic results
        const cachedResult = pollutionCache.get(file.buffer, modelVersion);
        if (cachedResult) {
            logger.info("Returning cached pollution analysis (ensures same image = same result)");
            return {
                success: true,
                analysisType: "pollution",
                cached: true,
                ...cachedResult
            };
        }

        // Call AI provider
        const result = await aiProvider.analyzePollution(
            file.buffer,
            file.mimetype
        );

        // Validate and correct result
        const validated = EvidenceValidator.validate(result);

        const finalResult = {
            success: true,
            analysisType: "pollution",
            cached: false,
            ...validated
        };

        // Cache for future requests
        pollutionCache.set(file.buffer, validated, modelVersion);

        return finalResult;
    }
}
