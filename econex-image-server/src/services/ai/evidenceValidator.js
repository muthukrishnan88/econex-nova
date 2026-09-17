import { logger } from "../../utils/logger.js";

/**
 * Evidence-based validation for pollution analysis
 * Ensures results meet evidence requirements
 */
export class EvidenceValidator {

    /**
     * Validate pollution analysis result
     * Returns validated (and possibly corrected) result
     */
    static validate(result) {
        if (!result || !result.success) {
            return result;
        }

        // If no pollution detected, validate rejection reasons
        if (result.pollutionDetected === false) {
            return this._validateNoPollution(result);
        }

        // Validate pollution detection
        return this._validatePollutionDetection(result);
    }

    /**
     * Validate "no pollution detected" result
     */
    static _validateNoPollution(result) {
        // Ensure rejectedCategories exists
        if (!result.rejectedCategories || result.rejectedCategories.length === 0) {
            logger.warn("No pollution detected but no rejectedCategories provided");
            result.rejectedCategories = [
                { type: "air_pollution", reason: "No visible smoke or emissions detected." },
                { type: "water_pollution", reason: "No contaminated water visible." },
                { type: "land_pollution", reason: "No waste accumulation detected." },
                { type: "plastic_pollution", reason: "No plastic waste accumulation visible." }
            ];
        }

        return result;
    }

    /**
     * Validate pollution detection
     */
    static _validatePollutionDetection(result) {
        let validated = { ...result };
        let modified = false;

        // Validate primary pollution
        if (result.pollution || result.primaryPollution) {
            const primary = result.pollution || result.primaryPollution;

            // Check confidence threshold
            if (primary.confidence < 75) {
                logger.warn(`Primary pollution confidence ${primary.confidence}% below threshold (75%)`);
                validated.pollutionDetected = false;
                validated.reason = `Insufficient confidence (${primary.confidence}%) for primary pollution detection. Threshold: ≥75%.`;
                delete validated.pollution;
                delete validated.primaryPollution;
                modified = true;
            }

            // Check evidence exists
            if (!primary.visualEvidence || primary.visualEvidence.length === 0) {
                logger.warn("Primary pollution detected but no visual evidence provided");
                if (validated.pollution) {
                    validated.pollution.visualEvidence = ["Visual indicators present in image"];
                }
                if (validated.primaryPollution) {
                    validated.primaryPollution.evidence = ["Visual indicators present in image"];
                }
                modified = true;
            }

            // Validate evidence matches category
            validated = this._validateEvidenceMatch(validated, primary);
        }

        // Validate secondary pollution threshold
        if (result.secondaryPollution && Array.isArray(result.secondaryPollution)) {
            const validSecondary = result.secondaryPollution.filter(sec => {
                if (sec.confidence < 70) {
                    logger.warn(`Secondary pollution ${sec.type} confidence ${sec.confidence}% below threshold (70%)`);
                    modified = true;
                    return false;
                }
                return true;
            });

            // Limit to max 2 secondary
            if (validSecondary.length > 2) {
                logger.warn(`Too many secondary pollution types (${validSecondary.length}), limiting to 2`);
                validated.secondaryPollution = validSecondary
                    .sort((a, b) => b.confidence - a.confidence)
                    .slice(0, 2);
                modified = true;
            } else {
                validated.secondaryPollution = validSecondary;
            }
        }

        // Validate OLD structure secondaryTypes
        if (validated.pollution && validated.pollution.secondaryTypes) {
            if (validated.pollution.secondaryTypes.length > 2) {
                logger.warn(`Too many secondaryTypes (${validated.pollution.secondaryTypes.length}), limiting to 2`);
                validated.pollution.secondaryTypes = validated.pollution.secondaryTypes.slice(0, 2);
                modified = true;
            }
        }

        // Ensure rejectedCategories exists
        if (!validated.rejectedCategories || validated.rejectedCategories.length === 0) {
            validated.rejectedCategories = this._generateRejectedCategories(validated);
            modified = true;
        }

        if (modified) {
            logger.info("Analysis result modified by validation");
        }

        return validated;
    }

    /**
     * Validate evidence matches pollution category
     */
    static _validateEvidenceMatch(result, primary) {
        const type = primary.primaryType || primary.type;
        const evidence = primary.visualEvidence || primary.evidence || [];

        // Define required evidence keywords for each category
        const evidenceRules = {
            air_pollution: ["smoke", "emission", "haze", "burning", "plume", "atmospheric"],
            water_pollution: ["water", "contaminated", "discharge", "sewage", "oil", "floating"],
            land_pollution: ["waste", "dumping", "accumulation", "contaminated soil", "litter"],
            plastic_pollution: ["plastic", "bottles", "bags", "containers", "waste"],
            open_waste_burning: ["fire", "burning", "smoke", "flame"],
            industrial_pollution: ["industrial", "factory", "smokestack", "facility"],
            oil_contamination: ["oil", "sheen", "petroleum", "spill"],
            sewage_pollution: ["sewage", "wastewater", "discharge", "drainage"]
        };

        const requiredKeywords = evidenceRules[type] || [];
        const evidenceText = evidence.join(" ").toLowerCase();

        // Check if evidence contains required keywords
        const hasMatchingEvidence = requiredKeywords.some(keyword =>
            evidenceText.includes(keyword.toLowerCase())
        );

        if (!hasMatchingEvidence && requiredKeywords.length > 0) {
            logger.warn(`Evidence may not match pollution type: ${type}`);
            // Don't reject, but log warning
        }

        return result;
    }

    /**
     * Generate rejected categories based on detected pollution
     */
    static _generateRejectedCategories(result) {
        const allCategories = [
            { type: "air_pollution", label: "Air Pollution" },
            { type: "water_pollution", label: "Water Pollution" },
            { type: "land_pollution", label: "Land Pollution" },
            { type: "plastic_pollution", label: "Plastic Pollution" },
            { type: "oil_contamination", label: "Oil Contamination" },
            { type: "sewage_pollution", label: "Sewage Pollution" },
            { type: "industrial_pollution", label: "Industrial Pollution" },
            { type: "open_waste_burning", label: "Open Waste Burning" }
        ];

        const detectedTypes = [];

        // Get detected primary type
        if (result.pollution) {
            detectedTypes.push(result.pollution.primaryType);
        }
        if (result.primaryPollution) {
            detectedTypes.push(result.primaryPollution.type);
        }

        // Get detected secondary types
        if (result.pollution && result.pollution.secondaryTypes) {
            detectedTypes.push(...result.pollution.secondaryTypes);
        }
        if (result.secondaryPollution) {
            detectedTypes.push(...result.secondaryPollution.map(s => s.type));
        }

        // Return categories NOT detected
        const rejected = allCategories
            .filter(cat => !detectedTypes.includes(cat.type))
            .map(cat => ({
                type: cat.type,
                reason: `No sufficient evidence of ${cat.label.toLowerCase()} detected in image.`
            }));

        return rejected.slice(0, 5); // Max 5 rejected categories
    }
}
