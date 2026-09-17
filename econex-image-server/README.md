# ECONEX NOVA - Environmental Image Intelligence Server

Clean, modular backend server for ECONEX NOVA GreenVision AI.

## Features

- **Image Authenticity Verification**: Detect AI-generated vs original photos
- **Waste Analysis**: Identify materials, quantity, recyclability
- **Pollution Detection**: Detect environmental pollution and recommend actions
- **Mock Mode**: Test complete flow without AI credentials
- **AWS Bedrock Ready**: Production AI integration prepared

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
NODE_ENV=development
AI_PROVIDER=mock
```

### 3. Run Server

Development mode (auto-restart on changes):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server starts at: **http://localhost:3000**

## API Endpoints

### Health Check

```bash
GET /api/health
```

### Image Verification

```bash
POST /api/image/verify
Content-Type: multipart/form-data
Field: image (JPG/JPEG/PNG, max 10MB)
```

Response:

```json
{
  "success": true,
  "imageType": "original",
  "confidence": 92,
  "accepted": true,
  "message": "Original photo accepted for environmental analysis.",
  "isDevelopmentMode": true
}
```

### Waste Analysis

```bash
POST /api/waste/analyze
Content-Type: multipart/form-data
Field: image (JPG/JPEG/PNG, max 10MB)
```

Response:

```json
{
  "success": true,
  "analysisType": "waste",
  "objects": [
    {
      "name": "Plastic bottle",
      "material": "PET Plastic",
      "quantity": 3,
      "estimatedWeightGrams": 90,
      "biodegradable": false,
      "recyclable": true,
      "recyclabilityScore": 92
    }
  ],
  "greenImpactScore": 84,
  "actionPlan": ["Separate materials", "Rinse containers", ...]
}
```

### Pollution Analysis

```bash
POST /api/pollution/analyze
Content-Type: multipart/form-data
Field: image (JPG/JPEG/PNG, max 10MB)
```

## Testing with curl

Windows PowerShell:

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

## Project Structure

```
econex-image-server/
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── config/
│   │   └── env.js             # Environment configuration
│   ├── controllers/
│   │   ├── image.controller.js
│   │   ├── waste.controller.js
│   │   └── pollution.controller.js
│   ├── routes/
│   │   ├── health.routes.js
│   │   ├── image.routes.js
│   │   ├── waste.routes.js
│   │   └── pollution.routes.js
│   ├── services/
│   │   ├── ai/
│   │   │   ├── aiProvider.js        # AI provider factory
│   │   │   ├── mockProvider.js      # Mock AI (development)
│   │   │   ├── bedrockProvider.js   # AWS Bedrock (production)
│   │   │   ├── imageVerifier.js
│   │   │   ├── wasteAnalyzer.js
│   │   │   └── pollutionAnalyzer.js
│   │   └── image/
│   │       └── imageValidator.js
│   ├── middleware/
│   │   ├── cors.js
│   │   ├── upload.js
│   │   └── errorHandler.js
│   └── utils/
│       └── logger.js
├── uploads/                    # Temporary upload directory
├── .env                        # Environment variables
├── .env.example                # Environment template
├── package.json
└── README.md
```

## Mock Mode (Development)

Default mode. No AI credentials needed. Returns realistic structured mock data for:

- Original photo: 60% probability
- AI-generated: 20% probability
- Uncertain: 20% probability

Waste and pollution analysis return demo objects with proper structure.

## AWS Bedrock Mode (Production)

Set in `.env`:

```env
AI_PROVIDER=bedrock
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key-id
AWS_SECRET_ACCESS_KEY=your-secret-key
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

Implementation of Bedrock integration is prepared but not complete.

## Error Handling

All errors return structured JSON:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

Error codes:

- `NO_FILE`: No image uploaded
- `FILE_TOO_LARGE`: File exceeds 10MB
- `UPLOAD_ERROR`: Multer error
- `BAD_REQUEST`: Invalid request
- `SERVER_ERROR`: Internal error

## Security

- File size limit: 10MB
- Allowed types: JPG, JPEG, PNG only
- MIME type validation
- Memory storage (no disk writes)
- CORS configuration
- No credentials in frontend
- No image data logged

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `AI_PROVIDER` | AI provider (mock/bedrock) | mock |
| `AWS_REGION` | AWS region | us-east-1 |
| `AWS_ACCESS_KEY_ID` | AWS access key | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | - |
| `BEDROCK_MODEL_ID` | Bedrock model ID | claude-3-sonnet |
| `MAX_FILE_SIZE_MB` | Max upload size | 10 |
| `ALLOWED_FILE_TYPES` | Allowed MIME types | image/jpeg,image/jpg,image/png |

## Frontend Integration

Frontend should connect to:

```javascript
const API_BASE_URL = window.ECONEX_API_URL || "http://localhost:3000";
```

Never hard-code production URLs.

## Troubleshooting

### Server won't start

Check:
1. Port 3000 not in use
2. Node.js version >= 18
3. Dependencies installed: `npm install`

### CORS errors

Add your frontend URL to `.env`:

```env
FRONTEND_URL=http://localhost:5174
```

### Upload fails

Check:
1. File is JPG/JPEG/PNG
2. File size under 10MB
3. Field name is "image"
4. Content-Type is multipart/form-data

## License

ISC
