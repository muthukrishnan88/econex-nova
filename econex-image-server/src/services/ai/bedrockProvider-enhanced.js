import { logger } from "../../utils/logger.js";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export class BedrockAIProvider {
    constructor(config) {
        this.config = config;
        this.name = "AWS Bedrock Provider (Enhanced Evidence-First)";

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

        this.modelId = config.modelId || "anthropic.claude-3-5-sonnet-20241022-v2:0";
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
                accepted: true,
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
            "subtype": "<specific material subtype>",
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
            "environmentalImpact": "<detailed explanation>",
            "recyclingMethod": "<step-by-step instructions>",
            "reuseIdeas": ["<idea 1>", "<idea 2>"],
            "disposalMethod": "<proper disposal instructions>",
            "recommendedAction": "<specific action>"
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
    "impactExplanation": "<explanation>",
    "actionPlan": ["<action 1>", "<action 2>"],
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
- Provide specific, actionable recycling instructions`;

        try {
            const response = await this._callModel(imageBuffer, mimeType, prompt);
            return response;
        } catch (error) {
            logger.error("Waste analysis error:", error);
            throw new Error(`Waste analysis failed: ${error.message}`);
        }
    }

    async analyzePollution(imageBuffer, mimeType) {
        const prompt = `You are an AI environmental analyst. Analyze this image for pollution indicators using EVIDENCE-FIRST methodology.

═══════════════════════════════════════════════════════════════
CRITICAL ACCURACY RULES
═══════════════════════════════════════════════════════════════

1. OBSERVE FIRST, CLASSIFY SECOND
   - Start by describing what is ACTUALLY VISIBLE
   - Do NOT start with "what pollution types could exist"
   - Do NOT infer invisible pollution
   - Do NOT assume categories from context alone

2. EVIDENCE THRESHOLD
   - Confidence ≥ 85%: Confirmed finding
   - Confidence 70-84%: Possible (report with caution)
   - Confidence < 70%: Reject (do not include)

3. MAXIMUM DETECTIONS
   - 1 primary pollution type maximum
   - 2 secondary pollution types maximum
   - Do NOT return 8-10 categories

4. NEGATIVE EVIDENCE
   - Actively check what is NOT visible
   - Return rejected categories with reasons
   - Example: "Water Pollution: Not detected. Reason: No water visible in image."

5. NO FABRICATION
   - Never fabricate pollutant measurements
   - Never claim exact concentrations
   - Use "estimated", "likely", "possible" language
   - Acknowledge uncertainty clearly

6. CATEGORY-SPECIFIC RULES

   AIR POLLUTION:
   Require: visible smoke, emission plume, dust cloud, burning activity, atmospheric haze
   Reject if: image is merely outdoors with no smoke/emissions

   WATER POLLUTION:
   Require: visible contaminated water, discharge, oil film, floating waste, unusual water color
   Reject if: no water visible in image

   LAND POLLUTION:
   Require: accumulated waste, illegal dumping, litter concentration, contaminated soil
   Reject if: ground merely visible without waste

   PLASTIC POLLUTION:
   Require: visible plastic waste
   Reject if: plastic present but not clearly pollution

   OIL CONTAMINATION:
   Require: visible oil sheen, petroleum surface film, oil spill
   Reject if: just dark liquid without oil characteristics

   SEWAGE POLLUTION:
   Require: visible sewage discharge, wastewater outlet, obvious sewage flow
   Reject if: dirty water without sewage evidence

   INDUSTRIAL POLLUTION:
   Require: industrial facility, smokestack, factory emission, industrial waste context
   Reject if: smoke alone without industrial source

   WASTE BURNING:
   Require: visible fire + burning material + associated smoke
   Reject if: only smoke visible without fire

7. NO POLLUTION RESULT
   If image does NOT clearly show pollution:
   {
     "pollutionDetected": false,
     "reason": "No sufficient visual evidence of pollution event"
   }

═══════════════════════════════════════════════════════════════
ANALYSIS PIPELINE
═══════════════════════════════════════════════════════════════

STEP 1: Describe scene
What do you see? (objects, environment, activity)

STEP 2: Identify environmental elements
What environmental objects/events are visible?

STEP 3: Evaluate pollution evidence
For EACH category independently, is there sufficient evidence?

STEP 4: Classify ONLY supported categories
Return only findings with evidence ≥ 85% confidence

STEP 5: Reject unsupported categories
List categories checked but rejected

═══════════════════════════════════════════════════════════════
RESPONSE FORMAT (JSON ONLY, NO MARKDOWN)
═══════════════════════════════════════════════════════════════

{
  "scene": {
    "description": "<factual description of what is visible>",
    "imageQuality": <0-100>
  },

  "pollutionDetected": true | false,

  "primaryPollution": {
    "type": "open_waste_burning" | "air_pollution" | "water_pollution" | "land_pollution" | "plastic_pollution" | "oil_contamination" | "sewage_pollution" | "industrial_pollution",
    "label": "<human-readable label>",
    "confidence": <0-100>,
    "evidence": [
      "<specific visible indicator 1>",
      "<specific visible indicator 2>",
      "<specific visible indicator 3>"
    ]
  },

  "secondaryPollution": [
    {
      "type": "<type>",
      "label": "<label>",
      "confidence": <0-100>,
      "evidence": ["<indicator 1>", "<indicator 2>"]
    }
  ],

  "rejectedCategories": [
    {
      "type": "water_pollution",
      "reason": "No contaminated water visible in image."
    },
    {
      "type": "oil_contamination",
      "reason": "No visible oil spill or surface sheen."
    }
  ],

  "likelySources": [
    {
      "source": "<pollution source>",
      "confidence": <0-100>,
      "evidence": "<why this source is identified>"
    }
  ],

  "potentialPollutants": [
    "<pollutant 1>",
    "<pollutant 2>"
  ],

  "concern": {
    "score": <0-100>,
    "level": "low" | "moderate" | "moderate_to_high" | "high" | "critical",
    "explanation": "<why this score>"
  },

  "healthImpact": {
    "level": "none" | "minimal" | "moderate" | "significant",
    "summary": "<calm summary>",
    "possibleEffects": ["<effect 1>", "<effect 2>"]
  },

  "environmentalImpact": {
    "air": "<impact if relevant, otherwise null>",
    "water": "<impact if relevant, otherwise null>",
    "soil": "<impact if relevant, otherwise null>",
    "wildlife": "<impact if relevant, otherwise null>",
    "climate": "<impact if relevant, otherwise null>"
  },

  "pollutionPathway": [
    "<step 1 in how this pollution was created>",
    "<step 2>",
    "<step 3>"
  ],

  "reductionPlan": [
    "<specific action 1>",
    "<specific action 2>"
  ],

  "preventionPlan": [
    "<prevention action 1>",
    "<prevention action 2>"
  ],

  "actionPriority": {
    "now": ["<immediate action 1>", "<immediate action 2>"],
    "next": ["<short-term action 1>", "<short-term action 2>"],
    "longTerm": ["<prevention strategy 1>", "<prevention strategy 2>"]
  },

  "authenticity": {
    "classification": "original_likely" | "uncertain" | "ai_generated_or_manipulated",
    "confidence": <0-100>,
    "message": "<brief explanation>"
  }
}

═══════════════════════════════════════════════════════════════
EXAMPLES
═══════════════════════════════════════════════════════════════

CASE A: Image shows smoke rising from burning garbage

{
  "pollutionDetected": true,
  "primaryPollution": {
    "type": "open_waste_burning",
    "confidence": 95,
    "evidence": ["Visible fire", "Smoke plume", "Mixed waste materials"]
  },
  "secondaryPollution": [
    {
      "type": "air_pollution",
      "confidence": 93,
      "evidence": ["Visible smoke plume"]
    }
  ],
  "rejectedCategories": [
    {"type": "water_pollution", "reason": "No water visible"},
    {"type": "oil_contamination", "reason": "No oil characteristics"},
    {"type": "industrial_pollution", "reason": "No industrial source evidence"}
  ]
}

CASE B: Image shows clean forest

{
  "pollutionDetected": false,
  "scene": {"description": "Clean forest environment with trees and natural ground cover"},
  "reason": "No sufficient visual evidence of pollution event",
  "rejectedCategories": [
    {"type": "air_pollution", "reason": "Clear atmosphere, no visible smoke or emissions"},
    {"type": "water_pollution", "reason": "No water bodies visible"},
    {"type": "land_pollution", "reason": "No waste accumulation or contamination visible"}
  ]
}

CASE C: Image shows plastic waste in river

{
  "pollutionDetected": true,
  "primaryPollution": {
    "type": "water_pollution",
    "confidence": 94,
    "evidence": ["Floating plastic waste", "Contaminated water surface", "Visible debris"]
  },
  "secondaryPollution": [
    {
      "type": "plastic_pollution",
      "confidence": 92,
      "evidence": ["Multiple plastic items visible in water"]
    }
  ],
  "rejectedCategories": [
    {"type": "air_pollution", "reason": "No visible smoke or emissions"},
    {"type": "oil_contamination", "reason": "No oil sheen visible"},
    {"type": "industrial_pollution", "reason": "No industrial source visible"}
  ]
}

═══════════════════════════════════════════════════════════════

ANALYZE THIS IMAGE NOW using the evidence-first pipeline.

Return ONLY valid JSON. No markdown code blocks. No explanatory text.`;

        try {
            const response = await this._callModel(imageBuffer, mimeType, prompt);

            // Server-side validation
            const validated = this._validatePollutionResponse(response);

            return {
                success: true,
                analysisMode: "AI",
                ...validated,
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

    _validatePollutionResponse(response) {
        // Validate confidence thresholds
        if (response.primaryPollution && response.primaryPollution.confidence < 70) {
            logger.warn(`Primary pollution confidence ${response.primaryPollution.confidence} below threshold, removing`);
            delete response.primaryPollution;
            response.pollutionDetected = false;
        }

        // Validate secondary pollution
        if (response.secondaryPollution && Array.isArray(response.secondaryPollution)) {
            response.secondaryPollution = response.secondaryPollution
                .filter(p => p.confidence >= 70)
                .slice(0, 2); // Maximum 2 secondary
        }

        // Ensure rejectedCategories exists
        if (!response.rejectedCategories) {
            response.rejectedCategories = [];
        }

        // Validate primary pollution evidence
        if (response.primaryPollution && (!response.primaryPollution.evidence || response.primaryPollution.evidence.length === 0)) {
            logger.warn("Primary pollution has no evidence, removing");
            delete response.primaryPollution;
            response.pollutionDetected = false;
        }

        // Remove environmental impact categories with null values
        if (response.environmentalImpact) {
            Object.keys(response.environmentalImpact).forEach(key => {
                if (!response.environmentalImpact[key]) {
                    delete response.environmentalImpact[key];
                }
            });
        }

        return response;
    }

    async _callModel(imageBuffer, mimeType, prompt) {
        const base64Image = imageBuffer.toString('base64');

        const payload = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 4096,
            temperature: 0, // Deterministic mode for consistent classification
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

        const text = responseBody.content[0].text;

        // Parse JSON from response
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("Failed to parse JSON response from model");
        }

        const jsonText = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonText);
    }
}

/*
INSTALLATION:

1. Install AWS SDK:
   cd econex-image-server
   npm install @aws-sdk/client-bedrock-runtime

2. Configure .env:
   AI_PROVIDER=bedrock
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0

3. Replace bedrockProvider.js with this file

4. Restart server

FEATURES:

- Evidence-first analysis pipeline
- Strict confidence thresholds (≥85% confirmed, 70-84% possible, <70% rejected)
- Maximum 1 primary + 2 secondary pollution types
- Negative evidence tracking (rejectedCategories)
- Category-specific detection rules
- No fabricated measurements
- Server-side validation
- Returns "pollutionDetected: false" when no clear pollution visible
- Dynamic environmental impact (only relevant categories)
*/
