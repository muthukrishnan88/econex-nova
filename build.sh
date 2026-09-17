#!/bin/bash
# ECONEX NOVA - Frontend Build Script for Render
# Injects API URL into config.js during deployment

set -e

echo "======================================"
echo "ECONEX NOVA - Frontend Build"
echo "======================================"

# Check if ECONEX_API_URL is set
if [ -z "$ECONEX_API_URL" ]; then
    echo "WARNING: ECONEX_API_URL not set, using localhost"
    ECONEX_API_URL="http://localhost:3000"
fi

echo "API URL: $ECONEX_API_URL"

# Create config-injected.js with API URL
cat > config-injected.js << EOF
// Auto-generated during build - DO NOT EDIT
window.ECONEX_API_URL = '$ECONEX_API_URL';

EOF

# Append original config.js
cat config.js >> config-injected.js

# Replace config.js with injected version
mv config-injected.js config.js

echo "✓ API URL injected into config.js"
echo "======================================"
echo "Build complete"
echo "======================================"
