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
        const prompt = `You are an AI environmental analyst. Analyze this image for pollution indicators.

IMPORTANT ACCURACY RULES:
- Never fabricate pollutant measurements from a photograph
- Use "estimated", "likely", "possible" appropriately
- Acknowledge uncertainty clearly
- Distinguish visual evidence from direct measurement
- Use calm, measured language (not panic-inducing)

CRITICAL: Respond ONLY with valid JSON. No markdown code blocks, no explanatory text before or after.

Respond with this exact JSON structure:
{
  "authenticity": {
    "classification": "original_likely" | "uncertain" | "ai_generated_or_manipulated",
    "confidence": <0-100>,
    "aiGeneratedLikelihood": <0-100>,
    "manipulationLikelihood": <0-100>,
    "provenance": "not_available",
    "message": "<brief explanation of authenticity assessment>"
  },
  "scene": {
    "description": "<describe the environmental scene visible in the image>",
    "imageQuality": <0-100>
  },
  "pollution": {
    "primaryType": "air_pollution" | "water_pollution" | "land_pollution" | "plastic_pollution" | "soil_pollution" | "noise_pollution",
    "primarySubtype": "<specific subtype like open_waste_burning, sewage_discharge, plastic_littering, vehicle_emissions, etc>",
    "confidence": <0-100>,
    "secondaryTypes": ["<secondary type 1>", "<secondary type 2>"],
    "visualEvidence": [
      "<specific visual indicator 1>",
      "<specific visual indicator 2>",
      "<specific visual indicator 3>",
      "<specific visual indicator 4>",
      "<specific visual indicator 5>"
    ],
    "likelySources": [
      {
        "source": "<pollution source name>",
        "confidence": <0-100>,
        "evidence": "<explanation of why this source is identified>"
      }
    ],
    "potentialPollutants": [
      "<pollutant name 1>",
      "<pollutant name 2>",
      "<pollutant name 3>"
    ],
    "concernScore": <0-100>,
    "concernLevel": "low" | "moderate" | "moderate_to_high" | "high" | "critical"
  },
  "healthImpact": {
    "summary": "<calm summary of potential health impacts>",
    "possibleEffects": [
      "<possible health effect 1>",
      "<possible health effect 2>",
      "<possible health effect 3>"
    ],
    "note": "Actual health risk depends on pollutant concentration, exposure duration, and individual susceptibility."
  },
  "environmentalImpact": {
    "air": "<impact on air quality if applicable>",
    "water": "<impact on water if applicable>",
    "soil": "<impact on soil if applicable>",
    "wildlife": "<impact on wildlife if applicable>",
    "climate": "<impact on climate if applicable>",
    "general": "<overall environmental impact statement>"
  },
  "pollutionPathway": [
    "<step 1 in how this pollution was created>",
    "<step 2>",
    "<step 3>",
    "<step 4>"
  ],
  "reductionPlan": [
    "<specific action to reduce this pollution>",
    "<action 2>",
    "<action 3>",
    "<action 4>"
  ],
  "preventionPlan": [
    "<specific prevention action>",
    "<action 2>",
    "<action 3>",
    "<action 4>"
  ],
  "actionPriority": {
    "now": ["<immediate action 1>", "<immediate action 2>"],
    "next": ["<short-term action 1>", "<short-term action 2>"],
    "longTerm": ["<prevention strategy 1>", "<prevention strategy 2>"]
  }
}

DETECTION RULES:
- Detect ALL visible pollution indicators in the image
- If no pollution is clearly visible, set concernScore low and explain in visual evidence
- Provide 5-7 specific visual evidence items
- List 3-6 potential pollutants based on source type
- Give realistic concern scores (not everything is critical)
- Health and environmental impacts should be scientifically grounded
- Action plans should be practical and specific

Pollution types to consider:
- Air pollution (smoke, haze, industrial emissions, vehicle exhaust, burning)
- Water pollution (contamination, discoloration, floating debris, sewage, oil)
- Plastic pollution (bottles, bags, containers, littering)
- Land pollution (garbage dumping, waste accumulation, soil contamination)
- Other environmental degradation

Be thorough but accurate. Only report what can be reasonably inferred from visual evidence.`;

        try {
            const response = await this._callModel(imageBuffer, mimeType, prompt);

            return {
                ...response,
                measurement: {
                    available: false,
                    message: "Pollutant concentrations cannot be measured from this image alone. Connect a compatible air-quality sensor or API for real-time measurements."
                },
                limitations: [
                    "Image analysis cannot directly measure pollutant concentration.",
                    "Source attribution may be uncertain without additional context.",
                    "Actual health and environmental risk depends on pollutant concentration, exposure duration, and local conditions.",
                    "Visual evidence may not capture all pollution sources in the area."
                ]
            };
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
