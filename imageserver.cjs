
// ============================================================
// ECONEX NOVA - IMAGE SERVER
// Environmental Image Intelligence API
// ============================================================

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

const ROOT_DIR = __dirname;
const UPLOAD_DIR = path.join(ROOT_DIR, ".econex-uploads");

// ------------------------------------------------------------
// CREATE UPLOAD DIRECTORY
// ------------------------------------------------------------

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ------------------------------------------------------------
// MIDDLEWARE
// ------------------------------------------------------------

app.use(cors());

app.use(express.json({ limit: "20mb" }));

app.use(express.urlencoded({
    extended: true,
    limit: "20mb"
}));

// ------------------------------------------------------------
// STATIC WEBSITE
// THIS FIXES: Cannot GET /image.html
// ------------------------------------------------------------

app.use(express.static(ROOT_DIR, {
    index: false
}));

// ------------------------------------------------------------
// MULTER
// ------------------------------------------------------------

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_DIR);
    },

    filename: function (req, file, cb) {
        const safeName =
            `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 10)}${path.extname(file.originalname).toLowerCase()}`;

        cb(null, safeName);
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {

        const allowed = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (!allowed.includes(file.mimetype)) {
            return cb(
                new Error(
                    "Unsupported image format. Please use JPG, JPEG, PNG or WEBP."
                )
            );
        }

        cb(null, true);
    }
});

// ------------------------------------------------------------
// CLEANUP
// ------------------------------------------------------------

function deleteUploadedFile(file) {

    if (!file || !file.path) {
        return;
    }

    try {

        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

    } catch (error) {

        console.warn(
            "Could not delete temporary upload:",
            error.message
        );

    }
}

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );
}

function roundNumber(value) {

    return Math.round(
        Number(value) || 0
    );
}

function createObject(
    name,
    material,
    quantity,
    quantityConfidence,
    estimatedWeightGrams,
    weightConfidence,
    biodegradable,
    recyclable,
    recyclabilityScore,
    environmentalImpact,
    recyclingMethod
) {

    return {
        name,
        material,

        quantity,
        quantityConfidence,

        estimatedWeightGrams,
        weightConfidence,

        biodegradable,
        recyclable,

        recyclabilityScore,

        environmentalImpact,

        recyclingMethod
    };
}

// ------------------------------------------------------------
// HEALTH
// ------------------------------------------------------------

app.get("/api/health", (req, res) => {

    res.json({

        ok: true,

        service:
            "ECONEX NOVA Image Server",

        version:
            "1.0.0",

        status:
            "running",

        mode:
            "DEVELOPMENT",

        endpoints: {

            verify:
                "POST /api/image/verify",

            waste:
                "POST /api/waste/analyze",

            pollution:
                "POST /api/pollution/analyze"

        }

    });

});

// ------------------------------------------------------------
// ROOT
// ------------------------------------------------------------

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            ROOT_DIR,
            "image.html"
        )
    );

});

// ------------------------------------------------------------
// IMAGE.HTML
// ------------------------------------------------------------

app.get("/image.html", (req, res) => {

    res.sendFile(
        path.join(
            ROOT_DIR,
            "image.html"
        )
    );

});

// ------------------------------------------------------------
// IMAGE VERIFY
//
// IMPORTANT:
// This is a DEVELOPMENT fallback.
// It does NOT falsely claim that an image is AI-generated.
// A real authenticity model can be connected later.
// ------------------------------------------------------------

app.post(
    "/api/image/verify",
    upload.single("image"),
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please upload an image."

                });

            }

            // ------------------------------------------------
            // DEVELOPMENT MODE
            // ------------------------------------------------

            const result = {

                success: true,

                imageType:
                    "uncertain",

                confidence:
                    51,

                accepted:
                    false,

                message:
                    "Image authenticity could not be verified confidently. Please use a clear original environmental photo.",

                isDevelopmentMode:
                    true,

                demo:
                    true,

                note:
                    "Real AI-generated-image detection is not configured yet."

            };

            deleteUploadedFile(req.file);

            return res.json(result);

        } catch (error) {

            deleteUploadedFile(req.file);

            console.error(
                "IMAGE VERIFY ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                error:
                    error.message ||
                    "Image verification failed."

            });

        }

    }
);

// ------------------------------------------------------------
// WASTE ANALYSIS
//
// DEVELOPMENT FALLBACK
// ------------------------------------------------------------

app.post(
    "/api/waste/analyze",
    upload.single("image"),
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please upload an image."

                });

            }

            // ------------------------------------------------
            // DEMO WASTE OBJECT
            // ------------------------------------------------

            const wasteObject = createObject(

                "Plastic bottle",

                "PET",

                3,

                78,

                75,

                55,

                false,

                true,

                88,

                "Plastic waste can persist in the environment for a long time and may contribute to litter, microplastic formation and harm to wildlife if improperly discarded.",

                "Empty the bottle, remove contamination where practical, and place it in an appropriate recyclable plastic collection stream."
            );

            const objects = [
                wasteObject
            ];

            // ------------------------------------------------
            // CALCULATE GREEN IMPACT SCORE
            // ------------------------------------------------

            let greenImpactScore = 82;

            if (objects.length === 0) {
                greenImpactScore = 0;
            }

            greenImpactScore =
                clamp(
                    greenImpactScore,
                    0,
                    100
                );

            // ------------------------------------------------
            // ACTION PLAN
            // ------------------------------------------------

            const actionPlan = [

                "Separate the detected waste from general waste.",

                "Clean recyclable material when practical.",

                "Keep plastic, metal, glass and paper streams separated.",

                "Send recyclable material to an authorized recycling or collection facility.",

                "Avoid burning or dumping waste in open areas.",

                "Reduce single-use materials where practical."

            ];

            const totalEstimatedWeightGrams =
                objects.reduce(
                    (total, item) =>
                        total +
                        Number(
                            item.estimatedWeightGrams || 0
                        ),
                    0
                );

            // ------------------------------------------------
            // RESPONSE
            // ------------------------------------------------

            const result = {

                success: true,

                analysisType:
                    "waste",

                isDevelopmentMode:
                    true,

                demo:
                    true,

                objects,

                totalObjects:
                    objects.length,

                totalEstimatedWeightGrams:
                    roundNumber(
                        totalEstimatedWeightGrams
                    ),

                greenImpactScore,

                impactExplanation:
                    "The image appears to contain recyclable plastic waste. Correct separation and recycling can reduce litter and help recover useful material.",

                environmentalImpact:
                    "Improperly discarded waste can contribute to land and water pollution and may affect wildlife and ecosystems.",

                actionPlan,

                summary:
                    "Potential recyclable waste detected.",

                disclaimer:
                    "Object quantity and weight are estimates for demonstration purposes only. They are not physical measurements."

            };

            deleteUploadedFile(req.file);

            return res.json(result);

        } catch (error) {

            deleteUploadedFile(req.file);

            console.error(
                "WASTE ANALYSIS ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                error:
                    error.message ||
                    "Waste analysis failed."

            });

        }

    }
);

// ------------------------------------------------------------
// POLLUTION ANALYSIS
//
// DEVELOPMENT FALLBACK
// ------------------------------------------------------------

app.post(
    "/api/pollution/analyze",
    upload.single("image"),
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Please upload an image."

                });

            }

            const result = {

                success: true,

                analysisType:
                    "pollution",

                isDevelopmentMode:
                    true,

                demo:
                    true,

                pollutionType:
                    "Plastic Pollution",

                severity:
                    "Moderate",

                severityScore:
                    62,

                confidence:
                    67,

                detectedEvidence: [

                    "Visible plastic waste",

                    "Improperly discarded material",

                    "Potential litter accumulation"

                ],

                environmentalImpact:
                    "Plastic pollution can persist for long periods and can enter drainage systems, waterways and surrounding ecosystems.",

                urgency:
                    "Action is recommended to prevent further accumulation and environmental spread.",

                recommendedActions: [

                    "Remove and separate visible recyclable material.",

                    "Keep waste away from drains and waterways.",

                    "Send recyclable plastic to an authorized collection facility.",

                    "Avoid open burning of waste.",

                    "Report serious dumping or contamination to the appropriate local authority."

                ],

                greenImpactScore:
                    58,

                impactExplanation:
                    "Reducing visible plastic pollution and sending recoverable material into proper recycling streams can reduce environmental pressure.",

                disclaimer:
                    "Pollution classification is a development/demo result and should not be treated as a scientific environmental assessment."

            };

            deleteUploadedFile(req.file);

            return res.json(result);

        } catch (error) {

            deleteUploadedFile(req.file);

            console.error(
                "POLLUTION ANALYSIS ERROR:",
                error
            );

            return res.status(500).json({

                success: false,

                error:
                    error.message ||
                    "Pollution analysis failed."

            });

        }

    }
);

// ------------------------------------------------------------
// 404 API HANDLER
// ------------------------------------------------------------

app.use(
    "/api",
    (req, res) => {

        res.status(404).json({

            success: false,

            error:
                "API endpoint not found.",

            path:
                req.originalUrl

        });

    }
);

// ------------------------------------------------------------
// ERROR HANDLER
// ------------------------------------------------------------

app.use(
    (error, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            error
        );

        if (
            error instanceof multer.MulterError
        ) {

            if (
                error.code === "LIMIT_FILE_SIZE"
            ) {

                return res.status(400).json({

                    success: false,

                    error:
                        "Image is too large. Maximum size is 10 MB."

                });

            }

            return res.status(400).json({

                success: false,

                error:
                    error.message

            });

        }

        return res.status(500).json({

            success: false,

            error:
                error.message ||
                "Internal server error."

        });

    }
);

// ------------------------------------------------------------
// START SERVER
// ------------------------------------------------------------

app.listen(
    PORT,
    HOST,
    () => {

        console.log("");
        console.log("==============================================");
        console.log("        ECONEX NOVA IMAGE SERVER");
        console.log("==============================================");
        console.log(
            `Server : http://localhost:${PORT}`
        );
        console.log(
            `Page   : http://localhost:${PORT}/image.html`
        );
        console.log(
            `Health : http://localhost:${PORT}/api/health`
        );
        console.log("");
        console.log("API:");
        console.log(
            "POST /api/image/verify"
        );
        console.log(
            "POST /api/waste/analyze"
        );
        console.log(
            "POST /api/pollution/analyze"
        );
        console.log("");
        console.log("Mode   : DEVELOPMENT");
        console.log("Status : RUNNING");
        console.log("==============================================");
        console.log("");

    }
);