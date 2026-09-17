// Enhanced waste scenarios with complete field structure
// This file contains the full scenario data to be integrated into mockProvider.js

export const enhancedWasteScenarios = [
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
            }
        ],
        greenImpactScore: 78,
        impactExplanation: "Mixed recyclable materials with good separation potential. Proper sorting enables high material recovery rates and significant environmental benefits.",
        actionPlan: [
            { priority: "high", action: "Separate recyclables immediately: plastic, metal, cardboard" },
            { priority: "high", action: "Rinse all containers before recycling" },
            { priority: "medium", action: "Compost food waste separately" },
            { priority: "medium", action: "Flatten cardboard to save space" },
            { priority: "low", action: "Consider reducing single-use packaging purchases" }
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
                    "Use for app testing or children's educational device"
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
                recommendedAction": "Tape terminals and take to battery recycling collection point immediately."
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
                    "Use for non-critical charging applications"
                ],
                disposalMethod: "Include with e-waste recycling or scrap metal collection.",
                recommendedAction: "Bundle cables and recycle with e-waste for copper recovery."
            }
        ],
        greenImpactScore: 54,
        impactExplanation: "E-waste and hazardous materials require specialized handling. High resource recovery potential but improper disposal creates severe environmental and health risks.",
        actionPlan: [
            { priority: "critical", action: "Separate batteries immediately—tape terminals to prevent fire risk" },
            { priority: "high", action: "Wipe personal data from electronic devices" },
            { priority: "high", action: "Locate certified e-waste recycling facility" },
            { priority: "medium", action: "Bundle cables together for collection" },
            { priority: "low", action: "Consider donating functional electronics instead of recycling" }
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
                environmentalImpact: "Glass is inert and persists indefinitely. However, it's 100% recyclable without quality loss and can be recycled endlessly. Recycling saves raw materials and reduces energy consumption by 30%.",
                recyclingMethod: "Remove caps and lids, rinse clean, separate by color if required, place in glass recycling.",
                reuseIdeas: [
                    "Reuse as water bottles or storage containers",
                    "Create decorative vases or candle holders",
                    "Use for homemade sauces or preserves"
                ],
                disposalMethod: "If recycling unavailable, dispose carefully in general waste to prevent breakage.",
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
                environmentalImpact: "Bottle caps are often different plastic than bottles. Small caps can jam sorting equipment but many facilities now accept caps left on bottles.",
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
                    "Use as storage containers",
                    "Create pencil holders or organizers",
                    "DIY planters with drainage holes"
                ],
                disposalMethod: "If recycling unavailable, dispose in general waste.",
                recommendedAction: "Rinse and recycle—steel is magnetically separated and easily processed."
            }
        ],
        greenImpactScore: 89,
        impactExplanation: "Beverage container mix with excellent recyclability. Glass and metal are top-tier recyclables with high recovery value.",
        actionPlan: [
            { priority: "high", action: "Rinse all containers thoroughly" },
            { priority: "high", action: "Leave caps on bottles for modern recycling facilities" },
            { priority: "medium", action: "Separate glass by color if required locally" },
            { priority: "medium", action: "Group metal cans together" },
            { priority: "low", action: "Consider switching to reusable bottles" }
        ]
    }
];
