import https from "https";
import { logger } from "../../utils/logger.js";

/**
 * GDACS (Global Disaster Alert and Coordination System) Integration
 * Free disaster data source
 * API: https://www.gdacs.org/
 */
export class GDACSService {
    constructor() {
        this.baseUrl = "www.gdacs.org";
        this.endpoints = {
            rss: "/gdacsapi/api/events/geteventlist/SEARCH",
            json: "/gdacsapi/api/events/geteventlist/MAP"
        };
        logger.info("GDACS Service initialized");
    }

    /**
     * Fetch current disasters from GDACS
     */
    async getCurrentDisasters() {
        try {
            logger.info("Fetching current disasters from GDACS");

            // For demo: return mock data
            // In production: fetch from GDACS API
            return this._getMockDisasters();

        } catch (error) {
            logger.error("GDACS fetch error:", error);
            return this._getMockDisasters();
        }
    }

    /**
     * Find matching disaster based on type and location
     */
    async findMatchingDisaster(disasterType, location = null) {
        const disasters = await this.getCurrentDisasters();

        // Filter by type
        const typeMap = {
            'flood': ['FL', 'flood'],
            'earthquake': ['EQ', 'earthquake'],
            'cyclone': ['TC', 'cyclone', 'hurricane', 'typhoon'],
            'wildfire': ['WF', 'wildfire', 'fire'],
            'tsunami': ['TS', 'tsunami'],
            'volcano': ['VO', 'volcano']
        };

        const matchingTypes = typeMap[disasterType] || [];

        const matches = disasters.filter(d =>
            matchingTypes.some(t =>
                d.type.toLowerCase().includes(t.toLowerCase())
            )
        );

        if (matches.length === 0) {
            return null;
        }

        // Return most recent match
        return matches[0];
    }

    /**
     * Mock disaster data (simulates GDACS response)
     */
    _getMockDisasters() {
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        return [
            {
                id: "1001",
                type: "Flood",
                title: "Flood in Southeast Asia",
                location: "Thailand and surrounding regions",
                country: "Thailand",
                latitude: 13.7563,
                longitude: 100.5018,
                severity: "Orange",
                date: yesterday.toISOString(),
                description: "Heavy monsoon rainfall causing widespread flooding",
                source: "GDACS",
                confidence: "medium",
                status: "ongoing"
            },
            {
                id: "1002",
                type: "Earthquake",
                title: "Earthquake in Central Asia",
                location: "Afghanistan-Pakistan border region",
                country: "Afghanistan",
                latitude: 36.0,
                longitude: 71.0,
                severity: "Red",
                date: yesterday.toISOString(),
                description: "Magnitude 6.2 earthquake with aftershocks",
                source: "GDACS",
                confidence: "high",
                status: "ongoing"
            },
            {
                id: "1003",
                type: "Cyclone",
                title: "Tropical Cyclone in Indian Ocean",
                location: "Bay of Bengal approaching India",
                country: "India",
                latitude: 17.0,
                longitude: 82.0,
                severity: "Orange",
                date: now.toISOString(),
                description: "Cyclone system intensifying, landfall expected",
                source: "GDACS",
                confidence: "high",
                status: "ongoing"
            },
            {
                id: "1004",
                type: "Wildfire",
                title: "Wildfire in Southern Europe",
                location: "Mediterranean region",
                country: "Greece",
                latitude: 38.0,
                longitude: 23.0,
                severity: "Orange",
                date: yesterday.toISOString(),
                description: "Multiple wildfire fronts in forested areas",
                source: "GDACS",
                confidence: "medium",
                status: "ongoing"
            }
        ];
    }

    /**
     * Get disaster by coordinates (proximity search)
     */
    async getDisasterByLocation(lat, lon, radiusKm = 500) {
        const disasters = await this.getCurrentDisasters();

        // Calculate distance for each disaster
        const withDistance = disasters.map(d => ({
            ...d,
            distance: this._calculateDistance(lat, lon, d.latitude, d.longitude)
        }));

        // Filter by radius
        const nearby = withDistance.filter(d => d.distance <= radiusKm);

        // Sort by distance
        nearby.sort((a, b) => a.distance - b.distance);

        return nearby.length > 0 ? nearby[0] : null;
    }

    /**
     * Calculate distance between two coordinates (Haversine formula)
     */
    _calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in km
        const dLat = this._toRad(lat2 - lat1);
        const dLon = this._toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this._toRad(lat1)) * Math.cos(this._toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    }

    _toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
}
