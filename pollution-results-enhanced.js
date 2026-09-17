/**
 * ECONEX NOVA - Enhanced Pollution Results Renderer
 *
 * Evidence-First Pollution Analysis Display
 *
 * Features:
 * - Handles "no pollution detected" case
 * - Displays rejected categories (negative evidence)
 * - Supports new primaryPollution/secondaryPollution structure
 * - Dynamic environmental impact sections
 * - High precision, low false positive design
 *
 * INTEGRATION:
 * Replace the existing renderPollutionResults function in image.html with this one
 */

function renderPollutionResults(data) {
    const result = document.getElementById('analysisResult');

    // Handle both old and new data structures
    const authenticity = data.authenticity || {};
    const scene = data.scene || {};
    const healthImpact = data.healthImpact || {};
    const environmentalImpact = data.environmentalImpact || {};
    const pollutionPathway = data.pollutionPathway || [];
    const reductionPlan = data.reductionPlan || [];
    const preventionPlan = data.preventionPlan || [];
    const actionPriority = data.actionPriority || {};
    const measurement = data.measurement || {};
    const limitations = data.limitations || [];
    const rejectedCategories = data.rejectedCategories || [];

    // Handle new structure (primaryPollution/concern) or old structure (pollution)
    const primaryPollution = data.primaryPollution || {};
    const secondaryPollution = data.secondaryPollution || [];
    const concern = data.concern || {};
    const pollution = data.pollution || {}; // Fallback for old structure
    const likelySources = data.likelySources || pollution.likelySources || [];
    const potentialPollutants = data.potentialPollutants || pollution.potentialPollutants || [];
    const visualEvidence = primaryPollution.evidence || pollution.visualEvidence || [];

    // Detect if this is "no pollution detected" case
    const pollutionDetected = data.pollutionDetected !== false && (primaryPollution.type || pollution.primaryType);

    let html = `
        <div class="result-header">
            <small>🌿 ECONEX NOVA · GreenVision AI</small>
            <h2>Pollution Analysis Report</h2>
            <p class="result-subtitle">See Pollution. Understand Impact. Take Action.</p>
        </div>

        ${authenticity.classification ? `
            <div class="authenticity-card ${getAuthenticityClass(authenticity.classification)}">
                <div class="auth-header">
                    <div class="auth-icon">${getAuthenticityIcon(authenticity.classification)}</div>
                    <div class="auth-content">
                        <h4>Image Authenticity</h4>
                        <div class="auth-status">${formatAuthenticity(authenticity.classification)}</div>
                        <div class="auth-confidence">Confidence: ${authenticity.confidence}%</div>
                    </div>
                </div>
                <p class="auth-message">${authenticity.message}</p>
                ${authenticity.classification === 'ai_generated_or_manipulated' ? `
                    <div class="auth-note">
                        ⚠️ Image authenticity and factual truth are separate. AI-generated images can represent real concepts, but origin verification is not possible.
                    </div>
                ` : ''}
            </div>
        ` : ''}

        ${scene.description ? `
            <div class="scene-card">
                <h3>📷 Scene Analysis</h3>
                <p>${scene.description}</p>
                ${scene.imageQuality ? `<p class="scene-quality">Image Quality: ${scene.imageQuality}%</p>` : ''}
            </div>
        ` : ''}

        ${!pollutionDetected ? `
            <!-- NO POLLUTION DETECTED CASE -->
            <div class="no-pollution-card">
                <div class="no-pollution-icon">✓</div>
                <h3>No Clear Pollution Detected</h3>
                <p class="no-pollution-reason">${data.reason || 'No sufficient visual evidence of pollution event detected with confidence threshold ≥85%.'}</p>
                ${data.recommendation ? `
                    <div class="no-pollution-recommendation">
                        <h4>💡 Recommendations</h4>
                        <p>${data.recommendation}</p>
                    </div>
                ` : ''}
            </div>

            ${rejectedCategories.length > 0 ? `
                <div class="rejected-categories-card">
                    <h3>🔍 Pollution Types Checked</h3>
                    <p class="rejected-intro">Evidence-first analysis checked these pollution categories:</p>
                    <div class="rejected-list">
                        ${rejectedCategories.map(cat => `
                            <div class="rejected-item">
                                <span class="rejected-check">✓</span>
                                <div class="rejected-content">
                                    <div class="rejected-type">${formatPollutionType(cat.type)}</div>
                                    <div class="rejected-reason">${cat.reason}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        ` : `
            <!-- POLLUTION DETECTED CASE -->
            <div class="concern-score-card">
                <div class="concern-ring-container">
                    <svg class="concern-ring" viewBox="0 0 200 200">
                        <circle class="concern-ring-bg" cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="12"/>
                        <circle class="concern-ring-fill ${getConcernColor(concern.level || pollution.concernLevel)}" cx="100" cy="100" r="85" fill="none" stroke-width="12"
                            stroke-dasharray="${(concern.score || pollution.concernScore || 0) * 5.34} 534"
                            stroke-dashoffset="0"
                            transform="rotate(-90 100 100)"/>
                    </svg>
                    <div class="concern-value">
                        <div class="concern-number">${concern.score || pollution.concernScore || 0}</div>
                        <div class="concern-label">/ 100</div>
                    </div>
                </div>
                <h3>Pollution Concern Score</h3>
                <div class="concern-level-badge ${getConcernLevelClass(concern.level || pollution.concernLevel)}">
                    ${formatConcernLevel(concern.level || pollution.concernLevel)}
                </div>
                <p class="concern-note">${concern.explanation || 'Visual risk indicator based on visible evidence — not a direct pollutant measurement'}</p>
            </div>

            <div class="pollution-detection-card">
                <h3>🔥 Detected Pollution</h3>
                <div class="pollution-type-grid">
                    <div class="pollution-type-main">
                        <div class="type-label">Primary Type</div>
                        <div class="type-value">${primaryPollution.label || formatPollutionType(primaryPollution.type || pollution.primaryType)}</div>
                        ${(primaryPollution.subtype || pollution.primarySubtype) ? `<div class="type-subtype">${formatSubtype(primaryPollution.subtype || pollution.primarySubtype)}</div>` : ''}
                        <div class="type-confidence">Confidence: ${primaryPollution.confidence || pollution.confidence}%</div>
                    </div>
                    ${(secondaryPollution.length > 0 || (pollution.secondaryTypes && pollution.secondaryTypes.length > 0)) ? `
                        <div class="pollution-type-secondary">
                            <div class="type-label">Secondary</div>
                            ${secondaryPollution.length > 0
                                ? secondaryPollution.map(sec => `
                                    <div class="secondary-type-badge" title="Confidence: ${sec.confidence}%">${sec.label || formatPollutionType(sec.type)}</div>
                                `).join('')
                                : pollution.secondaryTypes.map(type => `
                                    <div class="secondary-type-badge">${formatPollutionType(type)}</div>
                                `).join('')
                            }
                        </div>
                    ` : ''}
                </div>
            </div>

            ${visualEvidence.length > 0 ? `
                <div class="evidence-card">
                    <h3>👁️ Visual Evidence</h3>
                    <p class="evidence-intro">Why was this detected:</p>
                    <div class="evidence-list">
                        ${visualEvidence.map(evidence => `
                            <div class="evidence-item">
                                <span class="evidence-check">✓</span>
                                <span class="evidence-text">${evidence}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="evidence-note">
                        Detection confidence: ${primaryPollution.confidence || pollution.confidence}%
                    </div>
                </div>
            ` : ''}

            ${likelySources.length > 0 ? `
                <div class="sources-card">
                    <h3>🎯 Likely Pollution Sources</h3>
                    <div class="sources-list">
                        ${likelySources.map(source => `
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

            ${potentialPollutants.length > 0 ? `
                <div class="pollutants-card">
                    <h3>⚗️ Potential Pollutants</h3>
                    <p class="pollutants-intro">Based on identified pollution source type:</p>
                    <div class="pollutants-list">
                        ${potentialPollutants.map(pollutant => `
                            <div class="pollutant-item">${pollutant}</div>
                        `).join('')}
                    </div>
                    <div class="pollutants-disclaimer">
                        ⚠️ These are potential pollutants associated with the detected source type. Actual pollutant concentrations cannot be measured from this image.
                    </div>
                </div>
            ` : ''}

            ${rejectedCategories.length > 0 ? `
                <div class="rejected-categories-card">
                    <h3>✓ Other Categories Checked</h3>
                    <p class="rejected-intro">These pollution types were evaluated but lacked sufficient evidence (confidence <70%):</p>
                    <div class="rejected-list-compact">
                        ${rejectedCategories.map(cat => `
                            <div class="rejected-item-compact">
                                ${formatPollutionType(cat.type)} — ${cat.reason}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${healthImpact.summary ? `
                <div class="health-impact-card">
                    <h3>🏥 Potential Health Impact</h3>
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
                        ${environmentalImpact.land ? `
                            <div class="env-impact-item">
                                <div class="env-icon">🏞️</div>
                                <div class="env-content">
                                    <h4>Land</h4>
                                    <p>${environmentalImpact.land}</p>
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
                                <div class="env-icon">🐠</div>
                                <div class="env-content">
                                    <h4>Marine Life</h4>
                                    <p>${environmentalImpact.marine}</p>
                                </div>
                            </div>
                        ` : ''}
                        ${environmentalImpact.community ? `
                            <div class="env-impact-item">
                                <div class="env-icon">🏘️</div>
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

            ${pollutionPathway.length > 0 ? `
                <div class="pathway-card">
                    <h3>🔄 How This Pollution May Have Been Created</h3>
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

            ${Object.keys(actionPriority).length > 0 ? `
                <div class="action-priority-card">
                    <h3>⏱️ Action Priority</h3>
                    ${actionPriority.now && actionPriority.now.length > 0 ? `
                        <div class="priority-section priority-now">
                            <h4>
                                <span class="priority-badge badge-now">DO NOW</span>
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
                                <span class="priority-badge badge-next">DO NEXT</span>
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
        `}

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

        <div class="transparency-card">
            <h3>🔍 What This Analysis Can Tell Us</h3>
            <div class="transparency-grid">
                <div class="transparency-can">
                    <h4>AI Can Determine:</h4>
                    <ul>
                        <li>✓ Visible pollution indicators</li>
                        <li>✓ Scene characteristics</li>
                        <li>✓ Possible pollution sources</li>
                        <li>✓ Potential impacts</li>
                    </ul>
                </div>
                <div class="transparency-cannot">
                    <h4>AI Cannot Measure:</h4>
                    <ul>
                        <li>× Exact pollutant concentrations</li>
                        <li>× Exact exposure levels</li>
                        <li>× Medical diagnosis</li>
                        <li>× Precise source attribution</li>
                    </ul>
                </div>
            </div>
        </div>

        ${limitations.length > 0 ? `
            <div class="limitations-card">
                <h4>⚠️ Important Limitations</h4>
                <ul class="limitations-list">
                    ${limitations.map(limitation => `<li>${limitation}</li>`).join('')}
                </ul>
            </div>
        ` : ''}

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

        ${data.isDevelopmentMode ? `
            <div class="dev-notice">
                🔧 <strong>Development Mode:</strong> ${data.note || 'This is simulated analysis.'}
            </div>
        ` : ''}
    `;

    result.innerHTML = html;
}

// Helper functions remain the same
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
    const labels = {
        'original_likely': 'Original Photo Likely',
        'uncertain': 'Authenticity Uncertain',
        'ai_generated_or_manipulated': 'AI-Generated or Manipulated'
    };
    return labels[classification] || 'Unknown';
}

function getConcernColor(level) {
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
    const labels = {
        'low': 'LOW CONCERN',
        'moderate': 'MODERATE CONCERN',
        'moderate_to_high': 'MODERATE-HIGH CONCERN',
        'high': 'HIGH CONCERN',
        'critical': 'CRITICAL CONCERN'
    };
    return labels[level] || 'MODERATE CONCERN';
}

function formatPollutionType(type) {
    if (!type) return 'Unknown';
    return type.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatSubtype(subtype) {
    if (!subtype) return '';
    return subtype.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function downloadPollutionReport() {
    alert('Download functionality would be implemented here');
}

function shareReport() {
    if (navigator.share) {
        navigator.share({
            title: 'ECONEX NOVA - Pollution Analysis Report',
            text: 'View this pollution analysis report'
        }).catch(err => console.log('Error sharing:', err));
    } else {
        alert('Share functionality not available on this device');
    }
}

function resetToStart() {
    window.location.reload();
}
