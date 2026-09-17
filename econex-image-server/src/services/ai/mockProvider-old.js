import { logger } from "../../utils/logger.js";

export class MockAIProvider {
    constructor() {
        this.name = "Mock AI Provider";
        logger.info("Mock AI Provider initialized (Development Mode)");
    }

    async verifyImageAuthenticity(imageBuffer, mimeType) {
        await this._simulateDelay();

        // Basic image analysis
        const fileSize = imageBuffer.length;
        const sizeKB = Math.round(fileSize / 1024);

        // Simple heuristics (not real AI detection)
        // Very small images are suspicious
        if (fileSize < 10000) {
            return {
                imageType: "uncertain",
                confidence: 45,
                accepted: false,
                message: "Image quality too low for reliable analysis. Please upload a clear, high-resolution original photo.",
                isDevelopmentMode: true
            };
        }

        // Check filename patterns in future if passed
        // For now, randomized but weighted towards accepting
        const random = Math.random();

        // 15% chance of AI-generated detection (for testing)
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

        // 10% uncertain
        if (random < 0.25) {
            return {
                imageType: "uncertain",
                confidence: Math.floor(48 + Math.random() * 15),
                accepted: true, // Allow in dev mode
                message: "Image authenticity could not be verified with high confidence. Proceeding with analysis in development mode.",
                isDevelopmentMode: true
            };
        }

        // 75% original (most common)
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

        // Generate varied realistic scenarios
        const scenarios = this._getWasteScenarios();
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        // Calculate summary stats
        const totalObjects = scenario.objects.length;
        const totalWeight = scenario.objects.reduce((sum, obj) => sum + (obj.estimatedWeightGrams || 0), 0);
        const minWeight = Math.floor(totalWeight * 0.75);
        const maxWeight = Math.floor(totalWeight * 1.35);

        // Calculate material breakdown
        const materialCounts = {};
        scenario.objects.forEach(obj => {
            const material = obj.material.split(' ')[0]; // Get base material name
            materialCounts[material] = (materialCounts[material] || 0) + 1;
        });

        const materialBreakdown = Object.entries(materialCounts).map(([material, count]) => ({
            material,
            count,
            percentage: Math.round((count / totalObjects) * 100)
        })).sort((a, b) => b.count - a.count);

        // Image quality assessment
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
            // Scenario 1: Mixed waste - Multiple items
            {
                objects: [
                    {
                        name: "Plastic Bottle",
                        material: "Plastic",
                        subtype: "PET",
                        quantity: 5,
                        detectionConfidence: 86,
                        weight: {
                            estimatedGrams: 150,
                            minGrams: 120,
                            maxGrams: 190,
                            confidence: 62
                        },
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 92,
                        environmentalRisk: "Medium",
                        environmentalImpact: "PET plastic can persist in the environment for hundreds of years if not properly recycled. When degraded, it breaks into microplastics that contaminate soil and water systems, entering food chains and affecting wildlife.",
                        recyclingMethod: "Empty all liquid content completely. Remove cap and label if possible. Rinse the bottle with water. Flatten to save space. Place in designated PET/plastic recycling bin. Look for recycling symbol #1.",
                        reuseIdeas: [
                            "Use as water storage container for gardening",
                            "Create DIY planters by cutting and decorating",
                            "Use for craft projects or organizers"
                        ],
                        disposalMethod: "If recycling is unavailable, dispose in general waste. Never burn plastic or dump in waterways.",
                        recommendedAction: "Rinse, remove cap, flatten, and place in PET recycling bin."
                    },
                    {
                        name: "Aluminium Can",
                        material: "Metal",
                        subtype: "Aluminium",
                        quantity: 4,
                        detectionConfidence: 91,
                        weight: {
                            estimatedGrams: 60,
                            minGrams: 45,
                            maxGrams: 75,
                            confidence: 68
                        },
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 98,
                        environmentalRisk: "Low",
                        environmentalImpact: "Aluminium production from raw ore requires massive energy consumption and generates significant environmental impact. However, aluminium is infinitely recyclable without quality loss. Recycling saves 95% of energy needed for primary production.",
                        recyclingMethod: "Empty the can completely. Rinse to remove beverage residue. Crush or flatten to save space if desired. Place in metal/aluminium recycling container.",
                        reuseIdeas: [
                            "Use as small planters with drainage holes",
                            "Create DIY candle holders",
                            "Use for organizing small items like screws or buttons"
                        ],
                        disposalMethod: "If recycling unavailable, dispose in general waste. High scrap value means recycling is almost always available.",
                        recommendedAction: "Rinse, crush if desired, and place in metal recycling bin."
                    },
                    {
                        name: "Plastic Bag",
                        material: "Plastic",
                        subtype: "LDPE",
                        quantity: 8,
                        detectionConfidence: 73,
                        weight: {
                            estimatedGrams: 45,
                            minGrams: 30,
                            maxGrams: 65,
                            confidence: 52
                        },
                        biodegradable: false,
                        recyclable: false,
                        recyclabilityScore: 22,
                        environmentalRisk: "High",
                        environmentalImpact: "Plastic bags cause severe environmental damage. They clog drainage systems, harm marine life through ingestion and entanglement, break down into microplastics, and persist for decades.",
                        recyclingMethod: "Most curbside programs don't accept plastic bags. Check if local grocery stores have plastic film collection bins. Never place in regular recycling—jams sorting equipment.",
                        reuseIdeas: [
                            "Reuse for shopping or storage multiple times",
                            "Use as trash can liners for small bins",
                            "Use for packing materials when moving"
                        ],
                        disposalMethod: "Return to store collection bins if available, otherwise dispose in general waste. Switch to reusable cloth bags.",
                        recommendedAction": "Reuse multiple times, return to store collection, or switch to reusable bags."
                    },
                    {
                        name: "Food container",
                        material: "Polystyrene (Styrofoam)",
                        quantity: 2,
                        quantityConfidence: 79,
                        estimatedWeightGrams: 35,
                        weightConfidence: 48,
                        biodegradable: false,
                        recyclable: false,
                        recyclabilityScore: 8,
                        environmentalImpact: "Polystyrene (styrofoam) is extremely problematic. It's non-biodegradable, breaks into small pieces easily, leaches chemicals into food and environment, and is rarely recyclable. It makes up significant volume in landfills despite light weight.",
                        recyclingMethod: "Most municipalities do NOT accept polystyrene for recycling. 1. Check for specialized polystyrene recycling locations (rare). 2. Avoid purchasing products with styrofoam packaging. 3. Choose restaurants and products using alternative packaging. 4. Dispose as regular waste if no recycling option exists."
                    },
                    {
                        name: "Glass jar",
                        material: "Glass",
                        quantity: 2,
                        quantityConfidence: 88,
                        estimatedWeightGrams: 380,
                        weightConfidence: 64,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 97,
                        environmentalImpact: "Glass is inert and doesn't leach chemicals, but persists indefinitely in environment. Glass production requires high energy. However, glass can be recycled infinitely without quality degradation, making it excellent for circular economy when recycled properly.",
                        recyclingMethod: "1. Remove lids and caps. 2. Rinse to remove food residue. 3. Labels usually don't need removal. 4. Keep different glass types separate if required (bottles vs jars). 5. Never include window glass, ceramics, or Pyrex with container glass. 6. Place in glass recycling."
                    },
                    {
                        name: "Cardboard packaging",
                        material: "Corrugated Cardboard",
                        quantity: 3,
                        quantityConfidence: 84,
                        estimatedWeightGrams: 280,
                        weightConfidence: 56,
                        biodegradable: true,
                        recyclable: true,
                        recyclabilityScore: 94,
                        environmentalImpact: "Cardboard production uses trees, water, and energy. When landfilled, cardboard produces methane during decomposition. Recycling cardboard reduces deforestation, saves energy and water, and keeps organic material out of landfills.",
                        recyclingMethod: "1. Remove all tape, labels, staples. 2. Flatten boxes completely. 3. Keep dry—wet cardboard contaminates recycling. 4. Remove any food contamination. 5. Bundle flat or place in paper recycling. 6. Cardboard can be recycled 5-7 times."
                    }
                ],
                greenImpactScore: 76,
                impactExplanation: "This mixed waste stream contains highly recyclable materials (aluminium, glass, cardboard, PET bottles) alongside difficult-to-recycle items (plastic bags, styrofoam). Proper separation significantly improves recycling outcomes and reduces environmental impact.",
                actionPlan: [
                    "Separate highly recyclable items: aluminium cans, glass jars, PET bottles, cardboard",
                    "Rinse all food/beverage containers before recycling",
                    "Check if plastic bags can be returned to grocery store collection bins",
                    "Dispose non-recyclable items (styrofoam) in regular waste, not recycling",
                    "Flatten cardboard and remove tape/staples",
                    "Deliver sorted recyclables to appropriate collection points",
                    "Consider reducing future use of non-recyclable packaging"
                ]
            },

            // Scenario 2: Paper, cardboard, and organic waste
            {
                objects: [
                    {
                        name: "Cardboard box",
                        material: "Corrugated Cardboard",
                        quantity: 4,
                        quantityConfidence: 89,
                        estimatedWeightGrams: 620,
                        weightConfidence: 58,
                        biodegradable: true,
                        recyclable: true,
                        recyclabilityScore: 95,
                        environmentalImpact: "Cardboard production requires significant forest resources and water. Improper disposal leads to landfill waste and methane emissions during decomposition. However, cardboard is highly recyclable and biodegradable when composted properly.",
                        recyclingMethod: "1. Remove all tape, labels, and non-paper materials. 2. Flatten the box completely. 3. Ensure cardboard is clean and dry (wet or food-contaminated cardboard cannot be recycled). 4. Bundle with string or place in paper recycling bin. 5. Cardboard can be recycled 5-7 times before fiber quality degrades."
                    },
                    {
                        name: "Newspaper/Magazine",
                        material: "Paper",
                        quantity: 12,
                        quantityConfidence: 81,
                        estimatedWeightGrams: 340,
                        weightConfidence: 52,
                        biodegradable: true,
                        recyclable: true,
                        recyclabilityScore: 89,
                        environmentalImpact: "Paper production consumes trees, water, and energy. Newspaper ink was historically toxic but modern soy-based inks are safer. Recycling paper reduces deforestation pressure, saves water and energy, and decreases landfill volume.",
                        recyclingMethod: "1. Keep newspapers dry and bundled. 2. Remove any plastic bags or non-paper inserts. 3. Glossy magazine paper is recyclable with regular paper. 4. Wet or moldy paper should be composted, not recycled. 5. Place in paper recycling collection."
                    },
                    {
                        name: "Office paper",
                        material: "White Paper",
                        quantity: 28,
                        quantityConfidence: 77,
                        estimatedWeightGrams: 185,
                        weightConfidence: 46,
                        biodegradable: true,
                        recyclable: true,
                        recyclabilityScore: 92,
                        environmentalImpact: "White office paper is high-quality fiber with excellent recycling potential. Bleaching process uses chemicals but recycled paper reduces virgin pulp demand significantly. One ton of recycled paper saves approximately 17 trees.",
                        recyclingMethod: "1. Remove staples, paper clips, and binder clips. 2. Plastic covers and spiral bindings must be removed. 3. Small amounts of ink/toner are acceptable. 4. Shredded paper can be recycled—place in paper bag or bundle. 5. Keep dry and place in paper recycling."
                    },
                    {
                        name: "Paper cups",
                        material: "Paper with Plastic Lining",
                        quantity: 6,
                        quantityConfidence: 83,
                        estimatedWeightGrams: 95,
                        weightConfidence: 54,
                        biodegradable: false,
                        recyclable: false,
                        recyclabilityScore: 18,
                        environmentalImpact: "Most paper cups have thin plastic or wax lining making them non-recyclable in standard programs. Despite appearing paper-based, this mixed material requires specialized processing rarely available. Billions of paper cups end up in landfills annually.",
                        recyclingMethod: "Most paper cups CANNOT be recycled in regular paper streams due to plastic lining. 1. Check if specialized cup recycling exists in your area (rare). 2. Some cities have commercial composting that accepts lined cups. 3. Best solution: use reusable cups. 4. If no option exists, dispose as regular waste."
                    },
                    {
                        name: "Food waste",
                        material: "Organic material",
                        quantity: 1,
                        quantityConfidence: 68,
                        estimatedWeightGrams: 520,
                        weightConfidence: 41,
                        biodegradable: true,
                        recyclable: false,
                        recyclabilityScore: 0,
                        environmentalImpact: "Food waste in landfills generates methane, a greenhouse gas 25 times more potent than CO2. Wasted food represents wasted water, energy, land, and resources used in production. Globally, food waste contributes 8-10% of greenhouse gas emissions.",
                        recyclingMethod: "Food waste should be composted, not recycled. 1. Separate organic matter from all packaging. 2. Home compost: vegetables, fruit, coffee grounds, eggshells. 3. Avoid: meat, dairy, oils (attract pests in home systems). 4. Municipal organics collection accepts all food. 5. Industrial composting handles meat/dairy."
                    }
                ],
                greenImpactScore: 82,
                impactExplanation: "This waste stream is predominantly recyclable and compostable with proper separation. Paper and cardboard have high recycling rates. Organic waste should be composted. Paper cups require special handling. Correct sorting maximizes resource recovery.",
                actionPlan: [
                    "Separate high-quality recyclable paper (office paper, newspaper) from cardboard",
                    "Remove all non-paper items: staples, plastic, binder clips",
                    "Flatten cardboard boxes and bundle paper materials",
                    "Compost food waste separately—never mix with paper recycling",
                    "Dispose paper cups in regular waste unless specialized recycling available",
                    "Keep all paper materials dry until collection",
                    "Consider reducing paper cup use with reusable alternatives"
                ]
            },

            // Scenario 3: Kitchen and food-related waste
            {
                objects: [
                    {
                        name: "Plastic bottle (beverage)",
                        material: "PET Plastic",
                        quantity: 7,
                        quantityConfidence: 88,
                        estimatedWeightGrams: 210,
                        weightConfidence: 61,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 93,
                        environmentalImpact: "PET plastic persists for centuries. Breaks down into microplastics contaminating ecosystems. However, PET has high recycling value and can be reprocessed into new bottles, clothing fibers, and other products.",
                        recyclingMethod: "1. Empty completely and rinse. 2. Remove caps (often different plastic type). 3. Remove labels if easy. 4. Flatten to save space. 5. Place in PET/plastic recycling. Check for #1 recycling symbol."
                    },
                    {
                        name: "Food containers (takeout)",
                        material: "Polypropylene (PP)",
                        quantity: 5,
                        quantityConfidence: 76,
                        estimatedWeightGrams: 180,
                        weightConfidence: 49,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 68,
                        environmentalImpact: "PP containers are better than styrofoam but still create plastic waste. Many programs now accept PP (#5) but check locally. Reusable containers are vastly preferable to single-use.",
                        recyclingMethod: "1. Remove all food residue—contaminated containers ruin recycling batches. 2. Check local program accepts #5 plastic. 3. Stack containers to save space. 4. If program doesn't accept PP, dispose as regular waste."
                    },
                    {
                        name: "Aluminium foil/trays",
                        material: "Aluminium",
                        quantity: 3,
                        quantityConfidence: 82,
                        estimatedWeightGrams: 75,
                        weightConfidence: 58,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 89,
                        environmentalImpact: "Aluminium foil and trays are recyclable but often contaminated with food. Clean aluminium recycles well. Crumpled foil is hard to sort mechanically—ball up small pieces together for better recycling.",
                        recyclingMethod: "1. Scrape off food residue. 2. Rinse if heavily contaminated. 3. Ball up small foil pieces into golf-ball size for easier sorting. 4. Clean foil trays can be recycled. 5. Place with metal recycling."
                    },
                    {
                        name: "Glass bottles/jars",
                        material: "Glass",
                        quantity: 4,
                        quantityConfidence: 91,
                        estimatedWeightGrams: 720,
                        weightConfidence: 67,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 97,
                        environmentalImpact: "Glass is infinitely recyclable without quality loss. Inert and doesn't leach chemicals. However, glass is heavy (transportation impact) and requires high heat for processing.",
                        recyclingMethod: "1. Remove lids/caps. 2. Rinse clean. 3. Labels usually okay to leave on. 4. Don't break—whole containers are safer and easier to process. 5. Separate by color if required locally. 6. Place in glass recycling."
                    },
                    {
                        name: "Food waste (organic)",
                        material: "Organic material",
                        quantity: 1,
                        quantityConfidence: 72,
                        estimatedWeightGrams: 680,
                        weightConfidence: 38,
                        biodegradable: true,
                        recyclable: false,
                        recyclabilityScore: 0,
                        environmentalImpact: "Food waste creates methane in landfills (28-34x more potent than CO2 over 100 years). Represents wasted water, energy, land, labor, and resources. One-third of food produced globally is wasted.",
                        recyclingMethod: "Compost, don't recycle. 1. Separate from ALL packaging. 2. Home compost: veggie/fruit scraps, coffee grounds, eggshells. 3. Avoid in home compost: meat, dairy, oils, bones. 4. Municipal/industrial compost accepts all food. 5. Creates nutrient-rich soil amendment."
                    },
                    {
                        name: "Plastic utensils",
                        material: "Polystyrene/Mixed Plastic",
                        quantity: 12,
                        quantityConfidence: 79,
                        estimatedWeightGrams: 85,
                        weightConfidence: 53,
                        biodegradable: false,
                        recyclable: false,
                        recyclabilityScore: 5,
                        environmentalImpact: "Single-use plastic utensils are environmental disaster. Lightweight so easily enter waterways. Break into microplastics. Rarely recyclable. Often made from mixed plastics impossible to reprocess.",
                        recyclingMethod: "Most plastic utensils CANNOT be recycled. 1. Reusable utensils are only sustainable option. 2. If disposable needed, choose compostable bamboo or wood. 3. Plastic utensils go in regular trash. 4. Never place in recycling—contaminates batches."
                    },
                    {
                        name: "Cardboard (pizza boxes)",
                        material: "Grease-contaminated Cardboard",
                        quantity: 2,
                        quantityConfidence: 84,
                        estimatedWeightGrams: 290,
                        weightConfidence: 55,
                        biodegradable: true,
                        recyclable: false,
                        recyclabilityScore: 35,
                        environmentalImpact: "Grease-soaked cardboard contaminates recycling batches. Grease doesn't separate in pulping process. However, greasy cardboard can be composted in many systems.",
                        recyclingMethod: "Grease-contaminated cardboard usually not recyclable. 1. Tear off clean sections (lid)—recycle those. 2. Compost greasy bottom portion if accepted locally. 3. If composting unavailable, dispose as regular waste. 4. NEVER place greasy cardboard in paper recycling."
                    }
                ],
                greenImpactScore: 71,
                impactExplanation: "Mixed kitchen waste requires careful sorting. High-value recyclables (glass, aluminium, clean PET) should be separated from contaminated items (greasy cardboard, plastic utensils) and compostable organics (food waste). Proper separation significantly improves recycling outcomes.",
                actionPlan: [
                    "Rinse ALL food containers before recycling—contamination ruins entire batches",
                    "Separate food waste for composting (home or municipal program)",
                    "Group recyclables: PET bottles together, glass together, metal together",
                    "Remove greasy sections from cardboard—compost or trash greasy parts",
                    "Dispose non-recyclable items (plastic utensils) in regular waste",
                    "Ball up small foil pieces for easier mechanical sorting",
                    "Consider reusable alternatives to reduce single-use packaging"
                ]
            },

            // Scenario 4: Beverage containers and packaging
            {
                objects: [
                    {
                        name: "Glass bottles (clear)",
                        material: "Clear Glass",
                        quantity: 6,
                        quantityConfidence: 93,
                        estimatedWeightGrams: 950,
                        weightConfidence: 72,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 98,
                        environmentalImpact: "Glass is inert and does not degrade, so it persists indefinitely in landfills. However, glass is 100% recyclable without quality loss and can be recycled endlessly. Recycling glass saves raw materials (sand, soda ash, limestone), reduces energy consumption by 30%, and prevents mining environmental damage.",
                        recyclingMethod: "1. Remove caps, lids, and cork stoppers. 2. Rinse bottles to remove contents. 3. Labels usually don't need removal (burned off during recycling). 4. Separate by color if required (clear, brown, green). 5. Do not include window glass, ceramics, or heat-resistant glass (Pyrex) in bottle recycling. 6. Place in glass recycling container."
                    },
                    {
                        name: "Glass bottles (colored)",
                        material: "Colored Glass",
                        quantity: 4,
                        quantityConfidence: 89,
                        estimatedWeightGrams: 780,
                        weightConfidence: 68,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 97,
                        environmentalImpact: "Colored glass (brown, green, amber) is used for light-sensitive products. Fully recyclable but sometimes requires color separation. Recycling maintains color properties for new containers.",
                        recyclingMethod: "1. Remove all closures. 2. Rinse clean. 3. Some facilities want colored glass separate from clear. 4. Labels okay to leave. 5. Never mix with drinking glasses, ceramics, or window glass. 6. Place in appropriate glass recycling."
                    },
                    {
                        name: "Plastic bottle caps",
                        material: "HDPE/PP Plastic",
                        quantity: 10,
                        quantityConfidence: 82,
                        estimatedWeightGrams: 65,
                        weightConfidence: 56,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 75,
                        environmentalImpact: "Bottle caps are often different plastic than bottles (HDPE/PP vs PET). Small caps can jam sorting equipment. However, many facilities now accept caps if left on bottles.",
                        recyclingMethod: "Modern guidance: Leave caps ON bottles when recycling (easier to capture). Some older programs want caps separate. 1. Check local guidance. 2. If removing, collect caps in larger container for recycling. 3. Loose caps may fall through sorting equipment."
                    },
                    {
                        name: "Aluminium cans",
                        material: "Aluminium",
                        quantity: 8,
                        quantityConfidence: 94,
                        estimatedWeightGrams: 120,
                        weightConfidence: 71,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 99,
                        environmentalImpact: "Aluminium cans have highest recycling value. Infinitely recyclable. Recycling saves 95% energy vs virgin production. Can be recycled and back on shelf as new can within 60 days.",
                        recyclingMethod: "1. Empty completely and rinse. 2. Crushing okay but not required. 3. Leave tabs attached. 4. High scrap value ensures strong recycling market. 5. Place in metal/aluminium recycling."
                    },
                    {
                        name: "Steel/tin cans",
                        material: "Steel",
                        quantity: 3,
                        quantityConfidence: 87,
                        estimatedWeightGrams: 185,
                        weightConfidence: 63,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 96,
                        environmentalImpact: "Steel cans are magnetic and easily sorted. Highly recyclable. Steel recycling prevents mining, saves energy, reduces CO2 emissions. Tin coating doesn't affect recycling.",
                        recyclingMethod: "1. Remove paper labels (optional). 2. Rinse to remove food residue. 3. Leave both ends if cutting can open. 4. Magnets separate steel from aluminium automatically. 5. Place in metal recycling."
                    },
                    {
                        name: "Carton containers (Tetra Pak)",
                        material: "Multi-layer (paper/plastic/aluminium)",
                        quantity: 5,
                        quantityConfidence: 78,
                        estimatedWeightGrams: 240,
                        weightConfidence: 51,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 52,
                        environmentalImpact: "Drink cartons are multi-layer: paperboard + plastic + aluminium foil. Recycling requires specialized facilities to separate layers. Not all municipalities accept. Better than single-use plastic but challenging to recycle.",
                        recyclingMethod: "1. Check if local program accepts cartons (not universal). 2. Rinse and flatten. 3. Remove straws/caps (different material). 4. Look for carton recycling symbol. 5. If not accepted, dispose as regular waste—don't contaminate paper recycling."
                    }
                ],
                greenImpactScore: 89,
                impactExplanation: "Beverage container mix with high recyclability. Glass and aluminium are top-tier recyclables. Steel cans recycle well. Tetra Paks require special handling. Proper sorting and rinsing maximize recycling success.",
                actionPlan: [
                    "Rinse all beverage containers thoroughly",
                    "Separate glass by color if required by local facility",
                    "Leave caps on plastic bottles (modern guideline) or follow local rules",
                    "Group metal cans together (aluminium and steel will be separated automatically)",
                    "Flatten Tetra Pak cartons after rinsing",
                    "Verify local program accepts cartons before placing in recycling",
                    "Deliver sorted containers to designated recycling points"
                ]
            },

            // Scenario 5: Electronics and mixed household waste
            {
                objects: [
                    {
                        name: "Mobile phone/Smartphone",
                        material: "E-Waste (Mixed Electronics)",
                        quantity: 2,
                        quantityConfidence: 79,
                        estimatedWeightGrams: 285,
                        weightConfidence: 52,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 72,
                        environmentalImpact: "Smartphones contain 40+ elements including gold, silver, copper, rare earths, plus hazardous materials (lithium, lead, mercury). Mining these creates massive environmental damage. One ton of smartphones contains more gold than one ton of gold ore. Improper disposal leaches toxins into soil/water.",
                        recyclingMethod: "NEVER trash. 1. Factory reset to delete data. 2. Remove SIM/memory cards. 3. Keep chargers with phone. 4. Check manufacturer trade-in/takeback. 5. Electronics retailers often accept. 6. Donate working phones. 7. Use certified e-waste recycler."
                    },
                    {
                        name: "Batteries (mixed types)",
                        material: "Hazardous Waste",
                        quantity: 8,
                        quantityConfidence: 83,
                        estimatedWeightGrams: 120,
                        weightConfidence: 47,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 68,
                        environmentalImpact: "Batteries contain heavy metals (mercury, lead, cadmium) and corrosive materials. Landfilled batteries leak toxins contaminating groundwater. Fires at waste facilities often caused by lithium batteries. Recycling recovers valuable materials and prevents pollution.",
                        recyclingMethod: "NEVER trash batteries. 1. Tape lithium battery terminals (fire risk). 2. Keep different types separate if possible. 3. Many retailers have battery collection boxes. 4. Municipal hazardous waste programs accept. 5. Never incinerate or puncture."
                    },
                    {
                        name: "Cables and chargers",
                        material: "E-Waste (Wiring/Copper)",
                        quantity: 6,
                        quantityConfidence: 75,
                        estimatedWeightGrams: 240,
                        weightConfidence: 49,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 78,
                        environmentalImpact: "Cables contain copper wire (valuable) wrapped in plastic insulation. Burning cables for copper (common in informal recycling) releases toxic fumes. Proper recycling separates copper from plastic safely.",
                        recyclingMethod: "1. Bundle cables together. 2. Include with e-waste recycling (don't trash). 3. Scrap metal yards accept copper cables. 4. Some retailers accept cables. 5. Working chargers can be donated."
                    },
                    {
                        name: "Small appliance/gadget",
                        material: "E-Waste",
                        quantity: 1,
                        quantityConfidence: 68,
                        estimatedWeightGrams: 620,
                        weightConfidence: 41,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 64,
                        environmentalImpact: "Small electronics contain circuit boards, metals, plastics, and sometimes hazardous components. Represent significant resource value (metals, rare elements) but require proper disassembly for safe material recovery.",
                        recyclingMethod: "1. Check if item works—donate if functional. 2. Remove batteries before recycling. 3. E-waste recycling programs accept small appliances. 4. Never place in regular trash. 5. Specialized facilities dismantle and sort materials."
                    },
                    {
                        name: "Plastic packaging (electronics)",
                        material: "Mixed Plastic",
                        quantity: 4,
                        quantityConfidence: 71,
                        estimatedWeightGrams: 180,
                        weightConfidence: 44,
                        biodegradable: false,
                        recyclable: false,
                        recyclabilityScore: 18,
                        environmentalImpact: "Electronic packaging often uses mixed plastics, foam, and multi-layer materials for protection. Rarely recyclable through standard programs. Lightweight foam easily becomes litter.",
                        recyclingMethod: "1. Check for recycling symbols but most electronics packaging not recyclable. 2. Styrofoam/EPS often not accepted curbside. 3. Some shipping stores accept foam peanuts for reuse. 4. Plastic clamshell packaging usually trash. 5. Cardboard portions can be recycled."
                    },
                    {
                        name: "Lightbulbs (LED/CFL)",
                        material: "E-Waste/Hazardous",
                        quantity: 3,
                        quantityConfidence: 82,
                        estimatedWeightGrams: 95,
                        weightConfidence: 56,
                        biodegradable: false,
                        recyclable: true,
                        recyclabilityScore: 58,
                        environmentalImpact: "CFLs contain mercury (toxic). LEDs contain electronics and metals. Incandescent bulbs are just glass/metal. Broken CFL releases mercury vapor. All bulb types recyclable but require different handling.",
                        recyclingMethod: "CFL: NEVER trash (mercury hazard). 1. Keep unbroken—place in original packaging. 2. Hardware stores often accept CFLs. 3. Hazardous waste programs accept. LED: E-waste recycling. Incandescent: Some glass recycling accepts, or trash if no option."
                    }
                ],
                greenImpactScore: 54,
                impactExplanation: "E-waste and hazardous materials require specialized handling. High resource recovery potential (metals, rare elements) but improper disposal creates severe environmental and health risks. NEVER place in regular trash—use certified recycling programs.",
                actionPlan: [
                    "Separate e-waste from all other waste—NEVER use regular trash/recycling bins",
                    "Remove and separately recycle all batteries (fire and toxicity risk)",
                    "Wipe personal data from electronic devices before recycling",
                    "Bundle cables together for e-waste collection",
                    "Locate certified e-waste recycling facility or retailer takeback program",
                    "Handle CFL bulbs carefully—mercury hazard if broken",
                    "Donate functional electronics rather than recycling when possible",
                    "Dispose non-recyclable plastic packaging separately in regular waste"
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
                recommendedAction: "Report immediately to local authorities. Do not attempt cleanup without professional assessment due to potential hazardous material presence. Area requires official environmental impact assessment.",
                recommendedActions: [
                    "Document pollution with photos and location data",
                    "Report to municipal authorities and environmental protection agency",
                    "Do NOT attempt cleanup without professional hazard assessment",
                    "Request official environmental impact assessment",
                    "Install physical barriers or surveillance to prevent further dumping",
                    "Advocate for increased enforcement and penalties for illegal dumping"
                ],
                greenImpactScore: 42,
                impactExplanation: "Illegal dumping creates severe environmental and health risks. Professional cleanup and enforcement are essential to restore environmental quality and prevent recurrence."
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
                environmentalImpact: "Water pollution kills aquatic life, makes water unsafe for human use, disrupts entire aquatic ecosystems, contaminates drinking water sources, and affects communities dependent on water body for livelihood.",
                urgency: "Critical",
                recommendedAction: "Report immediately to water quality authorities and environmental protection agency. Avoid direct contact with water. Do not consume or use water until officially tested and declared safe.",
                recommendedActions: [
                    "Report immediately to water quality management authority",
                    "Document pollution source if identifiable",
                    "Avoid all contact with contaminated water",
                    "Alert downstream communities of potential contamination",
                    "Request emergency water quality testing",
                    "Identify and stop pollution source (industrial discharge, sewage leak, etc.)",
                    "Initiate investigation of responsible parties for legal action"
                ],
                greenImpactScore: 35,
                impactExplanation: "Water pollution has severe and immediate impacts on ecosystems and human health. Urgent action is required to identify source, stop contamination, and initiate remediation."
            }
        ];
    }

    async _simulateDelay() {
        const delay = 800 + Math.random() * 1200;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}
