import { config } from "../../config/env.js";
import { MockAIProvider } from "./mockProvider.js";
import { BedrockAIProvider } from "./bedrockProvider.js";
import { logger } from "../../utils/logger.js";

let aiProviderInstance = null;

export function getAIProvider() {
    if (aiProviderInstance) {
        return aiProviderInstance;
    }

    const provider = config.ai.provider.toLowerCase();

    if (provider === "bedrock") {
        try {
            aiProviderInstance = new BedrockAIProvider(config.ai.bedrock);
            logger.info("AI Provider: AWS Bedrock");
        } catch (error) {
            logger.warn("Bedrock initialization failed, falling back to mock:", error.message);
            aiProviderInstance = new MockAIProvider();
        }
    } else {
        aiProviderInstance = new MockAIProvider();
        logger.info("AI Provider: Mock (Development Mode)");
    }

    return aiProviderInstance;
}
