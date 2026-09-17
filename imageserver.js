import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = Number(process.env.PORT || 3000);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

const openai = OPENAI_API_KEY
    ? new OpenAI({ apiKey: OPENAI_API_KEY })
    : null;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

/* =========================================================
   FILE UPLOAD CONFIGURATION
========================================================= */

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Unsupported file type. Only JPG, JPEG, and PNG are allowed."
                )
            );
        }
    }
});

/* =========================================================
   IMAGE VERIFICATION PROVIDER
========================================================= */

/**
 * AI Image Authenticity Provider
 *
 * DEVELOPMENT MODE:
 * Currently using a development fallback.
 *
 * To integrate a real AI detector:
 * 1. Replace verifyImageAuthenticity with actual API calls
 * 2. Options:
 *    - Hive Moderation API
 *    - Custom ML model
 *    - AWS Rekognition Custom Labels (trained)
 *    - Clarifai AI Detection
 */

async function verifyImageAuthenticity(imageBuffer, mimeType) {
    // DEVELOPMENT MODE
    // This is a placeholder implementation

    // In development, we analyze basic image characteristics
    // Real implementation would call an AI detection service

    const isDevelopmentMode = !process.env.AI_DETECTOR_API_KEY;

    if (isDevelopmentMode) {
        // Development fallback: random classification for demo
        // NEVER use this in production

        const random = Math.random();

        if (random < 0.6) {
            // Most images classified as original in dev mode
            return {
                imageType: "original",
                confidence: Math.floor(85 + Math.random() * 10),
                accepted: true,
                message: "Original photo accepted.",
                isDevelopmentMode: true
            };
        } else if (random < 0.8) {
            return {
                imageType: "uncertain",
                confidence: Math.floor(45 + Math.random() * 15),
                accepted: false,
                message: "The image could not be verified confidently. Please upload a clear original environmental photo.",
                isDevelopmentMode: true
            };
        } else {
            return {
                imageType: "ai_generated",
                confidence: Math.floor(80 + Math.random() * 15),
                accepted: false,
                message: "AI-generated image detected. Please upload an original environmental photo.",
                isDevelopmentMode: true
            };
        }
    }

    // PRODUCTION MODE (placeholder)
    // Integrate real AI detector here

    throw new Error("Production AI detector not configured");
}

/* =========================================================
   WASTE ANALYSIS PROVIDER
========================================================= */

async function analyzeWasteWithAI(imageBuffer, mimeType) {
    if (!openai) {
        // Development fallback
        return {
            objects: [
                {
                    name: "Plastic bottle",
                    material: "PET",
                    quantity: 2,
                    quantityConfidence: 88,
                    estimatedWeightGrams: 60,
                    weightConfidence: 62,
                    biodegradable: false,
                    recyclable: true,
                    recyclabilityScore: 92,
                    environmentalImpact: "PET plastic can persist in the environment for hundreds of years if not recycled properly.",
                    recyclingMethod: "Clean and separate PET bottles, then deposit at recycling collection points. Check for recycling symbol #1."
                },
                {
                    name: "Aluminium can",
                    material: "Aluminium",
                    quantity: 1,
                    quantityConfidence: 94,
                    estimatedWeightGrams: 15,
                    weightConfidence: 70,
                    biodegradable: false,
                    recyclable: true,
                    recyclabilityScore: 98,
                    environmentalImpact: "Aluminium mining has high environmental cost, but aluminium is infinitely recyclable.",
                    recyclingMethod: "Rinse and flatten cans. Recycling aluminium saves 95% of energy compared to producing new aluminium."
                }
            ],
            greenImpactScore: 85,
            impactExplanation: "The detected waste items are highly recyclable when properly sorted and cleaned.",
            actionPlan: [
                "Separate recyclable materials by type.",
                "Rinse containers to remove residue.",
                "Check local recycling guidelines for accepted materials.",
                "Drop off at designated recycling collection points."
            ],
            isDevelopmentMode: true
        };
    }

    // Real OpenAI Vision analysis
    const base64Image = imageBuffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    try {
        const response = await openai.chat.completions.create({
            model: OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: `You are an expert environmental waste analyzer. Analyze images and identify waste objects with their properties.

Return a JSON object with this exact structure:
{
  "objects": [
    {
      "name": "object name",
      "material": "one of: Plastic, PET, HDPE, Paper, Cardboard, Glass, Aluminium, Steel, Iron, Copper, E-Waste, Electronics, Battery, Textile, Wood, Food/Organic, Rubber, Mixed Waste, Hazardous Waste, Other, Unknown",
      "quantity": number,
      "quantityConfidence": 0-100,
      "estimatedWeightGrams": number (ESTIMATED weight, not measured),
      "weightConfidence": 0-100,
      "biodegradable": boolean,
      "recyclable": boolean,
      "recyclabilityScore": 0-100,
      "environmentalImpact": "brief impact description",
      "recyclingMethod": "how to recycle or dispose properly"
    }
  ],
  "greenImpactScore": 0-100,
  "impactExplanation": "overall environmental impact summary",
  "actionPlan": ["step 1", "step 2", "step 3"]
}

Return ONLY valid JSON. No markdown, no code blocks, no explanations.`
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Analyze this image for environmental waste. Identify all waste objects and provide detailed recycling information."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: dataUrl
                            }
                        }
                    ]
                }
            ],
            max_tokens: 2000,
            temperature: 0.3
        });

        const content = response.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No response from AI");
        }

        const result = JSON.parse(content);
        result.isDevelopmentMode = false;

        return result;
    } catch (error) {
        console.error("Waste analysis error:", error.message);

        // Fallback to development mode on error
        return {
            objects: [
                {
                    name: "Unidentified waste",
                    material: "Unknown",
                    quantity: 1,
                    quantityConfidence: 40,
                    estimatedWeightGrams: 100,
                    weightConfidence: 30,
                    biodegradable: false,
                    recyclable: false,
                    recyclabilityScore: 0,
                    environmentalImpact: "Unable to determine specific environmental impact.",
                    recyclingMethod: "Consult local waste management guidelines."
                }
            ],
            greenImpactScore: 50,
            impactExplanation: "Analysis unavailable. Please try again with a clearer image.",
            actionPlan: [
                "Separate waste by type.",
                "Consult local waste management guidelines."
            ],
            isDevelopmentMode: true,
            error: error.message
        };
    }
}

/* =========================================================
   POLLUTION ANALYSIS PROVIDER
========================================================= */

async function analyzePollutionWithAI(imageBuffer, mimeType) {
    if (!openai) {
        // Development fallback
        return {
            pollutionType: "Plastic Pollution",
            severity: "Moderate",
            severityScore: 62,
            detectedEvidence: [
                "Scattered plastic waste",
                "Non-biodegradable materials",
                "Visible environmental contamination"
            ],
            environmentalImpact: "Plastic pollution can harm wildlife and contaminate ecosystems. Microplastics can enter food chains.",
            recommendedActions: [
                "Organize community cleanup event",
                "Report to local environmental authorities",
                "Set up waste collection infrastructure",
                "Educate community about proper waste disposal"
            ],
            urgency: "Medium",
            isDevelopmentMode: true
        };
    }

    // Real OpenAI Vision analysis
    const base64Image = imageBuffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    try {
        const response = await openai.chat.completions.create({
            model: OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: `You are an expert environmental pollution analyst. Analyze images and identify pollution with detailed assessment.

Pollution categories: Air Pollution, Water Pollution, Plastic Pollution, Land Pollution, Garbage Dumping, Smoke, Industrial Pollution, Oil Contamination, Sewage, Waste Burning, Littering, Other

Return a JSON object with this exact structure:
{
  "pollutionType": "primary pollution category",
  "severity": "one of: Low, Moderate, High, Severe, Critical",
  "severityScore": 0-100,
  "detectedEvidence": ["evidence 1", "evidence 2"],
  "environmentalImpact": "detailed impact description",
  "recommendedActions": ["action 1", "action 2", "action 3"],
  "urgency": "one of: Low, Medium, High, Critical"
}

Return ONLY valid JSON. No markdown, no code blocks, no explanations.`
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Analyze this image for environmental pollution. Identify pollution type, severity, and provide actionable recommendations."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: dataUrl
                            }
                        }
                    ]
                }
            ],
            max_tokens: 1500,
            temperature: 0.3
        });

        const content = response.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No response from AI");
        }

        const result = JSON.parse(content);
        result.isDevelopmentMode = false;

        return result;
    } catch (error) {
        console.error("Pollution analysis error:", error.message);

        // Fallback to development mode on error
        return {
            pollutionType: "Unknown Pollution",
            severity: "Unknown",
            severityScore: 50,
            detectedEvidence: ["Unable to analyze"],
            environmentalImpact: "Analysis unavailable. Please try again with a clearer image.",
            recommendedActions: [
                "Contact local environmental authorities",
                "Document the pollution",
                "Avoid direct contact"
            ],
            urgency: "Unknown",
            isDevelopmentMode: true,
            error: error.message
        };
    }
}

/* =========================================================
   HEALTH ENDPOINT
========================================================= */

app.get(
    "/api/health",
    (req, res) => {
        res.json({
            ok: true,
            service: "ECONEX NOVA Image Server",
            version: "1.0.0",
            aiConfigured: Boolean(openai),
            endpoints: {
                verify: "POST /api/image/verify",
                waste: "POST /api/waste/analyze",
                pollution: "POST /api/pollution/analyze"
            }
        });
    }
);

/* =========================================================
   IMAGE VERIFICATION ENDPOINT
========================================================= */

app.post(
    "/api/image/verify",
    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: "No image file provided."
                });
            }

            const { buffer, mimetype, size } = req.file;

            // Double-check file size (multer should catch this, but be safe)
            if (size > 10 * 1024 * 1024) {
                return res.status(400).json({
                    success: false,
                    error: "File size exceeds 10 MB limit."
                });
            }

            // Verify image
            const result = await verifyImageAuthenticity(buffer, mimetype);

            res.json({
                success: true,
                ...result
            });

        } catch (error) {
            console.error("Verification error:", error.message);

            res.status(500).json({
                success: false,
                error: error.message || "Image verification failed."
            });
        }
    }
);

/* =========================================================
   WASTE ANALYSIS ENDPOINT
========================================================= */

app.post(
    "/api/waste/analyze",
    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: "No image file provided."
                });
            }

            const { buffer, mimetype, size } = req.file;

            if (size > 10 * 1024 * 1024) {
                return res.status(400).json({
                    success: false,
                    error: "File size exceeds 10 MB limit."
                });
            }

            // Analyze waste
            const result = await analyzeWasteWithAI(buffer, mimetype);

            res.json({
                success: true,
                ...result
            });

        } catch (error) {
            console.error("Waste analysis error:", error.message);

            res.status(500).json({
                success: false,
                error: error.message || "Waste analysis failed."
            });
        }
    }
);

/* =========================================================
   POLLUTION ANALYSIS ENDPOINT
========================================================= */

app.post(
    "/api/pollution/analyze",
    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: "No image file provided."
                });
            }

            const { buffer, mimetype, size } = req.file;

            if (size > 10 * 1024 * 1024) {
                return res.status(400).json({
                    success: false,
                    error: "File size exceeds 10 MB limit."
                });
            }

            // Analyze pollution
            const result = await analyzePollutionWithAI(buffer, mimetype);

            res.json({
                success: true,
                ...result
            });

        } catch (error) {
            console.error("Pollution analysis error:", error.message);

            res.status(500).json({
                success: false,
                error: error.message || "Pollution analysis failed."
            });
        }
    }
);

/* =========================================================
   ERROR HANDLING
========================================================= */

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                error: "File size exceeds 10 MB limit."
            });
        }

        return res.status(400).json({
            success: false,
            error: error.message
        });
    }

    if (error.message) {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }

    res.status(500).json({
        success: false,
        error: "Internal server error."
    });
});

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {
    console.log(`✓ ECONEX NOVA Image Server running`);
    console.log(`✓ Port: ${PORT}`);
    console.log(`✓ Health: http://localhost:${PORT}/api/health`);
    console.log(`✓ AI: ${openai ? "OpenAI configured" : "Development mode"}`);
});
