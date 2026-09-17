# ECONEX NOVA

Environmental Intelligence Platform powered by AI

## Project Overview

ECONEX NOVA combines artificial intelligence with environmental science to help identify, understand, and act on waste, pollution, and sustainability challenges.

## Main Features

### 🌿 GreenVision AI

Upload environmental photos to:
- Verify image authenticity (detect AI-generated images)
- Detect waste materials and estimate quantity
- Analyze recyclability and environmental impact
- Get AI-powered action recommendations
- Identify pollution types and severity

### 🔗 Link Analyzer

Analyze URLs for:
- Security risks and phishing patterns
- Website authenticity verification
- Known service recognition

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Windows PowerShell or Git Bash

### 1. Start Backend Server

**Option A: Using Batch File (Windows)**

```cmd
START-SERVER.bat
```

**Option B: Manual Start**

```bash
cd econex-image-server
npm install
npm start
```

Server will start at: **http://localhost:3000**

### 2. Open Frontend

Open in browser:

```
ai-main/home.html
```

Or use VS Code Live Server.

### 3. Test Complete Flow

1. Click "GreenVision AI" on home page
2. Upload environmental image
3. Click "Analyze Image"
4. Wait for verification
5. Choose "Scan Waste" or "Scan Pollution"
6. View detailed analysis

## Project Structure

```
econexnova/
├── econex-image-server/          # Backend API server (NEW CLEAN BUILD)
│   ├── src/
│   │   ├── app.js                # Express app
│   │   ├── server.js             # Entry point
│   │   ├── config/               # Configuration
│   │   ├── controllers/          # Route controllers
│   │   ├── routes/               # API routes
│   │   ├── services/             # Business logic
│   │   │   ├── ai/               # AI providers
│   │   │   └── image/            # Image validation
│   │   ├── middleware/           # Express middleware
│   │   └── utils/                # Utilities
│   ├── uploads/                  # Temp upload directory
│   ├── .env                      # Environment config
│   ├── package.json
│   └── README.md
│
├── ai-main/                      # Frontend
│   ├── home.html                 # Home page (NEW)
│   ├── image.html                # GreenVision AI page
│   ├── link-detector.html        # Link analyzer
│   ├── logo.jpeg                 # Brand logo
│   └── (old server files - can be removed)
│
├── START-SERVER.bat              # Quick startup script
└── README.md                     # This file
```

## API Endpoints

### Health Check

```
GET http://localhost:3000/api/health
```

### Image Verification

```
POST http://localhost:3000/api/image/verify
Content-Type: multipart/form-data
Field: image (JPG/PNG, max 10MB)
```

### Waste Analysis

```
POST http://localhost:3000/api/waste/analyze
Content-Type: multipart/form-data
Field: image (JPG/PNG, max 10MB)
```

### Pollution Analysis

```
POST http://localhost:3000/api/pollution/analyze
Content-Type: multipart/form-data
Field: image (JPG/PNG, max 10MB)
```

## Testing with curl (PowerShell)

```powershell
# Health check
curl.exe http://localhost:3000/api/health

# Image verification
curl.exe -X POST http://localhost:3000/api/image/verify `
  -F "image=@test.jpg"

# Waste analysis
curl.exe -X POST http://localhost:3000/api/waste/analyze `
  -F "image=@test.jpg"

# Pollution analysis
curl.exe -X POST http://localhost:3000/api/pollution/analyze `
  -F "image=@test.jpg"
```

## Development Modes

### Mock Mode (Default)

No AI credentials needed. Returns realistic structured mock data.

Configured in `econex-image-server/.env`:

```env
AI_PROVIDER=mock
```

### AWS Bedrock Mode

Real AI vision analysis using Amazon Bedrock.

Configure in `econex-image-server/.env`:

```env
AI_PROVIDER=bedrock
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

## Technology Stack

### Backend

- Node.js + Express
- ES Modules
- Multer (file upload)
- CORS
- dotenv

### Frontend

- Pure HTML/CSS/JavaScript
- Modern responsive design
- No framework dependencies
- Premium eco-tech visual style

### AI Integration

- Mock Provider (development)
- AWS Bedrock (production-ready)
- Modular provider architecture

## Security Features

- File size limits (10MB max)
- MIME type validation
- Memory-based storage (no disk writes)
- CORS configuration
- No credentials in frontend
- Structured error handling

## Troubleshooting

### Server won't start

1. Check Node.js version: `node --version` (need 18+)
2. Check port 3000 not in use
3. Reinstall dependencies: `cd econex-image-server && npm install`

### Frontend can't connect

1. Verify server is running: `curl http://localhost:3000/api/health`
2. Check browser console for CORS errors
3. Verify API_BASE_URL in image.html points to http://localhost:3000

### Upload fails

1. File must be JPG/JPEG/PNG
2. File size must be under 10MB
3. Form field must be named "image"
4. Content-Type must be multipart/form-data

## Clean Build Notes

This is a **CLEAN REBUILD** of the image analysis system.

### What Changed

**REMOVED:**
- Old broken image-analysis implementations
- Mixed SAFNEX NOVA / ECONEX NOVA server code
- Duplicate conflicting endpoints

**NEW:**
- Clean modular backend structure
- Separate dedicated ECONEX NOVA image server
- Proper separation of concerns (routes/controllers/services)
- Provider abstraction for AI services
- Comprehensive error handling
- Professional project documentation

**KEPT:**
- Working image.html (already ECONEX NOVA branded)
- Link analyzer functionality (separate feature)
- Project branding and assets

## Development Roadmap

### Phase 1 (Current)
- ✅ Clean server architecture
- ✅ Mock mode for testing
- ✅ Image verification
- ✅ Waste analysis
- ✅ Pollution detection

### Phase 2 (Next)
- AWS Bedrock integration
- Real AI vision models
- Report generation/export
- Enhanced material database

### Phase 3 (Future)
- User accounts
- History tracking
- Community features
- Mobile apps

## License

ISC

## Support

For issues or questions:
- Check troubleshooting section
- Review backend logs
- Test API endpoints with curl
- Verify environment configuration

---

**ECONEX NOVA** — Environmental Intelligence for a Sustainable Future
