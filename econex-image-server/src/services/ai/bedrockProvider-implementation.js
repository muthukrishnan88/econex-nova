import { logger } from "../../utils/logger.js";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export class BedrockAIProvider {
    constructor(config) {
        this.config = config;
        this.name = "AWS Bedrock Provider";

        if (!config.accessKeyId || !config.secretAccessKey) {
            throw new Error("AWS credentials not configured.");
        }

        this.client = new BedrockRuntimeClient({
            region: config.region,
            credentials: {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey
            }
        });

        this.modelId = config.modelId || "anthropic.claude-3-sonnet-20240229-v1:0";
        logger.info(`AWS Bedrock Provider initialized with model: ${this.modelId}`);
    }

    async verifyImageAuthenticity(imageBuffer, mimeType) {
        const prompt = `Analyze this image to determine if it appears to be an original photograph or an AI-generated image.

Look for indicators of AI generation:
- Unrealistic textures or patterns
- Inconsistent lighting
- Unnatural object placement
- Artificial-looking elements
- Digital artifacts common in AI generation

Respond in JSON:
{
    "imageType": "original" | "ai_generated" | "uncertain",
    "confidence": <number 0-100>,
    "accepted": <boolean>,
    "message": "<string explaining the determination>",
    "reason": "<string with specific observations>"
}

If the image appears to be an original photo of environmental waste/pollution, set accepted=true.
If AI-generated or very uncertain, set accepted=false.`;

        try {
            const response = await this._callModel(imageBuffer, mimeType, prompt);
            return {
                ...response,
                isDevelopmentMode: false
            };
        } catch (error) {
            logger.error("Image verification error:", error);
            return {
                imageType: "uncertain",
                confidence: 0,
                accepted: true, // Allow in production to not block workflow
                message: "Image verification temporarily unavailable. Proceeding with analysis.",
                error: error.message
            };
        }
    }

    async analyzeWaste(imageBuffer, mimeType) {
        const prompt = `You are an AI environmental analyst. Analyze this image for waste and environmental objects.

Detect ALL clearly visible objects in the image. For EACH object provide:

{
    "success": true,
    "analysisMode": "AI",
    "imageQuality": {
        "score": <0-100>,
        "status": "good" | "adequate" | "poor",
        "resolution": "high" | "adequate" | "low",
        "lighting": "excellent" | "sufficient" | "poor",
        "clarity": "clear" | "moderate" | "blurry"
    },
    "summary": {
        "totalObjects": <number>,
        "estimatedTotalWeightGrams": <number>,
        "estimatedWeightRange": {
            "minGrams": <number>,
            "maxGrams": <number>
        }
    },
    "objects": [
        {
            "name": "<object name>",
            "material": "Plastic" | "Metal" | "Paper" | "Glass" | "Organic" | "E-Waste" | "Hazardous Waste" | "Mixed Material",
            "subtype": "<specific material subtype like PET, Aluminium, Cardboard, etc>",
            "quantity": <number>,
            "detectionConfidence": <0-100>,
            "weight": {
                "estimatedGrams": <number>,
                "minGrams": <number>,
                "maxGrams": <number>,
                "confidence": <0-100>
            },
            "biodegradable": <boolean>,
            "recyclable": <boolean>,
            "recyclabilityScore": <0-100>,
            "environmentalRisk": "Low" | "Medium" | "High" | "Critical",
            "environmentalImpact": "<detailed explanation of environmental impact>",
            "recyclingMethod": "<step-by-step recycling instructions>",
            "reuseIdeas": ["<idea 1>", "<idea 2>", "<idea 3>"],
            "disposalMethod": "<proper disposal instructions>",
            "recommendedAction": "<specific action recommendation>"
        }
    ],
    "materialBreakdown": [
        {
            "material": "<material name>",
            "count": <number>,
            "percentage": <number>
        }
    ],
    "greenImpactScore": <0-100>,
    "impactExplanation": "<explanation of score>",
    "actionPlan": [
        "<action 1>",
        "<action 2>",
        ...
    ],
    "limitations": [
        "Weight is visually estimated from image analysis.",
        "Object detection confidence depends on image quality.",
        "Recycling availability varies by location.",
        "Environmental scores are AI-generated indicators."
    ]
}

IMPORTANT:
- Weight must be ESTIMATED, never claim exact measurement
- Only detect objects clearly visible in the image
- Use realistic weight estimates
- Provide specific, actionable recycling instructions
- Calculate percentage for material breakdown
- Action plan should be practical and location-aware`;

        try {
            const response = await this._callModel(imageBuffer, mimeType, prompt);
            return response;
        } catch (error) {
            logger.error("Waste analysis error:", error);
            throw new Error(`Waste analysis failed: ${error.message}`);
        }
    }

    async analyzePollution(imageBuffer, mimeType) {
        const prompt = `Analyze this image for environmental pollution.

Respond in JSON:
{
    "pollutionType": "<type of pollution>",
    "category": "<pollution category>",
    "severity": "Low" | "Moderate" | "High" | "Critical",
    "severityScore": <0-100>,
    "confidence": <0-100>,
    "description": "<detailed description>",
    "detectedEvidence": ["<evidence 1>", "<evidence 2>", ...],
    "environmentalImpact": "<impact description>",
    "urgency": "Low" | "Medium" | "High" | "Critical",
    "recommendedAction": "<primary action>",
    "recommendedActions": [
        "<action 1>",
        "<action 2>",
        ...
    ],
    "greenImpactScore": <0-100>,
    "impactExplanation": "<explanation>"
}

Identify: plastic pollution, water pollution, air pollution, land pollution, illegal dumping, etc.`;

        try {
            const response = await this._callModel(imageBuffer, mimeType, prompt);
            return response;
        } catch (error) {
            logger.error("Pollution analysis error:", error);
            throw new Error(`Pollution analysis failed: ${error.message}`);
        }
    }

    async _callModel(imageBuffer, mimeType, prompt) {
        // Convert buffer to base64
        const base64Image = imageBuffer.toString('base64');

        const payload = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 4096,
            temperature: 0.3,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: mimeType,
                                data: base64Image
                            }
                        },
                        {
                            type: "text",
                            text: prompt
                        }
                    ]
                }
            ]
        };

        const command = new InvokeModelCommand({
            modelId: this.modelId,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(payload)
        });

        const response = await this.client.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));

        // Extract text from Claude response
        const text = responseBody.content[0].text;

        // Parse JSON from response
        // Claude sometimes wraps JSON in markdown code blocks
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("Failed to parse JSON response from model");
        }

        const jsonText = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonText);
    }
}

/*
INSTALLATION INSTRUCTIONS:

1. Install AWS SDK:
   cd econex-image-server
   npm install @aws-sdk/client-bedrock-runtime

2. Configure .env file:
   AI_PROVIDER=bedrock
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0

3. Replace current bedrockProvider.js with this file

4. Restart server

The provider will use Claude 3 Sonnet with vision to analyze images and return
structured JSON matching the enhanced schema.
*/
