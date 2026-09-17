import crypto from "crypto";
import { logger } from "../../utils/logger.js";

/**
 * Image-based pollution analysis cache
 * Ensures same image produces same result
 * Cache key: imageHash + analysisVersion + modelVersion
 */
export class PollutionCache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 100; // Max cached results
        this.ttl = 3600000; // 1 hour TTL
        this.analysisVersion = "pollution-v3-evidence-first";
        logger.info("Pollution cache initialized");
    }

    /**
     * Generate stable hash from image buffer
     */
    hashImage(imageBuffer) {
        return crypto
            .createHash("sha256")
            .update(imageBuffer)
            .digest("hex");
    }

    /**
     * Generate cache key
     */
    getCacheKey(imageHash, modelVersion = "default") {
        return `${imageHash}:${this.analysisVersion}:${modelVersion}`;
    }

    /**
     * Get cached result if exists and not expired
     */
    get(imageBuffer, modelVersion = "default") {
        const imageHash = this.hashImage(imageBuffer);
        const key = this.getCacheKey(imageHash, modelVersion);

        const cached = this.cache.get(key);

        if (!cached) {
            return null;
        }

        // Check TTL
        const now = Date.now();
        if (now - cached.timestamp > this.ttl) {
            this.cache.delete(key);
            logger.debug(`Cache expired for image ${imageHash.substring(0, 8)}`);
            return null;
        }

        logger.info(`Cache hit for image ${imageHash.substring(0, 8)}`);
        return cached.result;
    }

    /**
     * Store result in cache
     */
    set(imageBuffer, result, modelVersion = "default") {
        const imageHash = this.hashImage(imageBuffer);
        const key = this.getCacheKey(imageHash, modelVersion);

        // Evict oldest if at max size
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, {
            result,
            timestamp: Date.now(),
            imageHash
        });

        logger.debug(`Cached result for image ${imageHash.substring(0, 8)}`);
    }

    /**
     * Clear entire cache
     */
    clear() {
        this.cache.clear();
        logger.info("Pollution cache cleared");
    }

    /**
     * Get cache stats
     */
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            ttl: this.ttl,
            analysisVersion: this.analysisVersion
        };
    }
}

// Singleton instance
export const pollutionCache = new PollutionCache();
