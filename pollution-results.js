// Enhanced pollution results rendering for ECONEX NOVA
// To be integrated into image.html

function renderPollutionResults(data) {
    const result = document.getElementById('analysisResult');

    const authenticity = data.authenticity || {};
    const scene = data.scene || {};
    const pollution = data.pollution || {};
    const healthImpact = data.healthImpact || {};
    const environmentalImpact = data.environmentalImpact || {};
    const pollutionPathway = data.pollutionPathway || [];
    const reductionPlan = data.reductionPlan || [];
    const preventionPlan = data.preventionPlan || [];
    const actionPriority = data.actionPriority || {};
    const measurement = data.measurement || {};
    const limitations = data.limitations || [];

    let html = `
        <!-- Result Header -->
        <div class="result-header">
            <small>🌍 ECONEX NOVA · GreenVision AI</small>
            <h2>Pollution Analysis Report</h2>
        </div>

        <!-- Authenticity Section -->
        ${authenticity.classification ? `
            <div class="authenticity-card ${getAuthenticityClass(authenticity.classification)}">
                <div class="auth-header">
                    <div class="auth-icon">${getAuthenticityIcon(authenticity.classification)}</div>
                    <div class="auth-content">
                        <h4>Image Authenticity Check</h4>
                        <div class="auth-status">${formatAuthenticity(authenticity.classification)}</div>
                        <div class="auth-confidence">Confidence: ${authenticity.confidence}%</div>
                    </div>
                </div>
                <p class="auth-message">${authenticity.message}</p>
                ${authenticity.classification === 'ai_generated_or_manipulated' ? `
                    <div class="auth-note">
                        ⚠️ Note: AI-generated or manipulated images can still represent real-world concepts. Image origin and factual truth are separate considerations.
                    </div>
                ` : ''}
            </div>
        ` : ''}

        <!-- Pollution Concern Score -->
        <div class="concern-score-card">
            <div class="concern-ring-container">
                <svg class="concern-ring" viewBox="0 0 200 200">
                    <circle class="concern-ring-bg" cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="12"/>
                    <circle class="concern-ring-fill ${getConcernColor(pollution.concernLevel)}" cx="100" cy="100" r="85" fill="none" stroke-width="12"
                        stroke-dasharray="${(pollution.concernScore || 0) * 5.34} 534"
                        stroke-dashoffset="0"
                        transform="rotate(-90 100 100)"/>
                </svg>
                <div class="concern-value">
                    <div class="concern-number">${pollution.concernScore || 0}</div>
                    <div class="concern-label">/ 100</div>
                </div>
            </div>
            <h3>Pollution Concern Score</h3>
            <div class="concern-level-badge ${getConcernLevelClass(pollution.concernLevel)}">
                ${formatConcernLevel(pollution.concernLevel)}
            </div>
            <p class="concern-note">Visual risk indicator based on visible evidence — not a direct pollutant measurement</p>
        </div>

        <!-- Detected Pollution -->
        <div class="pollution-detection-card">
            <h3>🔍 Detected Pollution</h3>
            <div class="pollution-type-grid">
                <div class="pollution-type-main">
                    <div class="type-label">Primary Type</div>
                    <div class="type-value">${formatPollutionType(pollution.primaryType)}</div>
                    ${pollution.primarySubtype ? `<div class="type-subtype">${formatSubtype(pollution.primarySubtype)}</div>` : ''}
                    <div class="type-confidence">Confidence: ${pollution.confidence}%</div>
                </div>
                ${pollution.secondaryTypes && pollution.secondaryTypes.length > 0 ? `
                    <div class="pollution-type-secondary">
                        <div class="type-label">Secondary</div>
                        ${pollution.secondaryTypes.map(type => `
                            <div class="secondary-type-badge">${formatPollutionType(type)}</div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>

        <!-- Visual Evidence -->
        ${pollution.visualEvidence && pollution.visualEvidence.length > 0 ? `
            <div class="evidence-card">
                <h3>👁️ Visual Evidence</h3>
                <div class="evidence-list">
                    ${pollution.visualEvidence.map(evidence => `
                        <div class="evidence-item">
                            <span class="evidence-check">✓</span>
                            <span class="evidence-text">${evidence}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="evidence-note">
                    Detection confidence: ${pollution.confidence}%
                </div>
            </div>
        ` : ''}

        <!-- Likely Sources -->
        ${pollution.likelySources && pollution.likelySources.length > 0 ? `
            <div class="sources-card">
                <h3>🎯 Likely Pollution Sources</h3>
                <div class="sources-list">
                    ${pollution.likelySources.map(source => `
                        <div class="source-item">
                            <div class="source-header">
                                <div class="source-name">${source.source}</div>
                                <div class="source-confidence">${source.confidence}% confidence</div>
                            </div>
                            <div class="source-evidence">
                                <strong>Evidence:</strong> ${source.evidence}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}

        <!-- Potential Pollutants -->
        ${pollution.potentialPollutants && pollution.potentialPollutants.length > 0 ? `
            <div class="pollutants-card">
                <h3>⚗️ Potential Pollutants</h3>
                <p class="pollutants-intro">Based on identified pollution source type:</p>
                <div class="pollutants-list">
                    ${pollution.potentialPollutants.map(pollutant => `
                        <div class="pollutant-item">${pollutant}</div>
                    `).join('')}
                </div>
                <div class="pollutants-disclaimer">
                    ⚠️ These are potential pollutants associated with the detected source type. Actual pollutant concentrations cannot be measured from this image.
                </div>
            </div>
        ` : ''}

        <!-- Health Impact -->
        ${healthImpact.summary ? `
            <div class="health-impact-card">
                <h3>🏥 Health Impact</h3>
                <p class="impact-summary">${healthImpact.summary}</p>
                ${healthImpact.possibleEffects && healthImpact.possibleEffects.length > 0 ? `
                    <div class="impact-section">
                        <h4>Possible Health Effects:</h4>
                        <ul class="impact-effects-list">
                            ${healthImpact.possibleEffects.map(effect => `
                                <li>${effect}</li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${healthImpact.note ? `
                    <div class="impact-note">
                        ℹ️ ${healthImpact.note}
                    </div>
                ` : ''}
            </div>
        ` : ''}

        <!-- Environmental Impact -->
        ${Object.keys(environmentalImpact).length > 0 ? `
            <div class="env-impact-card">
                <h3>🌿 Environmental Impact</h3>
                <div class="env-impact-grid">
                    ${environmentalImpact.air ? `
                        <div class="env-impact-item">
                            <div class="env-icon">💨</div>
                            <div class="env-content">
                                <h4>Air Quality</h4>
                                <p>${environmentalImpact.air}</p>
                            </div>
                        </div>
                    ` : ''}
                    ${environmentalImpact.water ? `
                        <div class="env-impact-item">
                            <div class="env-icon">💧</div>
                            <div class="env-content">
                                <h4>Water</h4>
                                <p>${environmentalImpact.water}</p>
                            </div>
                        </div>
                    ` : ''}
                    ${environmentalImpact.soil ? `
                        <div class="env-impact-item">
                            <div class="env-icon">🌱</div>
                            <div class="env-content">
                                <h4>Soil & Land</h4>
                                <p>${environmentalImpact.soil}</p>
                            </div>
                        </div>
                    ` : ''}
                    ${environmentalImpact.wildlife ? `
                        <div class="env-impact-item">
                            <div class="env-icon">🦋</div>
                            <div class="env-content">
                                <h4>Wildlife</h4>
                                <p>${environmentalImpact.wildlife}</p>
                            </div>
                        </div>
                    ` : ''}
                    ${environmentalImpact.climate ? `
                        <div class="env-impact-item">
                            <div class="env-icon">🌡️</div>
                            <div class="env-content">
                                <h4>Climate</h4>
                                <p>${environmentalImpact.climate}</p>
                            </div>
                        </div>
                    ` : ''}
                    ${environmentalImpact.ecosystem ? `
                        <div class="env-impact-item">
                            <div class="env-icon">🌍</div>
                            <div class="env-content">
                                <h4>Ecosystem</h4>
                                <p>${environmentalImpact.ecosystem}</p>
                            </div>
                        </div>
                    ` : ''}
                    ${environmentalImpact.marine ? `
                        <div class="env-impact-item">
                            <div class="env-icon">🌊</div>
                            <div class="env-content">
                                <h4>Marine</h4>
                                <p>${environmentalImpact.marine}</p>
                            </div>
                        </div>
                    ` : ''}
                    ${environmentalImpact.community ? `
                        <div class="env-impact-item">
                            <div class="env-icon">👥</div>
                            <div class="env-content">
                                <h4>Community</h4>
                                <p>${environmentalImpact.community}</p>
                            </div>
                        </div>
                    ` : ''}
                    ${environmentalImpact.general ? `
                        <div class="env-impact-item env-impact-full">
                            <div class="env-icon">ℹ️</div>
                            <div class="env-content">
                                <p>${environmentalImpact.general}</p>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        ` : ''}

        <!-- Pollution Pathway -->
        ${pollutionPathway.length > 0 ? `
            <div class="pathway-card">
                <h3>🔄 How This Pollution Was Created</h3>
                <p class="pathway-intro">Likely pollution pathway based on visual evidence:</p>
                <div class="pathway-steps">
                    ${pollutionPathway.map((step, index) => `
                        <div class="pathway-step">
                            <div class="pathway-number">${index + 1}</div>
                            <div class="pathway-text">${step}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}

        <!-- Reduction Plan -->
        ${reductionPlan.length > 0 ? `
            <div class="reduction-card">
                <h3>♻️ How to Reduce This Pollution</h3>
                <div class="reduction-list">
                    ${reductionPlan.map((action, index) => `
                        <div class="reduction-item">
                            <div class="reduction-number">${index + 1}</div>
                            <p>${action}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}

        <!-- Prevention Plan -->
        ${preventionPlan.length > 0 ? `
            <div class="prevention-card">
                <h3>🛡️ Prevent This Pollution</h3>
                <div class="prevention-list">
                    ${preventionPlan.map(action => `
                        <div class="prevention-item">
                            <span class="prevention-check">✓</span>
                            <span class="prevention-text">${action}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}

        <!-- Action Priority -->
        ${Object.keys(actionPriority).length > 0 ? `
            <div class="action-priority-card">
                <h3>⏱️ Action Priority</h3>
                ${actionPriority.now && actionPriority.now.length > 0 ? `
                    <div class="priority-section priority-now">
                        <h4>
                            <span class="priority-badge badge-now">NOW</span>
                            Immediate Actions
                        </h4>
                        <ul>
                            ${actionPriority.now.map(action => `<li>${action}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${actionPriority.next && actionPriority.next.length > 0 ? `
                    <div class="priority-section priority-next">
                        <h4>
                            <span class="priority-badge badge-next">NEXT</span>
                            Short-Term Actions
                        </h4>
                        <ul>
                            ${actionPriority.next.map(action => `<li>${action}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${actionPriority.longTerm && actionPriority.longTerm.length > 0 ? `
                    <div class="priority-section priority-long">
                        <h4>
                            <span class="priority-badge badge-long">LONG TERM</span>
                            Prevention Strategy
                        </h4>
                        <ul>
                            ${actionPriority.longTerm.map(action => `<li>${action}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        ` : ''}

        <!-- Measurement Status -->
        ${measurement.message ? `
            <div class="measurement-card">
                <h3>📊 Pollution Measurement Status</h3>
                <div class="measurement-content">
                    <div class="measurement-icon">${measurement.available ? '✅' : '❌'}</div>
                    <div class="measurement-text">
                        <p>${measurement.message}</p>
                        ${!measurement.available ? `
                            <div class="measurement-note">
                                Connect a compatible air-quality sensor or API for real-time pollutant concentration measurements.
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        ` : ''}

        <!-- AI Transparency -->
        <div class="transparency-card">
            <h3>🔍 AI Transparency</h3>
            <div class="transparency-grid">
                <div class="transparency-can">
                    <h4>What AI Can Determine:</h4>
                    <ul>
                        <li>✓ Visible pollution indicators in the image</li>
                        <li>✓ Scene characteristics and context</li>
                        <li>✓ Possible pollution sources based on visual evidence</li>
                        <li>✓ Potential environmental and health impacts</li>
                    </ul>
                </div>
                <div class="transparency-cannot">
                    <h4>What AI Cannot Determine:</h4>
                    <ul>
                        <li>× Exact pollutant concentrations</li>
                        <li>× Exact exposure levels for individuals</li>
                        <li>× Medical diagnosis</li>
                        <li>× Precise source attribution without additional data</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Limitations -->
        ${limitations.length > 0 ? `
            <div class="limitations-card">
                <h4>⚠️ Important Limitations</h4>
                <ul class="limitations-list">
                    ${limitations.map(limitation => `<li>${limitation}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

        <!-- Action Buttons -->
        <div class="action-buttons">
            <button type="button" class="action-btn primary" onclick="downloadPollutionReport()">
                📄 Download Report
            </button>
            <button type="button" class="action-btn secondary" onclick="shareReport()">
                🔗 Share Report
            </button>
            <button type="button" class="action-btn tertiary" onclick="resetToStart()">
                ← Analyze Another Image
            </button>
        </div>

        <!-- Development Mode Notice -->
        ${data.isDevelopmentMode ? `
            <div class="dev-notice">
                🔧 <strong>Development Mode:</strong> ${data.note || 'This is simulated analysis.'}
            </div>
        ` : ''}
    `;

    result.innerHTML = html;
}

// Helper Functions

function getAuthenticityClass(classification) {
    const classes = {
        'original_likely': 'auth-original',
        'uncertain': 'auth-uncertain',
        'ai_generated_or_manipulated': 'auth-ai'
    };
    return classes[classification] || 'auth-uncertain';
}

function getAuthenticityIcon(classification) {
    const icons = {
        'original_likely': '✓',
        'uncertain': '?',
        'ai_generated_or_manipulated': '⚠️'
    };
    return icons[classification] || '?';
}

function formatAuthenticity(classification) {
    const formats = {
        'original_likely': 'Original Photo Likely',
        'uncertain': 'Authenticity Uncertain',
        'ai_generated_or_manipulated': 'AI-Generated or Manipulated Detected'
    };
    return formats[classification] || 'Unknown';
}

function getConcernColor(level) {
    // Returns CSS class for concern ring color
    const colors = {
        'low': 'concern-low',
        'moderate': 'concern-moderate',
        'moderate_to_high': 'concern-moderate-high',
        'high': 'concern-high',
        'critical': 'concern-critical'
    };
    return colors[level] || 'concern-moderate';
}

function getConcernLevelClass(level) {
    const classes = {
        'low': 'level-low',
        'moderate': 'level-moderate',
        'moderate_to_high': 'level-moderate-high',
        'high': 'level-high',
        'critical': 'level-critical'
    };
    return classes[level] || 'level-moderate';
}

function formatConcernLevel(level) {
    const formats = {
        'low': 'LOW CONCERN',
        'moderate': 'MODERATE CONCERN',
        'moderate_to_high': 'MODERATE TO HIGH CONCERN',
        'high': 'HIGH CONCERN',
        'critical': 'CRITICAL CONCERN'
    };
    return formats[level] || 'MODERATE CONCERN';
}

function formatPollutionType(type) {
    const formats = {
        'air_pollution': 'Air Pollution',
        'water_pollution': 'Water Pollution',
        'land_pollution': 'Land Pollution',
        'plastic_pollution': 'Plastic Pollution',
        'noise_pollution': 'Noise Pollution',
        'soil_pollution': 'Soil Pollution',
        'light_pollution': 'Light Pollution'
    };
    return formats[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatSubtype(subtype) {
    return subtype.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function downloadPollutionReport() {
    alert('PDF pollution report generation coming soon!');
    // TODO: Implement PDF generation
}

function shareReport() {
    if (navigator.share) {
        navigator.share({
            title: 'ECONEX NOVA - Pollution Analysis',
            text: 'Check out this pollution analysis from ECONEX NOVA GreenVision AI',
            url: window.location.href
        }).catch(err => console.log('Share failed:', err));
    } else {
        alert('Share functionality not supported in this browser.');
    }
}
