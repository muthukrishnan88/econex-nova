import { logger } from "../../utils/logger.js";

export class MockAIProvider {
    constructor() {
        this.name = "Mock AI Provider";
        this.scenarioIndex = 0; // Track which scenario to return
        logger.info("Mock AI Provider initialized (Development Mode)");
    }

    async verifyImageAuthenticity(imageBuffer, mimeType) {
        await this._simulateDelay();

        const fileSize = imageBuffer.length;
        const sizeKB = Math.round(fileSize / 1024);

        if (fileSize < 10000) {
            return {
                imageType: "uncertain",
                confidence: 45,
                accepted: false,
                message: "Image quality too low for reliable analysis. Please upload a clear, high-resolution original photo.",
                isDevelopmentMode: true
            };
        }

        const random = Math.random();

        if (random < 0.15) {
            return {
                imageType: "ai_generated",
                confidence: Math.floor(82 + Math.random() * 15),
                accepted: false,
                message: "AI-generated image detected. This platform requires original environmental photographs for accurate analysis.",
                isDevelopmentMode: true,
                reason: "Image exhibits patterns consistent with AI generation techniques. Environmental analysis requires authentic field photography."
            };
        }

        if (random < 0.25) {
            return {
                imageType: "uncertain",
                confidence: Math.floor(48 + Math.random() * 15),
                accepted: true,
                message: "Image authenticity could not be verified with high confidence. Proceeding with analysis in development mode.",
                isDevelopmentMode: true
            };
        }

        return {
            imageType: "original",
            confidence: Math.floor(86 + Math.random() * 12),
            accepted: true,
            message: "Original photo accepted for environmental analysis.",
            isDevelopmentMode: true,
            imageInfo: {
                sizeKB,
                format: mimeType
            }
        };
    }

    async analyzeWaste(imageBuffer, mimeType) {
        await this._simulateDelay();

        const scenarios = this._getWasteScenarios();
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        const totalObjects = scenario.objects.length;
        const totalWeight = scenario.objects.reduce((sum, obj) => sum + (obj.weight.estimatedGrams || 0), 0);
        const minWeight = Math.floor(totalWeight * 0.75);
        const maxWeight = Math.floor(totalWeight * 1.35);

        const materialCounts = {};
        scenario.objects.forEach(obj => {
            const baseMaterial = obj.material;
            materialCounts[baseMaterial] = (materialCounts[baseMaterial] || 0) + 1;
        });

        const materialBreakdown = Object.entries(materialCounts).map(([material, count]) => ({
            material,
            count,
            percentage: Math.round((count / totalObjects) * 100)
        })).sort((a, b) => b.count - a.count);

        const imageQuality = {
            score: 75 + Math.floor(Math.random() * 20),
            status: "good",
            resolution: "adequate",
            lighting: "sufficient",
            clarity: "clear"
        };

        return {
            success: true,
            analysisMode: "AI",
            imageQuality,
            summary: {
                totalObjects,
                estimatedTotalWeightGrams: totalWeight,
                estimatedWeightRange: {
                    minGrams: minWeight,
                    maxGrams: maxWeight
                }
            },
            objects: scenario.objects,
            materialBreakdown,
            greenImpactScore: scenario.greenImpactScore,
            impactExplanation: scenario.impactExplanation,
            actionPlan: scenario.actionPlan,
            limitations: [
                "Weight is visually estimated from image analysis.",
                "Object detection confidence depends on image quality and object visibility.",
                "Recycling availability and requirements vary by location.",
                "Environmental impact scores are AI-generated indicators, not scientific measurements."
            ],
            isDevelopmentMode: true,
            demo: true,
            note: "Development Mode: This is simulated analysis. Connect AWS Bedrock or another vision AI provider for real image analysis."
        };
    }

    async analyzePollution(imageBuffer, mimeType) {
        await this._simulateDelay();

        // Evidence-first simulation
        // In real use, this would analyze actual image content
        // For demo, we intelligently select scenarios or return "no pollution detected"

        const authenticity = this._generateAuthenticity();
        const imageQuality = 85; // Fixed quality for deterministic demo

        // For predictable demo: Always return pollution (no random "not detected")
        // 20% chance: No clear pollution detected (demonstrates precision)
        if (false && Math.random() < 0.2) {
            return {
                success: true,
                analysisMode: "AI",
                authenticity,
                scene: {
                    description: "Environmental scene observed. No significant pollution indicators detected with sufficient confidence.",
                    imageQuality
                },
                pollutionDetected: false,
                reason: "No sufficient visual evidence of pollution event. Image shows environment but lacks clear pollution indicators that meet detection confidence threshold (≥85%).",
                rejectedCategories: [
                    {
                        type: "air_pollution",
                        reason: "No visible smoke, emissions, or atmospheric pollution indicators detected."
                    },
                    {
                        type: "water_pollution",
                        reason: "No contaminated water bodies, discharge, or water pollution evidence visible."
                    },
                    {
                        type: "land_pollution",
                        reason: "No significant waste accumulation, dumping, or land contamination detected."
                    },
                    {
                        type: "plastic_pollution",
                        reason: "No concentrated plastic waste or pollution accumulation visible."
                    },
                    {
                        type: "oil_contamination",
                        reason: "No oil spills, sheens, or petroleum contamination detected."
                    },
                    {
                        type: "industrial_pollution",
                        reason: "No industrial emission sources or industrial pollution evidence visible."
                    }
                ],
                recommendation: "If pollution is present but not detected, try:\n• Closer image of pollution source\n• Better lighting conditions\n• Higher resolution photo\n• Image showing pollution indicators more clearly",
                measurement: {
                    available: false,
                    message: "Pollutant concentrations cannot be measured from this image alone."
                },
                limitations: [
                    "Image analysis cannot detect all pollution types in all conditions.",
                    "Detection confidence depends on image quality, lighting, and visibility of pollution indicators.",
                    "Absence of detection does not guarantee absence of pollution - only that clear visual evidence was not found."
                ],
                isDevelopmentMode: true,
                demo: true,
                note: "Development Mode: Evidence-first demonstration. This simulates how the AI would respond when no clear pollution is detected. Real AI vision analysis would examine actual image content."
            };
        }

        // Return scenario in predictable order (cycles through scenarios)
        const scenarios = this._getPollutionScenarios();
        const scenario = scenarios[this.scenarioIndex % scenarios.length];
        this.scenarioIndex++; // Next upload gets next scenario

        const scene = {
            description: scenario.sceneDescription || "Environmental scene with visible pollution indicators.",
            imageQuality
        };

        // Build response with OLD structure (for compatibility with current frontend)
        return {
            success: true,
            analysisMode: "AI",
            authenticity,
            scene,

            // OLD structure that frontend expects
            pollution: {
                primaryType: scenario.pollution.primaryType,
                primarySubtype: scenario.pollution.primarySubtype,
                confidence: scenario.pollution.confidence,
                secondaryTypes: scenario.pollution.secondaryTypes,
                visualEvidence: scenario.pollution.visualEvidence,
                likelySources: scenario.pollution.likelySources,
                potentialPollutants: scenario.pollution.potentialPollutants,
                concernScore: scenario.pollution.concernScore,
                concernLevel: scenario.pollution.concernLevel
            },

            // Health impact
            healthImpact: scenario.healthImpact,

            // Environmental impact
            environmentalImpact: scenario.environmentalImpact,

            // Pathway
            pollutionPathway: scenario.pollutionPathway,

            // Actions
            reductionPlan: scenario.reductionPlan,
            preventionPlan: scenario.preventionPlan,
            actionPriority: scenario.actionPriority,

            // Measurement
            measurement: {
                available: false,
                message: "Pollutant concentrations cannot be measured from this image alone. Connect a compatible air-quality sensor or API for real-time measurements."
            },

            // Limitations
            limitations: [
                "Image analysis cannot directly measure pollutant concentration.",
                "Source attribution may be uncertain without additional context.",
                "Actual health and environmental risk depends on pollutant concentration, exposure duration, and local conditions.",
                "Visual evidence may not capture all pollution sources in the area."
            ],

            isDevelopmentMode: true,
            demo: true,
            note: "Development Mode: Evidence-first demonstration using scenario-based pollution detection. Real AI vision analysis would examine actual image content and return only pollution types with sufficient visual evidence (≥85% confidence)."
        };
    }


    _generateAuthenticity() {
        const random = Math.random();

        if (random < 0.75) {
            return {
                classification: "original_likely",
                confidence: 85 + Math.floor(Math.random() * 12),
                aiGeneratedLikelihood: Math.floor(Math.random() * 10),
                manipulationLikelihood: Math.floor(Math.random() * 15),
                provenance: "not_available",
                message: "Image appears to be an original photograph. Metadata not available for verification."
            };
        } else if (random < 0.85) {
            return {
                classification: "uncertain",
                confidence: 45 + Math.floor(Math.random() * 20),
                aiGeneratedLikelihood: 30 + Math.floor(Math.random() * 25),
                manipulationLikelihood: 25 + Math.floor(Math.random() * 20),
                provenance: "not_available",
                message: "Image authenticity could not be determined with high confidence. Proceeding with visual analysis."
            };
        } else {
            return {
                classification: "ai_generated_or_manipulated",
                confidence: 70 + Math.floor(Math.random() * 20),
                aiGeneratedLikelihood: 65 + Math.floor(Math.random() * 25),
                manipulationLikelihood: 55 + Math.floor(Math.random() * 30),
                provenance: "not_available",
                message: "Image shows indicators consistent with AI generation or significant manipulation. Note: AI-generated images can still represent real-world concepts, but origin verification is not possible."
            };
        }
    }

    _getWasteScenarios() {
        return [
            // Scenario 1: Mixed household waste
            {
                objects: [
                    {
                        name: "Plastic Bottle",
                        material: "Plastic",
                        subtype: "PET",
                        quantity: 3,
                        detectionConfidence: 95,
                        weight: {
                            estimatedGrams: 75,
                            minGrams: 55,
                            maxGrams: 100,
                            confidence: 70
                        },
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 85,
                        environmentalRisk: "Medium",
                        environmentalImpact: "PET plastic persists for centuries in the environment. Breaks down into microplastics that contaminate ecosystems and food chains. However, PET is highly recyclable when properly collected.",
                        recyclingMethod: "Empty completely, rinse, remove cap, flatten, and place in PET/plastic recycling bin (look for #1 symbol).",
                        reuseIdeas: [
                            "Refill for water storage in gardening",
                            "Cut and use as DIY planters",
                            "Use for craft projects or organizers"
                        ],
                        disposalMethod: "If recycling unavailable, dispose in general waste. Never burn or dump in waterways.",
                        recommendedAction: "Separate, rinse, and recycle through appropriate PET collection program."
                    },
                    {
                        name: "Aluminium Can",
                        material: "Metal",
                        subtype: "Aluminium",
                        quantity: 2,
                        detectionConfidence: 91,
                        weight: {
                            estimatedGrams: 28,
                            minGrams: 22,
                            maxGrams: 35,
                            confidence: 75
                        },
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 98,
                        environmentalRisk: "Low",
                        environmentalImpact: "Aluminium is infinitely recyclable. Recycling saves 95% energy vs virgin production. Can be recycled and back on shelf within 60 days.",
                        recyclingMethod: "Empty, rinse, crush if desired, place in metal recycling. Leave tab attached.",
                        reuseIdeas: [
                            "Small planters with drainage",
                            "DIY candle holders",
                            "Storage for small items"
                        ],
                        disposalMethod: "Aluminium has high scrap value—recycling almost always available.",
                        recommendedAction: "Rinse and place in metal recycling for maximum resource recovery."
                    },
                    {
                        name: "Cardboard Box",
                        material: "Paper",
                        subtype: "Corrugated Cardboard",
                        quantity: 1,
                        detectionConfidence: 88,
                        weight: {
                            estimatedGrams: 320,
                            minGrams: 250,
                            maxGrams: 400,
                            confidence: 65
                        },
                        biodegradable: true,
                        recyclable: true,
                        recyclabilityScore: 94,
                        environmentalRisk: "Low",
                        environmentalImpact: "Cardboard production uses trees and water. Recycling reduces deforestation and saves energy. Landfilled cardboard produces methane.",
                        recyclingMethod: "Remove tape and labels, flatten completely, keep dry, place in paper recycling.",
                        reuseIdeas: [
                            "Storage boxes for organizing",
                            "DIY furniture or cat houses",
                            "Composting material (shredded)",
                            "Protective packaging for shipping"
                        ],
                        disposalMethod: "Compost if shredded, or dispose in general waste if contaminated.",
                        recommendedAction: "Flatten and recycle—cardboard can be recycled 5-7 times."
                    },
                    {
                        name: "Food Waste",
                        material: "Organic",
                        subtype: "Mixed Food Scraps",
                        quantity: 1,
                        detectionConfidence: 84,
                        weight: {
                            estimatedGrams: 450,
                            minGrams: 300,
                            maxGrams: 620,
                            confidence: 55
                        },
                        biodegradable: true,
                        recyclable: false,
                        recyclabilityScore: 0,
                        environmentalRisk: "Medium",
                        environmentalImpact: "Food waste in landfills generates methane (28-34x more potent than CO2). Represents wasted water, energy, and resources used in production.",
                        recyclingMethod: "Food should be composted, not recycled. Separate from all packaging.",
                        reuseIdeas: [
                            "Home compost for garden soil amendment",
                            "Vermicomposting with worms",
                            "Animal feed where appropriate"
                        ],
                        disposalMethod: "Compost in home system or municipal organics program. If unavailable, dispose in general waste.",
                        recommendedAction: "Separate and compost to prevent methane emissions and create nutrient-rich soil."
                    },
                    {
                        name: "Plastic Bag",
                        material: "Plastic",
                        subtype: "LDPE",
                        quantity: 5,
                        detectionConfidence: 76,
                        weight: {
                            estimatedGrams: 35,
                            minGrams: 25,
                            maxGrams: 50,
                            confidence: 58
                        },
                        biodegradable: false,
                        recyclable: false,
                        recyclabilityScore: 22,
                        environmentalRisk: "High",
                        environmentalImpact: "Plastic bags cause severe environmental damage. They clog drainage systems, harm marine life, break down into microplastics, and persist for decades.",
                        recyclingMethod: "Most curbside programs don't accept. Check if local grocery stores have plastic film collection bins.",
                        reuseIdeas: [
                            "Reuse for shopping multiple times",
                            "Use as trash can liners",
                            "Packing material when moving"
                        ],
                        disposalMethod: "Return to store collection if available, otherwise general waste. Switch to reusable bags.",
                        recommendedAction: "Reuse multiple times, return to store collection, or switch to reusable cloth bags."
                    },
                    {
                        name: "Glass Jar",
                        material: "Glass",
                        subtype: "Clear Glass",
                        quantity: 2,
                        detectionConfidence: 89,
                        weight: {
                            estimatedGrams: 420,
                            minGrams: 350,
                            maxGrams: 500,
                            confidence: 68
                        },
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 97,
                        environmentalRisk: "Low",
                        environmentalImpact: "Glass is inert and doesn't leach chemicals, but persists indefinitely. Glass can be recycled infinitely without quality degradation.",
                        recyclingMethod: "Remove lids, rinse, labels usually don't need removal, place in glass recycling.",
                        reuseIdeas: [
                            "Storage for dry goods or leftovers",
                            "DIY candle holders",
                            "Vases for flowers",
                            "Drinking glasses"
                        ],
                        disposalMethod: "If recycling unavailable, dispose carefully in general waste.",
                        recommendedAction: "Rinse and recycle—glass recycling is infinitely sustainable."
                    },
                    {
                        name: "Paper",
                        material: "Paper",
                        subtype: "Mixed Paper",
                        quantity: 8,
                        detectionConfidence: 82,
                        weight: {
                            estimatedGrams: 120,
                            minGrams: 90,
                            maxGrams: 160,
                            confidence: 62
                        },
                        biodegradable: true,
                        recyclable: true,
                        recyclabilityScore: 88,
                        environmentalRisk: "Low",
                        environmentalImpact: "Paper production consumes trees and water. Recycling reduces deforestation and saves energy. One ton of recycled paper saves approximately 17 trees.",
                        recyclingMethod: "Remove staples and paper clips, keep dry, place in paper recycling.",
                        reuseIdeas: [
                            "Use blank side for notes or printing",
                            "Shred for packing material",
                            "Composting material",
                            "Craft projects"
                        ],
                        disposalMethod: "Compost if shredded, or dispose in general waste if contaminated.",
                        recommendedAction: "Keep dry and recycle—paper can be recycled 5-7 times."
                    }
                ],
                greenImpactScore: 78,
                impactExplanation: "Mixed recyclable materials with good separation potential. Proper sorting enables high material recovery rates and significant environmental benefits.",
                actionPlan: [
                    "Separate recyclables immediately: plastic, metal, cardboard, glass, paper",
                    "Rinse all containers before recycling to prevent contamination",
                    "Compost food waste separately—never mix with recyclables",
                    "Flatten cardboard to save space and improve collection efficiency",
                    "Return plastic bags to store collection bins or switch to reusable",
                    "Keep paper materials dry until collection",
                    "Consider reducing single-use packaging purchases"
                ]
            },

            // Scenario 2: Electronic waste
            {
                objects: [
                    {
                        name: "Mobile Phone",
                        material: "E-Waste",
                        subtype: "Smartphone",
                        quantity: 1,
                        detectionConfidence: 89,
                        weight: {
                            estimatedGrams: 175,
                            minGrams: 140,
                            maxGrams: 220,
                            confidence: 62
                        },
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 72,
                        environmentalRisk: "High",
                        environmentalImpact: "Contains 40+ elements including gold, silver, copper, rare earths, plus hazardous materials (lithium, lead, mercury). Improper disposal leaches toxins into soil and water.",
                        recyclingMethod: "Factory reset to delete data, remove SIM/memory cards, use manufacturer trade-in or certified e-waste recycler.",
                        reuseIdeas: [
                            "Donate to charity if functional",
                            "Repurpose as dedicated music player or camera",
                            "Use for app testing or educational device"
                        ],
                        disposalMethod: "NEVER trash. Use certified e-waste recycling only.",
                        recommendedAction: "Wipe data, remove cards, and recycle through certified e-waste program."
                    },
                    {
                        name: "Battery",
                        material: "Hazardous Waste",
                        subtype: "Lithium-Ion",
                        quantity: 3,
                        detectionConfidence: 85,
                        weight: {
                            estimatedGrams: 85,
                            minGrams: 60,
                            maxGrams: 115,
                            confidence: 58
                        },
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 68,
                        environmentalRisk: "Critical",
                        environmentalImpact: "Contains heavy metals and corrosive materials. Landfilled batteries leak toxins contaminating groundwater. Lithium batteries cause fires at waste facilities.",
                        recyclingMethod: "Tape terminals to prevent short circuit. Take to retailer collection box or hazardous waste facility.",
                        reuseIdeas: [],
                        disposalMethod: "NEVER trash or incinerate. Use designated battery recycling only.",
                        recommendedAction: "Tape terminals and take to battery recycling collection point immediately."
                    },
                    {
                        name: "Charging Cable",
                        material: "E-Waste",
                        subtype: "USB Cable",
                        quantity: 4,
                        detectionConfidence: 79,
                        weight: {
                            estimatedGrams: 120,
                            minGrams: 90,
                            maxGrams: 160,
                            confidence: 65
                        },
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 78,
                        environmentalRisk: "Medium",
                        environmentalImpact: "Contains copper wire (valuable) wrapped in plastic insulation. Burning cables for copper releases toxic fumes.",
                        recyclingMethod: "Bundle together and include with e-waste recycling. Some retailers accept cables.",
                        reuseIdeas: [
                            "Donate functional cables to schools or charities",
                            "Keep as backup cables",
                            "Use for non-critical charging"
                        ],
                        disposalMethod: "Include with e-waste recycling or scrap metal collection.",
                        recommendedAction: "Bundle cables and recycle with e-waste for copper recovery."
                    },
                    {
                        name: "Electronic Device",
                        material: "E-Waste",
                        subtype: "Small Appliance",
                        quantity: 1,
                        detectionConfidence: 72,
                        weight: {
                            estimatedGrams: 520,
                            minGrams: 400,
                            maxGrams: 680,
                            confidence: 54
                        },
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 64,
                        environmentalRisk: "High",
                        environmentalImpact: "Contains circuit boards, metals, plastics, and sometimes hazardous components. Represents significant resource value but requires proper disassembly.",
                        recyclingMethod: "Remove batteries before recycling. Use e-waste recycling program.",
                        reuseIdeas: [
                            "Donate if functional",
                            "Repair instead of replacing",
                            "Repurpose components for DIY projects"
                        ],
                        disposalMethod: "NEVER place in regular trash. Use specialized e-waste facilities.",
                        recommendedAction: "Remove batteries and recycle through certified e-waste program."
                    }
                ],
                greenImpactScore: 54,
                impactExplanation: "E-waste and hazardous materials require specialized handling. High resource recovery potential but improper disposal creates severe environmental and health risks.",
                actionPlan: [
                    "Separate batteries immediately—tape terminals to prevent fire risk",
                    "Wipe personal data from all electronic devices before recycling",
                    "Locate certified e-waste recycling facility in your area",
                    "Bundle cables together for convenient collection",
                    "Never place e-waste in regular trash or recycling bins",
                    "Consider donating functional electronics instead of recycling",
                    "Check manufacturer take-back programs for specific devices"
                ]
            },

            // Scenario 3: Beverage containers
            {
                objects: [
                    {
                        name: "Glass Bottle",
                        material: "Glass",
                        subtype: "Clear Glass",
                        quantity: 4,
                        detectionConfidence: 93,
                        weight: {
                            estimatedGrams: 850,
                            minGrams: 700,
                            maxGrams: 1050,
                            confidence: 72
                        },
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 98,
                        environmentalRisk: "Low",
                        environmentalImpact: "Glass is inert and persists indefinitely. However, it's 100% recyclable without quality loss and can be recycled endlessly. Recycling saves raw materials and reduces energy by 30%.",
                        recyclingMethod: "Remove caps and lids, rinse clean, separate by color if required, place in glass recycling.",
                        reuseIdeas: [
                            "Reuse as water bottles or storage",
                            "Create decorative vases or candle holders",
                            "Use for homemade sauces or preserves"
                        ],
                        disposalMethod: "If recycling unavailable, dispose carefully in general waste.",
                        recommendedAction: "Rinse and recycle—glass recycling prevents mining for raw materials."
                    },
                    {
                        name: "Plastic Bottle Cap",
                        material: "Plastic",
                        subtype: "HDPE/PP",
                        quantity: 6,
                        detectionConfidence: 82,
                        weight: {
                            estimatedGrams: 45,
                            minGrams: 30,
                            maxGrams: 65,
                            confidence: 56
                        },
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 75,
                        environmentalRisk: "Medium",
                        environmentalImpact: "Bottle caps are often different plastic than bottles. Many facilities now accept caps left on bottles for easier processing.",
                        recyclingMethod: "Modern guidance: leave caps ON bottles when recycling. If removing, collect in larger container.",
                        reuseIdeas: [
                            "Collect for craft projects",
                            "Use as game pieces",
                            "Create mosaic art"
                        ],
                        disposalMethod: "Recycle with bottles or dispose in general waste.",
                        recommendedAction: "Leave caps on bottles for recycling—easier to capture and process."
                    },
                    {
                        name: "Steel Can",
                        material: "Metal",
                        subtype: "Steel",
                        quantity: 3,
                        detectionConfidence: 87,
                        weight: {
                            estimatedGrams: 185,
                            minGrams: 150,
                            maxGrams: 230,
                            confidence: 68
                        },
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 96,
                        environmentalRisk: "Low",
                        environmentalImpact: "Steel cans are highly recyclable. Recycling prevents mining, saves energy, reduces CO2 emissions. Magnetic separation makes sorting easy.",
                        recyclingMethod: "Remove labels (optional), rinse to remove food residue, place in metal recycling.",
                        reuseIdeas: [
                            "Storage containers",
                            "Pencil holders or organizers",
                            "DIY planters with drainage"
                        ],
                        disposalMethod: "If recycling unavailable, dispose in general waste.",
                        recommendedAction: "Rinse and recycle—steel is magnetically separated and easily processed."
                    },
                    {
                        name: "Plastic Bottle",
                        material: "Plastic",
                        subtype: "PET",
                        quantity: 6,
                        detectionConfidence: 90,
                        weight: {
                            estimatedGrams: 180,
                            minGrams: 140,
                            maxGrams: 230,
                            confidence: 73
                        },
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 93,
                        environmentalRisk: "Medium",
                        environmentalImpact: "PET plastic persists for centuries. Breaks down into microplastics. However, PET has high recycling value and can be reprocessed.",
                        recyclingMethod: "Empty, rinse, remove caps, flatten, place in PET recycling (look for #1 symbol).",
                        reuseIdeas: [
                            "Refill for water storage",
                            "DIY planters",
                            "Craft projects"
                        ],
                        disposalMethod: "If recycling unavailable, dispose in general waste. Never burn.",
                        recommendedAction: "Rinse, flatten, and recycle through PET collection program."
                    },
                    {
                        name: "Carton Container",
                        material: "Mixed Material",
                        subtype: "Tetra Pak",
                        quantity: 2,
                        detectionConfidence: 78,
                        weight: {
                            estimatedGrams: 120,
                            minGrams: 90,
                            maxGrams: 160,
                            confidence: 61
                        },
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 52,
                        environmentalRisk: "Medium",
                        environmentalImpact: "Multi-layer packaging (paper + plastic + foil). Requires specialized facilities to separate layers. Not universally accepted.",
                        recyclingMethod: "Check if local program accepts cartons. Rinse, flatten, remove straws/caps.",
                        reuseIdeas: [
                            "Use for organizing small items",
                            "Plant seed starters",
                            "DIY wallet or small containers"
                        ],
                        disposalMethod: "If not accepted locally, dispose in general waste—don't contaminate paper recycling.",
                        recommendedAction: "Verify local acceptance, rinse and flatten if recyclable, otherwise general waste."
                    }
                ],
                greenImpactScore: 89,
                impactExplanation: "Beverage container mix with excellent recyclability. Glass and metal are top-tier recyclables with high recovery value. Proper sorting maximizes environmental benefits.",
                actionPlan: [
                    "Rinse all beverage containers thoroughly before recycling",
                    "Leave caps on bottles for modern recycling facilities",
                    "Separate glass by color if required by local facility",
                    "Group metal cans together—will be sorted automatically",
                    "Flatten Tetra Pak cartons after rinsing",
                    "Verify local program accepts cartons before placing in recycling",
                    "Consider switching to reusable bottles to reduce waste"
                ]
            }
        ];
    }

    _getPollutionScenarios() {
        return [
            // Scenario 1: Open Waste Burning - Air Pollution
            {
                sceneDescription: "Outdoor scene with visible smoke and burning waste materials",
                pollution: {
                    primaryType: "air_pollution",
                    primarySubtype: "open_waste_burning",
                    confidence: 89,
                    secondaryTypes: ["land_pollution"],
                    visualEvidence: [
                        "Dense smoke plume visible rising from ground level",
                        "Active burning with visible flames",
                        "Mixed waste materials near fire",
                        "Dark particulate-laden smoke",
                        "Affected area visible around burn site"
                    ],
                    likelySources: [
                        {
                            source: "Open waste burning",
                            confidence: 84,
                            evidence: "Visible fire beneath smoke plume with apparent mixed waste materials"
                        }
                    ],
                    potentialPollutants: [
                        "Particulate matter (PM2.5 and PM10)",
                        "Carbon monoxide (CO)",
                        "Volatile organic compounds (VOCs)",
                        "Polycyclic aromatic hydrocarbons (PAHs)",
                        "Dioxins (if plastic burned)",
                        "Other combustion-related pollutants"
                    ],
                    concernScore: 82,
                    concernLevel: "high"
                },
                healthImpact: {
                    summary: "Open waste burning releases harmful pollutants that can affect respiratory and cardiovascular health, particularly with sufficient concentration or prolonged exposure.",
                    possibleEffects: [
                        "Eye, nose, and throat irritation",
                        "Respiratory irritation and coughing",
                        "Aggravation of asthma and other respiratory conditions",
                        "Reduced lung function with prolonged exposure",
                        "Cardiovascular effects from long-term exposure to particulate matter",
                        "Increased health risks for children, elderly, and those with pre-existing conditions"
                    ],
                    note: "Actual health risk depends on pollutant concentration, exposure duration, wind conditions, and proximity to the source."
                },
                environmentalImpact: {
                    air: "Releases particulate matter and toxic gases that degrade local air quality and can be transported by wind to surrounding areas.",
                    soil: "Burning residues and ash can contaminate soil with heavy metals and persistent organic pollutants.",
                    water: "Ash and residues can be washed into water bodies during rain, contaminating surface water and groundwater.",
                    wildlife: "Smoke and pollutants can harm birds and animals. Contaminated ash affects soil organisms and plant health.",
                    climate: "Releases greenhouse gases including carbon dioxide and methane, contributing to climate change.",
                    general: "Open burning is an inefficient and harmful waste management practice that creates multiple environmental problems."
                },
                pollutionPathway: [
                    "Waste materials accumulate without proper collection",
                    "Waste is burned in open air (often to reduce volume or dispose)",
                    "Combustion releases smoke, particulate matter, and toxic gases",
                    "Incomplete combustion creates additional harmful compounds",
                    "Wind transports pollutants to surrounding areas",
                    "Ash and residues remain on soil, affecting soil quality",
                    "Rain can wash contaminants into water systems"
                ],
                reductionPlan: [
                    "Stop open burning immediately where practical",
                    "Keep people, especially children and vulnerable individuals, away from smoke exposure",
                    "Separate waste into recyclable, compostable, and non-recyclable categories",
                    "Send recyclable materials to appropriate collection points",
                    "Compost organic waste rather than burning",
                    "Use proper waste disposal facilities for non-recyclable waste",
                    "Establish or improve local waste collection services",
                    "Educate community about harmful effects of open burning"
                ],
                preventionPlan: [
                    "Implement proper waste segregation at source",
                    "Establish regular waste collection services",
                    "Create local recycling and composting programs",
                    "Provide safe disposal options for all waste types",
                    "Educate community about proper waste management",
                    "Enforce regulations against open burning",
                    "Support alternatives like biogas from organic waste"
                ],
                actionPriority: {
                    now: [
                        "Avoid exposure to visible smoke where practical",
                        "Keep children and vulnerable individuals away from burning area",
                        "Document the burning activity if safe to do so"
                    ],
                    next: [
                        "Report burning to local environmental authorities",
                        "Organize community waste segregation program",
                        "Identify recycling and proper disposal facilities in the area",
                        "Educate neighbors about health and environmental risks"
                    ],
                    longTerm: [
                        "Advocate for improved municipal waste management",
                        "Support community composting initiatives",
                        "Promote waste reduction and reuse practices",
                        "Work with local authorities to eliminate open burning",
                        "Establish monitoring to prevent recurrence"
                    ]
                }
            },

            // Scenario 2: Water Pollution - Sewage/Industrial Discharge
            {
                sceneDescription: "Water body showing visible contamination with discoloration and floating debris",
                pollution: {
                    primaryType: "water_pollution",
                    primarySubtype: "sewage_or_industrial_discharge",
                    confidence: 78,
                    secondaryTypes: ["land_pollution"],
                    visualEvidence: [
                        "Water discoloration indicating contamination",
                        "Floating debris and waste materials",
                        "Visible foam or surface scum",
                        "Lack of visible aquatic life indicators",
                        "Discharge point visible near water body"
                    ],
                    likelySources: [
                        {
                            source: "Sewage discharge",
                            confidence: 72,
                            evidence: "Water discoloration and organic matter characteristics suggest sewage contamination"
                        },
                        {
                            source: "Industrial discharge",
                            confidence: 45,
                            evidence: "Possible but less certain based on visual characteristics"
                        }
                    ],
                    potentialPollutants: [
                        "Pathogenic bacteria and viruses",
                        "Organic matter and nutrients (nitrogen, phosphorus)",
                        "Suspended solids",
                        "Chemical contaminants (if industrial)",
                        "Heavy metals (if industrial)",
                        "Dissolved oxygen depletion"
                    ],
                    concernScore: 85,
                    concernLevel: "high"
                },
                healthImpact: {
                    summary: "Contact with contaminated water can cause illness. Ingestion or use of contaminated water poses serious health risks.",
                    possibleEffects: [
                        "Gastrointestinal illness from pathogenic organisms",
                        "Skin infections and rashes from direct contact",
                        "Eye and ear infections",
                        "Waterborne diseases (cholera, typhoid, hepatitis A in severe cases)",
                        "Vector-borne diseases if stagnant contaminated water creates breeding grounds"
                    ],
                    note: "Do not drink, swim in, or use contaminated water. Avoid all direct contact until water is officially tested and declared safe."
                },
                environmentalImpact: {
                    water: "Contamination degrades water quality, making it unsafe for human use, irrigation, and aquatic life.",
                    wildlife: "Polluted water kills fish and other aquatic organisms. Oxygen depletion creates dead zones. Affects birds and animals that depend on the water body.",
                    soil: "If contaminated water is used for irrigation, pollutants accumulate in soil.",
                    ecosystem: "Disrupts entire aquatic ecosystem. Nutrient pollution causes algal blooms that further degrade water quality.",
                    community: "Affects communities dependent on the water body for drinking water, fishing, agriculture, and livelihoods.",
                    general: "Water pollution has cascading effects throughout the environment and human communities."
                },
                pollutionPathway: [
                    "Sewage or industrial waste enters water body (pipe, open drain, or runoff)",
                    "Contaminants disperse through water",
                    "Organic matter depletes dissolved oxygen as it decomposes",
                    "Nutrients cause algal blooms and eutrophication",
                    "Water becomes unsuitable for aquatic life and human use",
                    "Contamination can spread downstream",
                    "Sediments accumulate pollutants that persist over time"
                ],
                reductionPlan: [
                    "Report water pollution immediately to local water quality authorities",
                    "Document pollution source if visible and safe to do so",
                    "Avoid all contact with contaminated water",
                    "Alert downstream communities of contamination risk",
                    "Request emergency water quality testing",
                    "Identify and work to stop pollution source",
                    "Support proper wastewater treatment infrastructure",
                    "Initiate cleanup and remediation with professional assistance"
                ],
                preventionPlan: [
                    "Ensure proper sewage treatment before discharge",
                    "Enforce industrial wastewater treatment standards",
                    "Prevent direct discharge of untreated waste into water bodies",
                    "Maintain and upgrade wastewater treatment infrastructure",
                    "Monitor water quality regularly",
                    "Create buffer zones around water bodies",
                    "Educate communities about water protection"
                ],
                actionPriority: {
                    now: [
                        "Do NOT use contaminated water for any purpose",
                        "Avoid all direct contact with the water",
                        "Document pollution with photos and location data if safe"
                    ],
                    next: [
                        "Report immediately to water quality management authority",
                        "Request emergency water quality testing",
                        "Identify and document pollution source if visible",
                        "Alert communities that may be affected downstream"
                    ],
                    longTerm: [
                        "Work with authorities to stop pollution source",
                        "Advocate for improved wastewater treatment",
                        "Support water quality monitoring programs",
                        "Initiate legal action if pollution continues",
                        "Promote water protection and conservation"
                    ]
                }
            },

            // Scenario 3: Plastic Pollution and Littering
            {
                sceneDescription: "Environment with visible accumulation of plastic waste and litter",
                pollution: {
                    primaryType: "plastic_pollution",
                    primarySubtype: "plastic_littering_and_accumulation",
                    confidence: 86,
                    secondaryTypes: ["land_pollution"],
                    visualEvidence: [
                        "Scattered plastic bottles and containers",
                        "Plastic bags visible in environment",
                        "Non-biodegradable waste in natural setting",
                        "Plastic waste near water body or drainage",
                        "Evidence of long-term accumulation"
                    ],
                    likelySources: [
                        {
                            source: "Improper waste disposal and littering",
                            confidence: 88,
                            evidence: "Scattered distribution pattern consistent with littering and lack of waste collection"
                        },
                        {
                            source: "Inadequate waste management infrastructure",
                            confidence: 75,
                            evidence: "Accumulation suggests absence of regular collection"
                        }
                    ],
                    potentialPollutants: [
                        "Plastic polymers (persistent in environment)",
                        "Microplastics from degradation",
                        "Chemical additives from plastics",
                        "Leachate from decomposing associated organic waste"
                    ],
                    concernScore: 68,
                    concernLevel: "moderate_to_high"
                },
                healthImpact: {
                    summary: "Plastic pollution creates environmental health hazards and can contribute to disease vector breeding in accumulated waste.",
                    possibleEffects: [
                        "Breeding grounds for disease-carrying mosquitoes in water-holding plastics",
                        "Attraction of pests and disease vectors",
                        "Injury risk from sharp or broken plastic items",
                        "Indirect health impacts through contaminated water and food chains",
                        "Microplastic exposure through environment (long-term effects under study)"
                    ],
                    note: "Primary health concerns are indirect through environmental degradation and disease vector proliferation."
                },
                environmentalImpact: {
                    land: "Plastic persists for decades to centuries, contaminating soil and preventing natural decomposition processes.",
                    water: "Plastic waste clogs drainage systems, enters water bodies, and breaks down into microplastics that contaminate aquatic ecosystems.",
                    wildlife: "Animals mistake plastic for food, leading to ingestion and injury. Entanglement in plastic waste harms wildlife. Microplastics enter food chains.",
                    ecosystem: "Plastic accumulation degrades habitat quality, affects soil organisms, and disrupts natural ecosystem functions.",
                    marine: "If plastic reaches waterways, it contributes to ocean plastic pollution affecting marine life globally.",
                    general: "Plastic pollution is a persistent, widespread environmental problem that requires systematic solutions."
                },
                pollutionPathway: [
                    "Plastic products are used and discarded",
                    "Inadequate waste collection allows accumulation",
                    "Littering adds to environmental plastic load",
                    "Wind and rain disperse plastic waste",
                    "Plastic enters drainage systems and water bodies",
                    "UV light and physical forces fragment plastic into smaller pieces",
                    "Microplastics persist in environment and enter food chains",
                    "Plastic accumulates in environmental sinks"
                ],
                reductionPlan: [
                    "Organize community cleanup of visible plastic waste",
                    "Separate collected plastic by type for recycling",
                    "Report chronic littering areas to local authorities",
                    "Install waste bins in high-traffic areas",
                    "Establish regular waste collection services",
                    "Create awareness campaigns about proper disposal",
                    "Support local recycling programs",
                    "Prevent further plastic accumulation through monitoring"
                ],
                preventionPlan: [
                    "Reduce single-use plastic consumption",
                    "Switch to reusable bags, bottles, and containers",
                    "Support businesses that minimize plastic packaging",
                    "Properly dispose of all plastic waste in designated collection",
                    "Participate in plastic recycling programs",
                    "Educate community about plastic pollution impacts",
                    "Advocate for improved waste management infrastructure",
                    "Support policies that reduce plastic waste"
                ],
                actionPriority: {
                    now: [
                        "Organize or join community cleanup efforts",
                        "Properly dispose of your own plastic waste",
                        "Document pollution areas for reporting"
                    ],
                    next: [
                        "Report littering and waste accumulation to authorities",
                        "Work with community to establish waste collection",
                        "Identify and support local recycling facilities",
                        "Install waste bins where needed",
                        "Begin educational outreach about proper disposal"
                    ],
                    longTerm: [
                        "Advocate for comprehensive waste management system",
                        "Reduce overall plastic consumption in community",
                        "Support extended producer responsibility for plastics",
                        "Promote reusable alternatives",
                        "Monitor and prevent future plastic accumulation"
                    ]
                }
            },

            // Scenario 4: Soil/Land Pollution - Contaminated Ground
            {
                sceneDescription: "Land area with visible soil contamination and waste dumping",
                pollution: {
                    primaryType: "land_pollution",
                    primarySubtype: "soil_contamination_and_waste_dumping",
                    confidence: 81,
                    secondaryTypes: ["plastic_pollution"],
                    visualEvidence: [
                        "Visible waste accumulation on ground",
                        "Discolored or degraded soil visible",
                        "Mixed waste materials scattered across area",
                        "Lack of vegetation in contaminated zones",
                        "Evidence of improper waste disposal"
                    ],
                    likelySources: [
                        {
                            source: "Illegal dumping",
                            confidence: 79,
                            evidence: "Scattered waste materials indicate unauthorized disposal"
                        },
                        {
                            source: "Inadequate waste management",
                            confidence: 76,
                            evidence: "Accumulated waste suggests lack of proper collection infrastructure"
                        }
                    ],
                    potentialPollutants: [
                        "Heavy metals (lead, mercury, cadmium)",
                        "Organic pollutants and chemicals",
                        "Leachate from decomposing waste",
                        "Plastic microparticles",
                        "Toxic chemicals from improper disposal",
                        "Pathogens from organic waste"
                    ],
                    concernScore: 74,
                    concernLevel: "high"
                },
                healthImpact: {
                    summary: "Soil contamination can affect human health through direct contact, contaminated food crops, or polluted groundwater.",
                    possibleEffects: [
                        "Skin contact with contaminated soil may cause irritation",
                        "Ingestion of contaminated soil particles (especially children)",
                        "Exposure to toxic chemicals and heavy metals",
                        "Risk of vector-borne diseases from accumulated waste",
                        "Contaminated groundwater affecting drinking water sources",
                        "Food safety concerns if crops grown in contaminated soil"
                    ],
                    note: "Actual health risk depends on contaminant type, concentration, exposure route, and duration. Soil testing provides accurate contamination assessment."
                },
                environmentalImpact: {
                    soil: "Contaminants alter soil chemistry, reduce fertility, and harm soil organisms. Heavy metals persist for decades affecting plant growth and soil ecosystem function.",
                    water: "Rainwater leaches pollutants into groundwater and surface water bodies, spreading contamination beyond the original site.",
                    wildlife: "Contaminated soil affects burrowing animals, soil-dwelling organisms, and wildlife that forage in affected areas.",
                    ecosystem: "Soil contamination disrupts nutrient cycles, reduces biodiversity, and creates dead zones where vegetation cannot grow.",
                    climate: "Degraded soil loses carbon storage capacity. Waste decomposition releases methane and other greenhouse gases.",
                    general: "Land pollution creates long-term environmental damage requiring extensive remediation efforts."
                },
                pollutionPathway: [
                    "Waste materials improperly disposed on land",
                    "Chemicals and pollutants leach into soil",
                    "Rainwater carries contaminants deeper into soil layers",
                    "Pollutants spread through groundwater flow",
                    "Soil organisms affected, reducing soil quality",
                    "Contaminants enter food chain through plants and animals",
                    "Wind may spread contaminated dust particles"
                ],
                reductionPlan: [
                    "Remove visible waste and dispose properly",
                    "Report illegal dumping sites to authorities",
                    "Conduct soil contamination assessment",
                    "Establish waste collection infrastructure",
                    "Prevent further unauthorized disposal",
                    "Consider soil remediation if heavily contaminated",
                    "Fence off contaminated areas to prevent access",
                    "Monitor groundwater quality in affected areas"
                ],
                preventionPlan: [
                    "Establish proper waste collection and disposal systems",
                    "Enforce regulations against illegal dumping",
                    "Educate community about proper waste disposal",
                    "Provide accessible waste disposal facilities",
                    "Implement regular monitoring and enforcement",
                    "Promote waste reduction and recycling",
                    "Support soil conservation practices",
                    "Create designated waste management zones"
                ],
                actionPriority: {
                    now: [
                        "Avoid direct contact with contaminated soil",
                        "Prevent children and animals from accessing affected area",
                        "Document contamination with photos and location"
                    ],
                    next: [
                        "Report site to environmental authorities",
                        "Organize community cleanup if safe to do so",
                        "Request soil contamination assessment",
                        "Identify and stop ongoing dumping activity"
                    ],
                    longTerm: [
                        "Support soil remediation programs",
                        "Advocate for improved waste management infrastructure",
                        "Promote proper waste disposal education",
                        "Monitor long-term soil and groundwater quality",
                        "Work toward comprehensive land pollution prevention"
                    ]
                }
            }
        ];
    }

    async _simulateDelay() {
        const delay = 800 + Math.random() * 1200;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}
