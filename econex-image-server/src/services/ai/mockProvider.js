import { logger } from "../../utils/logger.js";

export class MockAIProvider {
    constructor() {
        this.name = "Mock AI Provider";
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

        const scenarios = this._getPollutionScenarios();
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        return {
            ...scenario,
            isDevelopmentMode: true,
            demo: true,
            note: "Development Mode: This is simulated analysis. Connect AWS Bedrock for real pollution detection."
        };
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
            {
                pollutionType: "Plastic Pollution",
                category: "Plastic Pollution",
                severity: "Moderate",
                severityScore: 65,
                confidence: 72,
                description: "Visible plastic waste accumulation including bottles, bags, and containers scattered in the environment.",
                detectedEvidence: [
                    "Scattered plastic bottles and containers",
                    "Non-biodegradable materials in natural environment",
                    "Potential for microplastic generation",
                    "Wildlife interaction risk"
                ],
                environmentalImpact: "Plastic pollution harms wildlife through ingestion and entanglement, breaks down into microplastics that enter food chains, persists for centuries in ecosystems, and contaminates soil and water systems.",
                urgency: "Medium",
                recommendedAction: "Organize systematic cleanup of visible plastic waste, establish waste collection infrastructure, prevent further dumping, and report to local environmental authorities.",
                recommendedActions: [
                    "Organize community cleanup event with proper safety equipment",
                    "Separate collected plastic by type for maximum recycling potential",
                    "Report pollution to local environmental protection agency",
                    "Install waste bins and signage to prevent future dumping",
                    "Educate local community about proper waste disposal",
                    "Monitor area regularly to prevent recurrence"
                ],
                greenImpactScore: 58,
                impactExplanation: "Addressing plastic pollution prevents ecosystem damage, protects wildlife, reduces microplastic generation, and improves environmental quality for surrounding communities."
            },
            {
                pollutionType: "Land Pollution",
                category: "Garbage Dumping",
                severity: "High",
                severityScore: 78,
                confidence: 68,
                description: "Illegal dumping of mixed waste materials including household refuse, construction debris, and potentially hazardous materials.",
                detectedEvidence: [
                    "Mixed waste accumulation",
                    "Evidence of illegal dumping",
                    "Soil contamination risk",
                    "Odor and pest attraction potential"
                ],
                environmentalImpact: "Illegal dumping contaminates soil with chemicals and heavy metals, attracts disease-carrying pests, produces harmful leachate that pollutes groundwater, creates fire hazards, and degrades local environment quality.",
                urgency: "High",
                recommendedAction: "Report immediately to local authorities. Do not attempt cleanup without professional assessment due to potential hazardous material presence.",
                recommendedActions: [
                    "Document pollution with photos and location data",
                    "Report to municipal authorities and environmental protection agency",
                    "Do NOT attempt cleanup without professional hazard assessment",
                    "Request official environmental impact assessment",
                    "Install physical barriers or surveillance to prevent further dumping",
                    "Advocate for increased enforcement and penalties"
                ],
                greenImpactScore: 42,
                impactExplanation: "Illegal dumping creates severe environmental and health risks. Professional cleanup and enforcement are essential to restore environmental quality."
            },
            {
                pollutionType: "Water Pollution",
                category: "Water Contamination",
                severity: "High",
                severityScore: 82,
                confidence: 75,
                description: "Visible contamination of water body with debris, discoloration indicating chemical presence, and potential sewage or industrial discharge.",
                detectedEvidence: [
                    "Water discoloration",
                    "Floating debris and waste",
                    "Potential chemical or sewage contamination",
                    "Aquatic ecosystem stress indicators"
                ],
                environmentalImpact: "Water pollution kills aquatic life, makes water unsafe for human use, disrupts entire aquatic ecosystems, contaminates drinking water sources, and affects communities dependent on water body.",
                urgency: "Critical",
                recommendedAction: "Report immediately to water quality authorities. Avoid direct contact with water. Do not consume or use water until officially tested.",
                recommendedActions: [
                    "Report immediately to water quality management authority",
                    "Document pollution source if identifiable",
                    "Avoid all contact with contaminated water",
                    "Alert downstream communities of potential contamination",
                    "Request emergency water quality testing",
                    "Identify and stop pollution source",
                    "Initiate investigation for legal action"
                ],
                greenImpactScore: 35,
                impactExplanation: "Water pollution has severe and immediate impacts on ecosystems and human health. Urgent action required to stop contamination and initiate remediation."
            }
        ];
    }

    async _simulateDelay() {
        const delay = 800 + Math.random() * 1200;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}
