import https from 'https';
import http from 'http';
import dns from 'node:dns/promises';
import net from 'node:net';

export class LinkAnalyzer {
    constructor() {
        this.knownPhishingPatterns = [
            'paypal-secure',
            'paypal-verify',
            'apple-id-locked',
            'amazon-security',
            'netflix-billing',
            'microsoft-verify'
        ];

        this.trustedDomains = [
            'google.com',
            'youtube.com',
            'facebook.com',
            'twitter.com',
            'github.com',
            'microsoft.com',
            'apple.com',
            'amazon.com'
        ];
    }

    async analyze(url) {
        try {
            const normalized = this._normalizeUrl(url);
            const parsed = new URL(normalized);

            const urlInfo = this._parseUrlStructure(parsed);

            const isBlocked = await this._isBlockedHost(parsed.hostname);
            if (isBlocked) {
                return {
                    success: false,
                    error: {
                        code: "BLOCKED_HOST",
                        message: "Private or local network URLs are not allowed."
                    }
                };
            }

            const security = this._analyzeSecurity(parsed, urlInfo);
            const website = this._detectWebsiteType(parsed);

            return {
                success: true,
                securityScore: security.score,
                riskScore: security.riskScore,
                verdict: security.verdict,
                riskLevel: security.riskLevel,
                confidence: security.confidence,
                url: urlInfo,
                website: {
                    name: website.name,
                    type: website.type,
                    category: website.category,
                    purpose: website.purpose,
                    confidence: website.confidence,
                    status: "Analyzed"
                },
                security: {
                    score: security.score,
                    riskScore: security.riskScore,
                    verdict: security.verdict,
                    riskLevel: security.riskLevel,
                    confidence: security.confidence,
                    indicators: security.indicators,
                    verification: security.verification,
                    knownPhishing: security.knownPhishing
                },
                questions: {
                    websiteType: website.type,
                    websiteContent: website.purpose,
                    whyScore: security.explanation
                }
            };

        } catch (error) {
            throw new Error(error.message || "Link analysis failed");
        }
    }

    _normalizeUrl(input) {
        let value = String(input || "").trim();

        if (!value) {
            throw new Error("URL is required.");
        }

        if (!/^https?:\/\//i.test(value)) {
            value = "https://" + value;
        }

        try {
            new URL(value);
            return value;
        } catch {
            throw new Error("Invalid URL format.");
        }
    }

    _parseUrlStructure(url) {
        const queryParams = {};
        for (const [key, value] of url.searchParams.entries()) {
            queryParams[key] = value;
        }

        return {
            raw: url.toString(),
            protocol: url.protocol.replace(":", ""),
            hostname: url.hostname,
            domain: url.hostname,
            rootDomain: this._getRootDomain(url.hostname),
            subdomain: this._getSubdomain(url.hostname),
            port: url.port || (url.protocol === "https:" ? "443" : "80"),
            path: url.pathname || "/",
            pathSegments: url.pathname.split("/").filter(Boolean),
            query: url.search ? url.search.substring(1) : "",
            queryParams,
            fragment: url.hash ? url.hash.substring(1) : "",
            length: url.toString().length,
            encodedContent: /%[0-9a-f]{2}/i.test(url.toString())
        };
    }

    _getRootDomain(hostname) {
        const parts = hostname.split(".").filter(Boolean);
        if (parts.length <= 2) return hostname;

        const specialSuffixes = [
            "co.uk", "org.uk", "com.au", "co.in", "com.br", "co.jp"
        ];
        const suffix = parts.slice(-2).join(".");

        if (specialSuffixes.includes(suffix)) {
            return parts.slice(-3).join(".");
        }

        return suffix;
    }

    _getSubdomain(hostname) {
        const root = this._getRootDomain(hostname);
        if (hostname === root) return "";
        if (hostname.endsWith("." + root)) {
            return hostname.slice(0, -(root.length + 1));
        }
        return "";
    }

    async _isBlockedHost(hostname) {
        const host = hostname.toLowerCase();
        const blockedNames = ["localhost", "localhost.localdomain", "ip6-localhost"];

        if (blockedNames.includes(host) || host.endsWith(".localhost") ||
            host.endsWith(".local") || host.endsWith(".internal")) {
            return true;
        }

        const family = net.isIP(host);
        if (family === 4) return this._isPrivateIPv4(host);
        if (family === 6) return this._isPrivateIPv6(host);

        try {
            const addresses = await dns.lookup(host, { all: true });
            return addresses.some(item => {
                if (item.family === 4) return this._isPrivateIPv4(item.address);
                return this._isPrivateIPv6(item.address);
            });
        } catch {
            return false;
        }
    }

    _isPrivateIPv4(ip) {
        const parts = ip.split(".").map(Number);
        if (parts.length !== 4 || parts.some(n => !Number.isInteger(n) || n < 0 || n > 255)) {
            return false;
        }
        const [a, b] = parts;
        return a === 0 || a === 10 || a === 127 ||
               (a === 172 && b >= 16 && b <= 31) ||
               (a === 192 && b === 168) ||
               (a === 169 && b === 254);
    }

    _isPrivateIPv6(ip) {
        const value = ip.toLowerCase();
        return value === "::" || value === "::1" ||
               value.startsWith("fc") || value.startsWith("fd") ||
               /^fe[89ab]/.test(value);
    }

    _analyzeSecurity(parsed, urlInfo) {
        let score = 50;
        const indicators = {
            positive: [],
            negative: [],
            neutral: []
        };

        // HTTPS check
        if (parsed.protocol === "https:") {
            score += 25;
            indicators.positive.push("Encrypted HTTPS connection");
        } else {
            score -= 20;
            indicators.negative.push("Unencrypted HTTP connection");
        }

        // Known trusted domain
        const isTrusted = this.trustedDomains.some(domain =>
            parsed.hostname.endsWith(domain)
        );
        if (isTrusted) {
            score += 20;
            indicators.positive.push("Known trusted domain");
        }

        // Phishing pattern check
        const hostname = parsed.hostname.toLowerCase();
        const hasPhishingPattern = this.knownPhishingPatterns.some(pattern =>
            hostname.includes(pattern)
        );
        if (hasPhishingPattern) {
            score -= 40;
            indicators.negative.push("Suspicious phishing-like pattern detected");
        }

        // Suspicious subdomain
        if (urlInfo.subdomain && urlInfo.subdomain.split(".").length > 2) {
            score -= 10;
            indicators.negative.push("Complex subdomain structure");
        }

        // IP address as hostname
        if (net.isIP(hostname)) {
            score -= 15;
            indicators.negative.push("Direct IP address instead of domain name");
        }

        // Long URL
        if (urlInfo.length > 100) {
            score -= 5;
            indicators.neutral.push("Unusually long URL");
        }

        // URL encoding
        if (urlInfo.encodedContent) {
            score -= 10;
            indicators.neutral.push("Contains URL-encoded characters");
        }

        score = Math.max(0, Math.min(100, score));
        const riskScore = 100 - score;

        let verdict, riskLevel, confidence;
        if (score >= 75) {
            verdict = "Safe";
            riskLevel = "Low";
            confidence = "High";
        } else if (score >= 50) {
            verdict = "Caution";
            riskLevel = "Medium";
            confidence = "Medium";
        } else {
            verdict = "Risky";
            riskLevel = "High";
            confidence = "High";
        }

        return {
            score,
            riskScore,
            verdict,
            riskLevel,
            confidence,
            indicators,
            verification: {
                https: parsed.protocol === "https:",
                trustedDomain: isTrusted,
                suspiciousPattern: hasPhishingPattern
            },
            knownPhishing: hasPhishingPattern,
            explanation: this._buildScoreExplanation(score, indicators)
        };
    }

    _detectWebsiteType(parsed) {
        const hostname = parsed.hostname.toLowerCase();
        const path = parsed.pathname.toLowerCase();

        // Known services
        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
            return {
                name: "YouTube",
                type: "Video Streaming Platform",
                category: "Entertainment",
                purpose: "Video sharing and streaming service",
                confidence: "High"
            };
        }

        if (hostname.includes('github.com')) {
            return {
                name: "GitHub",
                type: "Development Platform",
                category: "Technology",
                purpose: "Code hosting and version control",
                confidence: "High"
            };
        }

        if (hostname.includes('google.com')) {
            return {
                name: "Google",
                type: "Search Engine / Services",
                category: "Technology",
                purpose: "Search and online services",
                confidence: "High"
            };
        }

        // Generic detection
        if (path.includes('/shop') || path.includes('/cart') || path.includes('/product')) {
            return {
                name: hostname,
                type: "E-commerce Website",
                category: "Shopping",
                purpose: "Online shopping and products",
                confidence: "Medium"
            };
        }

        if (path.includes('/blog') || path.includes('/article') || path.includes('/post')) {
            return {
                name: hostname,
                type: "Blog / News Website",
                category: "Content",
                purpose: "Articles and blog content",
                confidence: "Medium"
            };
        }

        return {
            name: hostname,
            type: "General Website",
            category: "Unknown",
            purpose: "Purpose could not be determined from URL structure alone",
            confidence: "Low"
        };
    }

    _buildScoreExplanation(score, indicators) {
        const parts = [];

        if (score >= 75) {
            parts.push("This URL shows strong safety indicators.");
        } else if (score >= 50) {
            parts.push("This URL has mixed security signals - proceed with caution.");
        } else {
            parts.push("This URL shows multiple risk factors.");
        }

        if (indicators.positive.length > 0) {
            parts.push(`Positive: ${indicators.positive.join(', ')}.`);
        }

        if (indicators.negative.length > 0) {
            parts.push(`Concerns: ${indicators.negative.join(', ')}.`);
        }

        return parts.join(" ");
    }
}
