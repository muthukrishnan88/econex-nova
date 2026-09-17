/**
 * Evidence-First Visual Detection
 * Extracts visible evidence from pollution analysis
 * Material ≠ Pollution logic enforced
 */

export class EvidenceExtractor {

    /**
     * Validate visible evidence structure
     * Returns normalized evidence object
     */
    static extractVisibleEvidence(analysisResult) {
        const evidence = {
            // Atmospheric/Air
            smoke: false,
            fire: false,
            flames: false,
            haze: false,
            emissions: false,
            visiblePlume: false,

            // Water
            water: false,
            contaminatedWater: false,
            waterDiscoloration: false,
            visibleDischarge: false,
            floatingDebris: false,
            oilSheen: false,
            foam: false,

            // Waste/Land
            plastic: false,
            plasticWaste: false,
            wasteAccumulation: false,
            dumping: false,
            garbagePile: false,
            landWaste: false,
            soilContamination: false,

            // Industrial
            industrialSource: false,
            factory: false,
            industrialDischarge: false,
            industrialWaste: false,

            // Sewage
            sewage: false,
            sewageOutflow: false,
            wastewater: false,
            drainageDischarge: false,

            // Burning
            burningWaste: false,
            activeCombustion: false,

            // Environmental
            vegetation: false,
            urbanArea: false,
            naturalWaterBody: false,

            confidence: {
                overall: 0,
                detailed: {}
            }
        };

        // Extract from various possible structures
        if (analysisResult.visibleEvidence) {
            Object.assign(evidence, analysisResult.visibleEvidence);
        }

        // Extract from description text
        if (analysisResult.scene && analysisResult.scene.description) {
            const desc = analysisResult.scene.description.toLowerCase();
            evidence.smoke = evidence.smoke || desc.includes('smoke');
            evidence.fire = evidence.fire || desc.includes('fire') || desc.includes('burning');
            evidence.water = evidence.water || desc.includes('water') || desc.includes('river');
            evidence.plastic = evidence.plastic || desc.includes('plastic');
            evidence.wasteAccumulation = evidence.wasteAccumulation || desc.includes('waste') || desc.includes('garbage');
        }

        // Extract from visual evidence array
        if (analysisResult.pollution && analysisResult.pollution.visualEvidence) {
            const evidenceList = analysisResult.pollution.visualEvidence.join(' ').toLowerCase();

            // Air/Smoke
            evidence.smoke = evidence.smoke || evidenceList.includes('smoke');
            evidence.fire = evidence.fire || evidenceList.includes('fire') || evidenceList.includes('flame');
            evidence.haze = evidence.haze || evidenceList.includes('haze');
            evidence.emissions = evidence.emissions || evidenceList.includes('emission');

            // Water
            evidence.contaminatedWater = evidence.contaminatedWater ||
                evidenceList.includes('contaminated water') ||
                evidenceList.includes('polluted water');
            evidence.waterDiscoloration = evidence.waterDiscoloration ||
                evidenceList.includes('discolor') ||
                evidenceList.includes('unusual color');
            evidence.oilSheen = evidence.oilSheen || evidenceList.includes('oil') || evidenceList.includes('sheen');

            // Waste
            evidence.plasticWaste = evidence.plasticWaste ||
                evidenceList.includes('plastic waste') ||
                evidenceList.includes('plastic accumulation');
            evidence.wasteAccumulation = evidence.wasteAccumulation ||
                evidenceList.includes('waste') ||
                evidenceList.includes('garbage') ||
                evidenceList.includes('litter');
            evidence.dumping = evidence.dumping || evidenceList.includes('dump');

            // Burning
            evidence.burningWaste = evidence.burningWaste ||
                evidenceList.includes('burning') ||
                evidenceList.includes('combustion');

            // Industrial
            evidence.industrialSource = evidence.industrialSource ||
                evidenceList.includes('industrial') ||
                evidenceList.includes('factory');
        }

        return evidence;
    }

    /**
     * Validate Material vs Pollution
     * Returns validation result
     */
    static validateMaterialVsPollution(evidence, detectedType) {
        const validation = {
            valid: false,
            reason: '',
            materialPresent: false,
            pollutionEvidence: false
        };

        switch (detectedType) {
            case 'plastic_pollution':
                validation.materialPresent = evidence.plastic;
                validation.pollutionEvidence = evidence.plasticWaste || evidence.wasteAccumulation;

                if (evidence.plastic && !evidence.plasticWaste && !evidence.wasteAccumulation) {
                    validation.valid = false;
                    validation.reason = 'Plastic material visible but no evidence of plastic pollution accumulation';
                } else if (evidence.plasticWaste || evidence.wasteAccumulation) {
                    validation.valid = true;
                    validation.reason = 'Plastic waste accumulation supports plastic pollution classification';
                }
                break;

            case 'air_pollution':
                validation.pollutionEvidence = evidence.smoke || evidence.emissions || evidence.haze;

                if (!validation.pollutionEvidence) {
                    validation.valid = false;
                    validation.reason = 'No visible smoke, emissions, or haze detected for air pollution';
                } else {
                    validation.valid = true;
                    validation.reason = 'Visible atmospheric pollution indicators support classification';
                }
                break;

            case 'water_pollution':
                validation.materialPresent = evidence.water;
                validation.pollutionEvidence = evidence.contaminatedWater ||
                    evidence.waterDiscoloration ||
                    evidence.visibleDischarge ||
                    evidence.floatingDebris ||
                    evidence.oilSheen;

                if (evidence.water && !validation.pollutionEvidence) {
                    validation.valid = false;
                    validation.reason = 'Water visible but no contamination evidence detected';
                } else if (validation.pollutionEvidence) {
                    validation.valid = true;
                    validation.reason = 'Contaminated water evidence supports water pollution classification';
                }
                break;

            case 'open_waste_burning':
                validation.pollutionEvidence = evidence.fire && evidence.burningWaste && evidence.smoke;

                if (evidence.smoke && !evidence.fire) {
                    validation.valid = false;
                    validation.reason = 'Smoke visible but no fire/burning evidence detected';
                } else if (evidence.fire && !evidence.burningWaste) {
                    validation.valid = false;
                    validation.reason = 'Fire visible but no waste burning evidence';
                } else if (validation.pollutionEvidence) {
                    validation.valid = true;
                    validation.reason = 'Fire + burning waste + smoke support open waste burning classification';
                }
                break;

            case 'land_pollution':
                validation.pollutionEvidence = evidence.wasteAccumulation ||
                    evidence.dumping ||
                    evidence.garbagePile ||
                    evidence.landWaste;

                if (!validation.pollutionEvidence) {
                    validation.valid = false;
                    validation.reason = 'No waste accumulation or dumping evidence detected';
                } else {
                    validation.valid = true;
                    validation.reason = 'Waste accumulation supports land pollution classification';
                }
                break;

            case 'industrial_pollution':
                validation.materialPresent = evidence.industrialSource || evidence.factory;
                validation.pollutionEvidence = evidence.industrialDischarge ||
                    evidence.industrialWaste ||
                    evidence.emissions;

                if (validation.materialPresent && !validation.pollutionEvidence) {
                    validation.valid = false;
                    validation.reason = 'Industrial facility visible but no pollution discharge/emissions detected';
                } else if (validation.pollutionEvidence) {
                    validation.valid = true;
                    validation.reason = 'Industrial pollution source with visible discharge/emissions';
                }
                break;

            case 'oil_contamination':
                validation.pollutionEvidence = evidence.oilSheen;

                if (!evidence.oilSheen) {
                    validation.valid = false;
                    validation.reason = 'No visible oil sheen or petroleum contamination detected';
                } else {
                    validation.valid = true;
                    validation.reason = 'Visible oil sheen supports oil contamination classification';
                }
                break;

            case 'sewage_pollution':
                validation.pollutionEvidence = evidence.sewage ||
                    evidence.sewageOutflow ||
                    evidence.wastewater ||
                    evidence.drainageDischarge;

                if (!validation.pollutionEvidence) {
                    validation.valid = false;
                    validation.reason = 'No sewage discharge or wastewater evidence detected';
                } else {
                    validation.valid = true;
                    validation.reason = 'Sewage discharge evidence supports sewage pollution classification';
                }
                break;

            default:
                validation.valid = true;
                validation.reason = 'Category validation not yet implemented';
        }

        return validation;
    }

    /**
     * Extract category-specific evidence
     */
    static extractCategoryEvidence(analysisResult, categoryType) {
        const evidence = [];

        if (!analysisResult.pollution || !analysisResult.pollution.visualEvidence) {
            return evidence;
        }

        const allEvidence = analysisResult.pollution.visualEvidence;

        // Category-specific keywords
        const keywords = {
            'air_pollution': ['smoke', 'emission', 'haze', 'plume', 'atmospheric', 'combustion'],
            'water_pollution': ['water', 'contaminated', 'discharge', 'floating', 'discolor', 'sewage'],
            'plastic_pollution': ['plastic', 'bottle', 'container', 'bag', 'waste'],
            'land_pollution': ['waste', 'dump', 'garbage', 'litter', 'accumulation', 'soil'],
            'open_waste_burning': ['fire', 'burning', 'flame', 'smoke', 'combustion'],
            'industrial_pollution': ['industrial', 'factory', 'facility', 'smokestack'],
            'oil_contamination': ['oil', 'sheen', 'petroleum', 'spill'],
            'sewage_pollution': ['sewage', 'wastewater', 'drainage', 'outflow']
        };

        const categoryKeywords = keywords[categoryType] || [];

        // Filter evidence that matches category
        allEvidence.forEach(item => {
            const itemLower = item.toLowerCase();
            const matches = categoryKeywords.some(keyword => itemLower.includes(keyword));
            if (matches) {
                evidence.push(item);
            }
        });

        return evidence;
    }

    /**
     * Calculate evidence strength score
     */
    static calculateEvidenceStrength(evidence, categoryType) {
        let score = 0;
        let maxScore = 100;

        switch (categoryType) {
            case 'air_pollution':
                if (evidence.smoke) score += 30;
                if (evidence.emissions) score += 25;
                if (evidence.haze) score += 20;
                if (evidence.visiblePlume) score += 15;
                if (evidence.fire) score += 10;
                break;

            case 'water_pollution':
                if (evidence.contaminatedWater) score += 30;
                if (evidence.waterDiscoloration) score += 20;
                if (evidence.visibleDischarge) score += 25;
                if (evidence.floatingDebris) score += 15;
                if (evidence.oilSheen) score += 10;
                break;

            case 'plastic_pollution':
                if (evidence.plasticWaste) score += 40;
                if (evidence.wasteAccumulation) score += 30;
                if (evidence.plastic) score += 20;
                if (evidence.dumping) score += 10;
                break;

            case 'open_waste_burning':
                if (evidence.fire) score += 35;
                if (evidence.burningWaste) score += 35;
                if (evidence.smoke) score += 30;
                break;

            case 'land_pollution':
                if (evidence.wasteAccumulation) score += 30;
                if (evidence.dumping) score += 30;
                if (evidence.garbagePile) score += 25;
                if (evidence.landWaste) score += 15;
                break;

            case 'industrial_pollution':
                if (evidence.industrialDischarge) score += 35;
                if (evidence.industrialSource) score += 20;
                if (evidence.emissions) score += 25;
                if (evidence.industrialWaste) score += 20;
                break;

            default:
                score = 50; // Default moderate score
        }

        return Math.min(score, maxScore);
    }
}
