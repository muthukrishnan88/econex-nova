import { getAIProvider } from "./aiProvider.js";
import { ImageValidator } from "../image/imageValidator.js";

export class PollutionAnalyzer {
    static async analyze(file) {
        ImageValidator.validate(file);

        const aiProvider = getAIProvider();

        const result = await aiProvider.analyzePollution(
            file.buffer,
            file.mimetype
        );

        return {
            success: true,
            analysisType: "pollution",
            ...result
        };
    }
}
