// Enhanced waste results rendering
// To be integrated into image.html

function renderWasteResults(data) {
    const result = document.getElementById('analysisResult');
    const objects = Array.isArray(data.objects) ? data.objects : [];
    const summary = data.summary || {};
    const imageQuality = data.imageQuality || {};
    const materialBreakdown = data.materialBreakdown || [];
    const actionPlan = data.actionPlan || [];
    const limitations = data.limitations || [];

    let html = `
        <!-- Result Header -->
        <div class="result-header">
            <small>🌱 ECONEX NOVA · GreenVision AI</small>
            <h2>AI Environmental Analysis</h2>
        </div>

        <!-- Image Quality Indicator -->
        ${imageQuality.score ? `
            <div class="quality-indicator">
                <div class="quality-badge ${imageQuality.status}">
                    <span class="quality-icon">✓</span>
                    <span>Image Quality: ${imageQuality.status}</span>
                    <span class="quality-score">${imageQuality.score}/100</span>
                </div>
            </div>
        ` : ''}

        <!-- Summary Section -->
        <div class="summary-card">
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-icon">🔍</div>
                    <div class="summary-content">
                        <div class="summary-label">Objects Detected</div>
                        <div class="summary-value">${summary.totalObjects || objects.length}</div>
                    </div>
                </div>
                <div class="summary-item">
                    <div class="summary-icon">⚖️</div>
                    <div class="summary-content">
                        <div class="summary-label">Estimated Weight</div>
                        <div class="summary-value">${formatWeight(summary.estimatedTotalWeightGrams)}</div>
                        ${summary.estimatedWeightRange ? `
                            <div class="summary-sublabel">Range: ${formatWeight(summary.estimatedWeightRange.minGrams)} - ${formatWeight(summary.estimatedWeightRange.maxGrams)}</div>
                        ` : ''}
                    </div>
                </div>
            </div>
            <div class="weight-disclaimer">
                ⚠️ Weight is visually estimated and should be verified using a scale
            </div>
        </div>

        <!-- Material Breakdown -->
        ${materialBreakdown.length > 0 ? `
            <div class="material-breakdown-card">
                <h3>📊 Material Breakdown</h3>
                <div class="material-bars">
                    ${materialBreakdown.map(m => `
                        <div class="material-bar-item">
                            <div class="material-bar-header">
                                <span class="material-name">${m.material}</span>
                                <span class="material-percentage">${m.percentage}%</span>
                            </div>
                            <div class="material-bar-track">
                                <div class="material-bar-fill material-${m.material.toLowerCase()}" style="width: ${m.percentage}%"></div>
                            </div>
                            <div class="material-count">${m.count} item${m.count > 1 ? 's' : ''}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}

        <!-- Green Impact Score -->
        <div class="impact-score-card">
            <div class="score-ring-container">
                <svg class="score-ring" viewBox="0 0 200 200">
                    <circle class="score-ring-bg" cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="12"/>
                    <circle class="score-ring-fill" cx="100" cy="100" r="85" fill="none" stroke="url(#scoreGradient)" stroke-width="12"
                        stroke-dasharray="${(data.greenImpactScore || 0) * 5.34} 534"
                        stroke-dashoffset="0"
                        transform="rotate(-90 100 100)"/>
                    <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#39e58c"/>
                            <stop offset="100%" stop-color="#1fcf75"/>
                        </linearGradient>
                    </defs>
                </svg>
                <div class="score-value">
                    <div class="score-number">${data.greenImpactScore || 0}</div>
                    <div class="score-label">/ 100</div>
                </div>
            </div>
            <h3>Green Impact Score</h3>
            <p class="score-explanation">${data.impactExplanation || 'AI-generated environmental impact indicator based on detected materials and recyclability.'}</p>
        </div>

        <!-- Detected Objects -->
        <div class="objects-section">
            <h3>🔍 Detected Objects</h3>
            <div class="objects-grid">
    `;

    objects.forEach((item, index) => {
        const riskClass = getRiskClass(item.environmentalRisk);
        const confidenceClass = getConfidenceClass(item.detectionConfidence);

        html += `
            <div class="object-card">
                <div class="object-header">
                    <div class="object-title-group">
                        <h4 class="object-name">${item.name || 'Unknown Object'}</h4>
                        <div class="object-badges">
                            <span class="object-badge material">${item.material || 'Unknown'}</span>
                            ${item.subtype ? `<span class="object-badge subtype">${item.subtype}</span>` : ''}
                        </div>
                    </div>
                    <div class="object-meta">
                        <span class="object-quantity">Qty: ${item.quantity || '?'}</span>
                        <span class="object-confidence ${confidenceClass}">
                            ${item.detectionConfidence || 0}% confidence
                        </span>
                    </div>
                </div>

                <div class="object-stats-grid">
                    <div class="stat-item">
                        <div class="stat-icon">⚖️</div>
                        <div class="stat-content">
                            <div class="stat-label">Estimated Weight</div>
                            <div class="stat-value">${formatWeight(item.weight?.estimatedGrams)}</div>
                            ${item.weight?.minGrams && item.weight?.maxGrams ? `
                                <div class="stat-range">${formatWeight(item.weight.minGrams)} - ${formatWeight(item.weight.maxGrams)}</div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="stat-item">
                        <div class="stat-icon">🌱</div>
                        <div class="stat-content">
                            <div class="stat-label">Biodegradable</div>
                            <div class="stat-value">${item.biodegradable ? 'Yes' : 'No'}</div>
                        </div>
                    </div>

                    <div class="stat-item">
                        <div class="stat-icon">♻️</div>
                        <div class="stat-content">
                            <div class="stat-label">Recyclable</div>
                            <div class="stat-value">${item.recyclable ? 'Yes' : item.recyclable === false ? 'No' : 'Unknown'}</div>
                            ${item.recyclabilityScore ? `<div class="stat-sublabel">Score: ${item.recyclabilityScore}/100</div>` : ''}
                        </div>
                    </div>

                    <div class="stat-item">
                        <div class="stat-icon">⚠️</div>
                        <div class="stat-content">
                            <div class="stat-label">Environmental Risk</div>
                            <div class="stat-value risk-${riskClass}">${item.environmentalRisk || 'Unknown'}</div>
                        </div>
                    </div>
                </div>

                <div class="object-expandable">
                    <button class="expand-btn" onclick="toggleObjectDetails(${index})">
                        <span class="expand-text">View Details</span>
                        <span class="expand-icon">▼</span>
                    </button>
                    <div class="object-details" id="object-details-${index}">
                        ${item.environmentalImpact ? `
                            <div class="detail-section">
                                <div class="detail-icon">🌍</div>
                                <div class="detail-content">
                                    <h5>Environmental Impact</h5>
                                    <p>${item.environmentalImpact}</p>
                                </div>
                            </div>
                        ` : ''}

                        ${item.recyclingMethod ? `
                            <div class="detail-section">
                                <div class="detail-icon">♻️</div>
                                <div class="detail-content">
                                    <h5>How to Recycle</h5>
                                    <p>${item.recyclingMethod}</p>
                                </div>
                            </div>
                        ` : ''}

                        ${item.reuseIdeas && item.reuseIdeas.length > 0 ? `
                            <div class="detail-section">
                                <div class="detail-icon">💡</div>
                                <div class="detail-content">
                                    <h5>Reuse Ideas</h5>
                                    <ul class="reuse-list">
                                        ${item.reuseIdeas.map(idea => `<li>${idea}</li>`).join('')}
                                    </ul>
                                </div>
                            </div>
                        ` : ''}

                        ${item.disposalMethod ? `
                            <div class="detail-section">
                                <div class="detail-icon">🗑️</div>
                                <div class="detail-content">
                                    <h5>Proper Disposal</h5>
                                    <p>${item.disposalMethod}</p>
                                </div>
                            </div>
                        ` : ''}

                        ${item.recommendedAction ? `
                            <div class="detail-section recommended">
                                <div class="detail-icon">✅</div>
                                <div class="detail-content">
                                    <h5>Recommended Action</h5>
                                    <p><strong>${item.recommendedAction}</strong></p>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    // Action Plan
    if (actionPlan.length > 0) {
        html += `
            <div class="action-plan-card">
                <h3>🎯 Your Green Action Plan</h3>
                <div class="action-list">
                    ${actionPlan.map((action, i) => {
                        const priority = typeof action === 'object' ? action.priority : 'medium';
                        const actionText = typeof action === 'object' ? action.action : action;
                        return `
                            <div class="action-item priority-${priority}">
                                <div class="action-number">${i + 1}</div>
                                <div class="action-content">
                                    ${priority && priority !== 'medium' ? `<span class="priority-badge priority-${priority}">${priority}</span>` : ''}
                                    <p>${actionText}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // Limitations
    if (limitations.length > 0) {
        html += `
            <div class="limitations-card">
                <h4>⚠️ Important Limitations</h4>
                <ul class="limitations-list">
                    ${limitations.map(limitation => `<li>${limitation}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    // Action Buttons
    html += `
        <div class="action-buttons">
            <button type="button" class="action-btn primary" onclick="downloadReport()">
                📄 Download Report
            </button>
            <button type="button" class="action-btn secondary" onclick="shareReport()">
                🔗 Share Report
            </button>
            <button type="button" class="action-btn tertiary" onclick="resetToStart()">
                ← Analyze Another Image
            </button>
        </div>
    `;

    // Development Mode Notice
    if (data.isDevelopmentMode) {
        html += `
            <div class="dev-notice">
                🔧 <strong>Development Mode:</strong> ${data.note || 'This is simulated analysis.'}
            </div>
        `;
    }

    result.innerHTML = html;
}

// Helper functions
function formatWeight(grams) {
    if (!grams && grams !== 0) return 'Unknown';
    if (grams < 1000) return `${Math.round(grams)} g`;
    return `${(grams / 1000).toFixed(2)} kg`;
}

function getRiskClass(risk) {
    if (!risk) return 'unknown';
    return risk.toLowerCase().replace(/\s+/g, '-');
}

function getConfidenceClass(confidence) {
    if (!confidence) return 'low';
    if (confidence >= 85) return 'high';
    if (confidence >= 60) return 'medium';
    return 'low';
}

function toggleObjectDetails(index) {
    const details = document.getElementById(`object-details-${index}`);
    const btn = details.previousElementSibling;
    const icon = btn.querySelector('.expand-icon');

    if (details.classList.contains('open')) {
        details.classList.remove('open');
        icon.textContent = '▼';
        btn.querySelector('.expand-text').textContent = 'View Details';
    } else {
        details.classList.add('open');
        icon.textContent = '▲';
        btn.querySelector('.expand-text').textContent = 'Hide Details';
    }
}

function downloadReport() {
    alert('PDF report generation coming soon!');
    // TODO: Implement PDF generation
}

function shareReport() {
    if (navigator.share) {
        navigator.share({
            title: 'ECONEX NOVA - Environmental Analysis',
            text: 'Check out my environmental waste analysis from ECONEX NOVA',
            url: window.location.href
        }).catch(err => console.log('Share failed:', err));
    } else {
        alert('Share functionality not supported in this browser.');
    }
}
