import { DisasterDetector } from "./disasterDetector.js";
import { GDACSService } from "./gdacsService.js";
import { ImageValidator } from "../image/imageValidator.js";
import { logger } from "../../utils/logger.js";

/**
 * Main Disaster Analysis Service
 * Combines image analysis + current disaster data
 */
export class DisasterAnalyzer {
    constructor() {
        this.detector = new DisasterDetector();
        this.gdacs = new GDACSService();
        logger.info("Disaster Analyzer initialized");
    }

    /**
     * Analyze disaster from uploaded image
     */
    async analyze(file) {
        try {
            // Validate image
            ImageValidator.validate(file);

            // Detect disaster from image
            const detection = await this.detector.analyze(file.buffer, file.mimetype);

            // Find matching current disaster data
            const matchingDisaster = await this.gdacs.findMatchingDisaster(
                detection.disaster.type
            );

            // Build complete response
            return {
                success: true,
                analysisType: "disaster",
                analysisMode: "AI",
                timestamp: new Date().toISOString(),

                // Image quality
                imageQuality: detection.imageQuality,

                // Disaster detection
                disaster: {
                    detected: detection.disaster.detected,
                    type: detection.disaster.type,
                    subtype: detection.disaster.subtype,
                    confidence: detection.disaster.confidence,
                    evidence: detection.disaster.evidence,
                    // Include historical disaster fields if present
                    ...(detection.disaster.isHistorical && {
                        isHistorical: detection.disaster.isHistorical,
                        name: detection.disaster.name,
                        location: detection.disaster.location,
                        date: detection.disaster.date,
                        casualties: detection.disaster.casualties,
                        damage: detection.disaster.damage,
                        impactDetails: detection.disaster.impactDetails
                    })
                },

                // Affected area (from GDACS data)
                affectedArea: matchingDisaster ? {
                    location: matchingDisaster.location,
                    country: matchingDisaster.country,
                    latitude: matchingDisaster.latitude,
                    longitude: matchingDisaster.longitude,
                    confidence: matchingDisaster.confidence,
                    status: matchingDisaster.status,
                    dataSource: matchingDisaster.source,
                    lastUpdated: matchingDisaster.date,
                    eventTitle: matchingDisaster.title,
                    severity: matchingDisaster.severity
                } : {
                    location: "Could not be reliably confirmed from available data",
                    confidence: "low",
                    dataSource: "none",
                    note: "No matching current disaster event found in open data sources"
                },

                // Concern score
                concernScore: detection.concernScore,

                // Impacts
                impacts: detection.impacts,

                // Safety guidance
                safetyGuidance: detection.safetyGuidance,

                // Disaster pathway
                pathway: detection.pathway,

                // Transparency
                transparency: {
                    verifiedFromImage: [
                        ...detection.disaster.evidence
                    ],
                    confirmedByOpenData: matchingDisaster ? [
                        `Current ${matchingDisaster.type.toLowerCase()} event identified`,
                        `Location: ${matchingDisaster.location}`,
                        `Source: ${matchingDisaster.source}`
                    ] : [],
                    estimated: [
                        "Disaster type classification",
                        "Impact assessment",
                        "Safety recommendations"
                    ],
                    notDetermined: matchingDisaster ? [
                        "Exact image capture location",
                        "Precise affected population count"
                    ] : [
                        "Image capture location",
                        "Current geographic event match",
                        "Affected population"
                    ]
                },

                // Limitations
                limitations: [
                    "Image analysis cannot measure disaster magnitude scientifically",
                    "Location matching depends on available open disaster data",
                    "Affected area confidence varies with data availability",
                    "This is not an official emergency alert system",
                    "Always follow official local emergency authorities"
                ],

                isDevelopmentMode: true
            };

        } catch (error) {
            logger.error("Disaster analysis error:", error);
            throw error;
        }
    }
}
