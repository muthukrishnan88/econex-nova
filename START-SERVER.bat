@echo off
echo ============================================
echo ECONEX NOVA - Image Server Startup
echo ============================================
echo.

cd econex-image-server

echo Installing dependencies...
call npm install
echo.

echo Starting server...
echo.
echo Server will be available at:
echo http://localhost:3000
echo.
echo Health check:
echo http://localhost:3000/api/health
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start
