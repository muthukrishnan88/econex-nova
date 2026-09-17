// ECONEX NOVA - Frontend Configuration
// This file is loaded before the main application
// In production (Render), ECONEX_API_URL will be injected via build script

window.ECONEX_CONFIG = {
    API_URL: window.ECONEX_API_URL || 'http://localhost:3000',
    VERSION: '1.0.0',
    MODE: 'production'
};

console.log('[ECONEX] Config loaded:', window.ECONEX_CONFIG);
