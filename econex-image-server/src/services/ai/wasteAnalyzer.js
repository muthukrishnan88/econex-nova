import { getAIProvider } from "./aiProvider.js";
import { ImageValidator } from "../image/imageValidator.js";

export class WasteAnalyzer {
    static async analyze(file) {
        ImageValidator.validate(file);

        const aiProvider = getAIProvider();

        const result = await aiProvider.analyzeWaste(
            file.buffer,
            file.mimetype
        );

        return {
            success: true,
            analysisType: "waste",
            ...result
        };
    }
}
